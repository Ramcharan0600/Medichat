const router = require("express").Router();
const auth = require("../middleware/auth");
const Medicine = require("../models/Medicine");
const Order = require("../models/Order");

// Public/Student: list all medicines
router.get("/items", auth(["student","shop","doctor","delivery"]), async (req, res) => {
  try {
    const meds = await Medicine.find({ stock: { $gt: 0 } }).sort("name");
    res.json(meds);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

// Check for medicine interactions (Safety Algorithm)
router.post("/check-conflicts", auth(["student"]), async (req, res) => {
  try {
    const { itemIds } = req.body;
    const meds = await Medicine.find({ _id: { $in: itemIds } });
    
    const detected = [];
    for (let i = 0; i < meds.length; i++) {
      for (let j = i + 1; j < meds.length; j++) {
        const m1 = meds[i];
        const m2 = meds[j];
        
        // Check if m1 conflicts with m2 or vice-versa
        const c1 = m1.conflicts.some(cid => String(cid) === String(m2._id));
        const c2 = m2.conflicts.some(cid => String(cid) === String(m1._id));
        
        if (c1 || c2) {
          detected.push({
            pair: [m1.name, m2.name],
            reason: m1.conflictReason || m2.conflictReason || "Unspecified interaction risk"
          });
        }
      }
    }
    res.json({ conflicts: detected, algorithm: "O(n²) Pairwise Conflict Search" });
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

// Shop: detailed inventory
router.get("/inventory", auth(["shop"]), async (req, res) => {
  try {
    const meds = await Medicine.find().sort("name");
    res.json(meds);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

// Shop: update medicine (price, stock, etc.)
router.patch("/medicine/:id", auth(["shop"]), async (req, res) => {
  try {
    const { price, stock } = req.body;
    const med = await Medicine.findByIdAndUpdate(req.params.id, { price, stock }, { new: true });
    res.json(med);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

// Shop: analytics & stats
router.get("/stats", auth(["shop"]), async (req, res) => {
  try {
    const meds = await Medicine.find();
    
    // Total Sold Calculation (summarize soldCount)
    const totalSold = meds.reduce((sum, m) => sum + (m.soldCount || 0), 0);
    
    // Requested Medicines (count total quantity in 'placed' orders)
    const openOrders = await Order.find({ status: "placed" });
    const requestedCount = openOrders.reduce((sum, o) => {
      return sum + o.items.reduce((iSum, item) => iSum + item.qty, 0);
    }, 0);

    // Low Stock (count meds with stock < 20)
    const lowStockCount = meds.filter(m => m.stock < 20).length;

    // Expiring Soon (count meds with expiry < 30 days)
    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() + 30);
    const expiringSoon = meds.filter(m => new Date(m.expiryDate) < thirtyDays).length;

    res.json({
      totalSold,
      requestedCount,
      lowStockCount,
      expiringSoon,
      totalInventoryValue: meds.reduce((sum, m) => sum + (m.price * m.stock), 0)
    });
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

module.exports = router;
