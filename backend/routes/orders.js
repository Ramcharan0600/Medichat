const router = require("express").Router();
const auth = require("../middleware/auth");
const Order = require("../models/Order");
const Medicine = require("../models/Medicine");
const CampusGraph = require("../models/CampusGraph");
const { dijkstra, bfs } = require("../dsa/dijkstra");
const { knapsack } = require("../dsa/knapsack");

// Place order
router.post("/", auth(["student"]), async (req, res) => {
  try {
    const { items, hostel, paymentMethod } = req.body;
    let total = 0;
    for (const it of items) {
      const m = await Medicine.findById(it.medicine);
      if (!m) return res.status(400).json({ msg: "Bad medicine" });
      total += m.price * it.qty;
    }
    const order = await Order.create({ 
      student: req.user.id, 
      items, 
      hostel, 
      total,
      paymentMethod: paymentMethod || "UPI",
      paymentStatus: "paid"
    });
    res.json(order);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

// Recommend best combo (DP — Knapsack)
router.post("/recommend", auth(["student"]), async (req, res) => {
  const { budget, category } = req.body;
  const filter = { stock: { $gt: 0 } };
  if (category) filter.category = category;
  
  const meds = await Medicine.find(filter);
  const result = knapsack(meds.map(m => ({ _id: m._id, name: m.name, price: m.price, benefit: m.benefit })), budget);
  res.json({ ...result, algorithm: "0/1 Knapsack DP" });
});

// Student: list own orders
router.get("/mine", auth(["student"]), async (req, res) => {
  try {
    const list = await Order.find({ student: req.user.id })
      .populate("items.medicine")
      .sort("-createdAt");
    res.json(list);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

// Shop: list incoming
router.get("/shop", auth(["shop"]), async (_, res) => {
  const list = await Order.find({ status: { $in: ["placed","packed"] } }).populate("items.medicine student").sort("createdAt");
  res.json(list);
});

// Shop: mark packed
router.patch("/:id/pack", auth(["shop"]), async (req, res) => {
  const o = await Order.findByIdAndUpdate(req.params.id, { status: "packed" }, { new: true });
  res.json(o);
});

// Helper: convert graph doc → adjacency list
function toAdj(graphDoc) {
  const adj = {};
  graphDoc.nodes.forEach(n => adj[n] = []);
  graphDoc.edges.forEach(e => {
    adj[e.from].push({ to: e.to, weight: e.weight });
    adj[e.to].push({ to: e.from, weight: e.weight }); // undirected
  });
  return adj;
}

// Delivery: optimize route using Dijkstra
router.post("/:id/route", auth(["delivery","shop"]), async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ msg: "Not found" });
  const graph = await CampusGraph.findOne({ name: "LPU_MAIN" });
  if (!graph) return res.status(500).json({ msg: "Campus graph missing — run seed" });
  const adj = toAdj(graph);
  
  const result = dijkstra(adj, "Chemist", order.hostel);
  const altPath = bfs(adj, "Chemist", order.hostel);
  
  order.route = result.path;
  order.routeDistance = result.distance;
  order.altRoute = altPath;
  await order.save();
  
  res.json({ 
    ...result, 
    alternative: { path: altPath, algorithm: "BFS (Fewest Hops)" },
    algorithm: "Dijkstra (Shortest Distance)" 
  });
});

module.exports = router;
