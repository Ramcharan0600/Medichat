require("dotenv").config({ override: true });
const mongoose = require("mongoose");
const Order = require("../models/Order");
const CampusGraph = require("../models/CampusGraph");
const { dijkstra, bfs } = require("../dsa/dijkstra");

// Helper from routes/orders.js
function toAdj(graphDoc) {
  const adj = {};
  graphDoc.nodes.forEach(n => adj[n] = []);
  graphDoc.edges.forEach(e => {
    adj[e.from].push({ to: e.to, weight: e.weight });
    adj[e.to].push({ to: e.from, weight: e.weight });
  });
  return adj;
}

async function recalculateRoutes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const graph = await CampusGraph.findOne({ name: "LPU_MAIN" });
    if (!graph) throw new Error("Graph not found!");
    const adj = toAdj(graph);

    const orders = await Order.find({ status: { $ne: "delivered" } });
    console.log(`Updating routes for ${orders.length} active orders...`);

    for (let order of orders) {
      if (!order.hostel) continue;
      const result = dijkstra(adj, "Chemist", order.hostel);
      const altPath = bfs(adj, "Chemist", order.hostel);
      
      order.route = result.path;
      order.routeDistance = result.distance;
      order.altRoute = altPath;
      await order.save();
      console.log(`Updated Order ${order._id}: ${result.path.join(" -> ")}`);
    }

    console.log("✅ All active order routes updated!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

recalculateRoutes();
