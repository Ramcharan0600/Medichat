require("dotenv").config({ override: true });
const mongoose = require("mongoose");
const User = require("../models/User");
const Medicine = require("../models/Medicine");
const Order = require("../models/Order");

async function createTestOrder() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Find a student
    const student = await User.findOne({ role: "student" });
    if (!student) throw new Error("No student found — please register one");
    
    // Find a medicine
    const med = await Medicine.findOne();
    if (!med) throw new Error("No medicine found — run add-medicines");
    
    const order = await Order.create({
      student: student._id,
      items: [{ medicine: med._id, qty: 1 }],
      total: med.price,
      hostel: "BH2",
      status: "packed", // Set to packed so it's ready for delivery agent
      paymentMethod: "UPI",
      paymentStatus: "paid"
    });
    
    console.log(`✅ Test order created! ID: ${order._id}, Status: ${order.status}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createTestOrder();
