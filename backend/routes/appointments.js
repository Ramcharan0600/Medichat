const router = require("express").Router();
const auth = require("../middleware/auth");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const { earliestFreeSlot } = require("../dsa/greedy");

// Student: book
router.post("/", auth(["student"]), async (req, res) => {
  try {
    let { symptoms, department, source = "manual", doctorId, scheduledAt } = req.body;
    
    let doctor = null;
    if (doctorId) {
      doctor = await User.findById(doctorId);
    } else {
      // pick first available doctor in dept (fallback)
      doctor = await User.findOne({ role: "doctor", specialization: department, available: true });
    }

    if (doctor && !scheduledAt) {
      const slot = earliestFreeSlot(doctor.busySlots || [], 15);
      scheduledAt = slot.start;
      doctor.busySlots.push({ start: slot.start, end: slot.end });
      await doctor.save();
    } else if (doctor && scheduledAt) {
      // Record busy slot for chosen time
      const endTime = new Date(new Date(scheduledAt).getTime() + 15 * 60000);
      doctor.busySlots.push({ start: new Date(scheduledAt), end: endTime });
      await doctor.save();
    }

    const appt = await Appointment.create({
      student: req.user.id,
      doctor: doctor ? doctor._id : undefined,
      symptoms, department,
      requestedAt: new Date(),
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      source,
      status: doctor ? "accepted" : "pending",
    });
    res.json({ appointment: appt, doctor: doctor ? { id: doctor._id, name: doctor.name } : null, algorithm: doctorId ? "Manual Assignment" : "Greedy earliest-slot" });
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

router.get("/mine", auth(["student"]), async (req, res) => {
  const list = await Appointment.find({ student: req.user.id }).populate("doctor","name specialization").sort("-createdAt");
  res.json(list);
});

module.exports = router;
