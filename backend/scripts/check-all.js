require("dotenv").config({ override: true });
const mongoose = require("mongoose");
const User = require("../models/User");
const Order = require("../models/Order");
const Appointment = require("../models/Appointment");

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const uCount = await User.countDocuments();
    const oCount = await Order.countDocuments();
    const aCount = await Appointment.countDocuments();
    console.log({ users: uCount, orders: oCount, appointments: aCount });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
