const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{ medicine: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" }, qty: Number }],
  total: Number,
  hostel: String,
  status: { type: String, enum: ["placed","packed","out_for_delivery","delivered","cancelled"], default: "placed" },
  paymentMethod: { type: String, enum: ["UPI", "Card", "Net Banking"], default: "UPI" },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "paid" },
  deliveryAgent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  route: [String],          // Dijkstra path nodes
  routeDistance: Number,    // total meters
  altRoute: [String],       // BFS path nodes (alternative)
  currentStep: { type: Number, default: 0 }, // progress index in route
}, { timestamps: true });
module.exports = mongoose.model("Order", orderSchema);
