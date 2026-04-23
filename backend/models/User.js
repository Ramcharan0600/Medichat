const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "shop", "delivery", "doctor"], required: true },
  hostel: String,         // students
  regNo: String,          // students
  shopName: String,       // shop
  specialization: String, // doctor
  available: { type: Boolean, default: true },
  busySlots: [{ start: Date, end: Date }], // doctor
}, { timestamps: true });
module.exports = mongoose.model("User", userSchema);
