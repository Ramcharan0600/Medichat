const mongoose = require("mongoose");
const medSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  weight: { type: Number, default: 1 },   // for knapsack
  benefit: { type: Number, default: 1 },  // for knapsack
  soldCount: { type: Number, default: 0 },
  stock: { type: Number, default: 100 },
  expiryDate: { type: Date, required: true },
  category: String,
  prescription: { type: Boolean, default: false },
  conflicts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Medicine" }], // Harmful interactions
  conflictReason: String, // Why they conflict
}, { timestamps: true });
module.exports = mongoose.model("Medicine", medSchema);
