const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    let { name, email, password, role, ...extra } = req.body;
    console.log(`📝 Registering user: ${email} with role: ${role}`);
    email = email.trim().toLowerCase();
    if (await User.findOne({ email })) {
      console.log(`❌ Registration failed: Email ${email} already exists`);
      return res.status(400).json({ msg: "Email exists" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role, ...extra });
    console.log(`✅ User registered successfully: ${user._id}`);
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name, email, role } });
  } catch (e) { 
    console.error(`🔥 Registration Error: ${e.message}`);
    res.status(500).json({ msg: e.message }); 
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    console.log(`🔑 Login attempt: ${email}`);
    email = email.trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ Login failed: User not found (${email})`);
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    console.log(`🔍 User found: ${user.email}, Role: ${user.role}`);
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      console.log(`❌ Login failed: Password mismatch for ${email}`);
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    console.log(`✅ Login successful: ${email}`);
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (e) { 
    console.error(`🔥 Login Error: ${e.message}`);
    res.status(500).json({ msg: e.message }); 
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, regNo, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });
    
    // For students, check regNo. For others, allow reset via email match for now (mocking security)
    if (user.role === "student" && user.regNo !== regNo) {
      return res.status(401).json({ msg: "Registration Number mismatch" });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();
    res.json({ msg: "Password updated successfully" });
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

router.get("/debug-db", async (req, res) => {
  try {
    const count = await User.countDocuments();
    const latest = await User.findOne().sort("-createdAt").select("email role createdAt");
    res.json({ totalUsers: count, latestUser: latest });
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

module.exports = router;
