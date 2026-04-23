require("dotenv").config({ override: true });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Medicine = require("../models/Medicine");
const CampusGraph = require("../models/CampusGraph");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Seeding…");

  await Promise.all([User.deleteMany({}), Medicine.deleteMany({}), CampusGraph.deleteMany({})]);

  const hash = await bcrypt.hash("demo1234", 10);
  await User.create([
    { name: "LPU Main Pharmacy", email: "shop@lpu.in", password: hash, role: "shop", shopName: "University Health Centre Pharmacy" },
    { name: "LPU Campus Delivery", email: "delivery@lpu.in", password: hash, role: "delivery" },
    { name: "Demo Student", email: "student@lpu.in", password: hash, role: "student", regNo: "12100123", hostel: "BH1" },
  ]);

  const meds = await Medicine.create([
    { name: "Calpol 650mg", price: 180, weight: 1, benefit: 9, category: "Fever", stock: 100, soldCount: 0, expiryDate: new Date("2026-12-01") },
    { name: "Solvin Cold", price: 210, weight: 1, benefit: 8, category: "Cold & Flu", stock: 80, soldCount: 0, expiryDate: new Date("2026-11-15") },
    { name: "Saridon Advance", price: 150, weight: 1, benefit: 7, category: "Headache/Pain", stock: 150, soldCount: 0, expiryDate: new Date("2027-01-01") },
    { name: "Ascoril LS Syrup", price: 320, weight: 2, benefit: 8, category: "Cough", stock: 50, soldCount: 0, expiryDate: new Date("2026-10-30") },
    { name: "Digene Tablet", price: 120, weight: 1, benefit: 6, category: "Acidity/Gas", stock: 200, soldCount: 0, expiryDate: new Date("2027-05-10") },
    { name: "Allegra 120mg", price: 450, weight: 1, benefit: 7, category: "Allergy", stock: 60, soldCount: 0, expiryDate: new Date("2026-08-20") },
    { name: "Volini Spray", price: 280, weight: 2, benefit: 9, category: "Muscle Pain", stock: 40, soldCount: 0, expiryDate: new Date("2026-12-30") },
  ]);

  // Create a conflict: Allegra + Saridon
  const allegra = meds.find(m => m.name === "Allegra 120mg");
  const saridon = meds.find(m => m.name === "Saridon Advance");
  allegra.conflicts.push(saridon._id);
  allegra.conflictReason = "Mixing Antihistamines with Analgesics can cause extreme drowsiness.";
  await allegra.save();

  // LPU campus graph (simplified) — nodes: Chemist, BH1..BH5, GH1..GH3, Block34, UniMall
  await CampusGraph.create({
    name: "LPU_MAIN",
    nodes: ["Chemist","UniMall","Block34","BH1","BH2","BH3","BH4","BH5","GH1","GH2","GH3"],
    edges: [
      { from: "Chemist", to: "UniMall", weight: 120 },
      { from: "UniMall", to: "Block34", weight: 200 },
      { from: "UniMall", to: "BH1", weight: 250 },
      { from: "BH1", to: "BH2", weight: 100 },
      { from: "BH2", to: "BH3", weight: 100 },
      { from: "BH3", to: "BH4", weight: 100 },
      { from: "BH4", to: "BH5", weight: 100 },
      { from: "Block34", to: "GH1", weight: 300 },
      { from: "GH1", to: "GH2", weight: 100 },
      { from: "GH2", to: "GH3", weight: 100 },
      { from: "Chemist", to: "BH1", weight: 400 },
      { from: "Chemist", to: "GH1", weight: 500 },
    ],
  });

  console.log("✅ Seeded! Logins: student/shop/delivery/doctor @lpu.in / demo1234");
  process.exit(0);
})();
