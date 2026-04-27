require("dotenv").config({ override: true });
const mongoose = require("mongoose");
const User = require("../models/User"); // Register User schema
const Medicine = require("../models/Medicine"); // Register Medicine schema
const Order = require("../models/Order");

async function checkOrders() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const orders = await Order.find().populate("student", "email").sort("-createdAt");
    console.log("Orders in DB:");
    orders.forEach(o => {
      console.log(`ID: ${o._id}, Status: ${o.status}, Student: ${o.student?.email}, Hostel: ${o.hostel}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
checkOrders();
