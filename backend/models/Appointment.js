const mongoose = require("mongoose");
const apptSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  symptoms: [String],
  department: String,
  requestedAt: Date,
  scheduledAt: Date,        // greedy assigned
  status: { type: String, enum: ["pending","accepted","rescheduled","completed","rejected"], default: "pending" },
  source: { type: String, enum: ["manual","chatbot"], default: "manual" },
}, { timestamps: true });
module.exports = mongoose.model("Appointment", apptSchema);
