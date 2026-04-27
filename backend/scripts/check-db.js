require("dotenv").config({ override: true });
const mongoose = require("mongoose");
const User = require("../models/User");

async function check() {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected");
    const count = await User.countDocuments();
    console.log("Total users in DB:", count);
    const users = await User.find({}, "email role").limit(10);
    console.log("Users:", users);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

check();
