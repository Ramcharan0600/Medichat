const router = require("express").Router();
const auth = require("../middleware/auth");
const Order = require("../models/Order");

// Delivery: list available
router.get("/available", auth(["delivery"]), async (_, res) => {
  const list = await Order.find({ status: "packed", deliveryAgent: { $exists: false } }).populate("items.medicine student");
  res.json(list);
});

// Delivery: my deliveries
router.get("/mine", auth(["delivery"]), async (req, res) => {
  const list = await Order.find({ deliveryAgent: req.user.id, status: { $ne: "delivered" } }).populate("items.medicine student");
  res.json(list);
});

// Delivery: accept order
router.patch("/:id/accept", auth(["delivery"]), async (req, res) => {
  const o = await Order.findByIdAndUpdate(req.params.id, { deliveryAgent: req.user.id, status: "out_for_delivery" }, { new: true });
  res.json(o);
});

// Delivery: mark delivered
router.patch("/:id/delivered", auth(["delivery"]), async (req, res) => {
  const o = await Order.findByIdAndUpdate(req.params.id, { status: "delivered", currentStep: 0 }, { new: true });
  res.json(o);
});

// Delivery: Statistics
router.get("/stats", auth(["delivery"]), async (req, res) => {
  try {
    const delivered = await Order.find({ deliveryAgent: req.user.id, status: "delivered" });
    const FEE = 30; // ₹30 per delivery
    
    const now = new Date();
    const startOfDay = new Date(now.setHours(0,0,0,0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
      totalOrders: delivered.length,
      totalEarned: delivered.length * FEE,
      daily: delivered.filter(o => o.updatedAt >= startOfDay).length * FEE,
      weekly: delivered.filter(o => o.updatedAt >= startOfWeek).length * FEE,
      monthly: delivered.filter(o => o.updatedAt >= startOfMonth).length * FEE,
      weeklyCount: delivered.filter(o => o.updatedAt >= startOfWeek).length
    };
    res.json(stats);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

// Delivery: Update real-time progress index
router.patch("/:id/progress", auth(["delivery"]), async (req, res) => {
  try {
    const { step } = req.body;
    const o = await Order.findByIdAndUpdate(req.params.id, { currentStep: step }, { new: true });
    res.json(o);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

module.exports = router;
