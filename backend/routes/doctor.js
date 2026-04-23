const router = require("express").Router();
const auth = require("../middleware/auth");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const { earliestFreeSlot } = require("../dsa/greedy");

// Public/Student: list doctors (filtered by specialization if needed)
router.get("/", auth(["student","doctor","shop","delivery"]), async (req, res) => {
  const { specialization } = req.query;
  const query = { role: "doctor" };
  if (specialization) query.specialization = specialization;
  const docs = await User.find(query).select("name specialization available");
  res.json(docs);
});

// Get earliest free slot for a doctor (Greedy Algorithm Demo)
router.get("/:id/earliest", auth(["student"]), async (req, res) => {
  const doctor = await User.findById(req.params.id);
  if (!doctor) return res.status(404).json({ msg: "Doctor not found" });
  const slot = earliestFreeSlot(doctor.busySlots || [], 15);
  res.json({ ...slot, algorithm: "Greedy Earliest-Free-Slot" });
});

router.get("/queue", auth(["doctor"]), async (req, res) => {
  const list = await Appointment.find({ doctor: req.user.id }).populate("student","name regNo hostel").sort("scheduledAt");
  res.json(list);
});

router.patch("/:id/accept", auth(["doctor"]), async (req, res) => {
  const a = await Appointment.findByIdAndUpdate(req.params.id, { status: "accepted" }, { new: true });
  res.json(a);
});

router.patch("/:id/reschedule", auth(["doctor"]), async (req, res) => {
  const doc = await User.findById(req.user.id);
  const slot = earliestFreeSlot(doc.busySlots || [], 15);
  doc.busySlots.push({ start: slot.start, end: slot.end });
  await doc.save();
  const a = await Appointment.findByIdAndUpdate(req.params.id, { status: "rescheduled", scheduledAt: slot.start }, { new: true });
  res.json({ appointment: a, newSlot: slot, algorithm: "Greedy earliest-slot" });
});

router.patch("/:id/complete", auth(["doctor"]), async (req, res) => {
  const a = await Appointment.findByIdAndUpdate(req.params.id, { status: "completed" }, { new: true });
  res.json(a);
});

module.exports = router;
