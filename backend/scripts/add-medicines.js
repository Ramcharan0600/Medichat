require("dotenv").config({ override: true });
const mongoose = require("mongoose");
const Medicine = require("../models/Medicine");

const medicines = [
  { name: "Paracetamol 500mg", price: 15, weight: 1, benefit: 9, category: "Fever", stock: 100, expiryDate: new Date("2026-12-01") },
  { name: "Ibuprofen 400mg", price: 18, weight: 1, benefit: 8, category: "Pain Relief", stock: 80, expiryDate: new Date("2026-11-15") },
  { name: "Cetirizine 10mg", price: 12, weight: 1, benefit: 7, category: "Allergy", stock: 150, expiryDate: new Date("2027-01-01") },
  { name: "Amoxicillin 250mg", price: 19, weight: 2, benefit: 10, category: "Antibiotic", stock: 50, expiryDate: new Date("2026-10-30"), prescription: true },
  { name: "Digene Gel", price: 18, weight: 3, benefit: 6, category: "Acidity", stock: 40, expiryDate: new Date("2027-05-10") },
  { name: "Vicks Vaporub", price: 15, weight: 2, benefit: 8, category: "Cold", stock: 60, expiryDate: new Date("2026-08-20") },
  { name: "Strepsils", price: 5, weight: 1, benefit: 5, category: "Throat", stock: 200, expiryDate: new Date("2026-12-30") },
  { name: "Oral Rehydration Salts (ORS)", price: 12, weight: 1, benefit: 9, category: "Dehydration", stock: 100, expiryDate: new Date("2027-02-28") },
  { name: "Band-Aid (Pack of 10)", price: 10, weight: 1, benefit: 4, category: "First Aid", stock: 50, expiryDate: new Date("2028-01-01") },
  { name: "Dettol Liquid 100ml", price: 18, weight: 2, benefit: 7, category: "Antiseptic", stock: 30, expiryDate: new Date("2027-06-15") }
];

async function add() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Adding medicines...");
    await Medicine.insertMany(medicines);
    console.log("✅ Successfully added 10 medicines to the database.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error adding medicines:", err);
    process.exit(1);
  }
}

add();
