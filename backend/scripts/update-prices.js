require("dotenv").config({ override: true });
const mongoose = require("mongoose");
const Medicine = require("../models/Medicine");

async function updatePrices() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Updating medicine prices...");
    
    // For every medicine with price >= 20, set it to a random value between 5 and 19
    const meds = await Medicine.find({ price: { $gte: 20 } });
    console.log(`Found ${meds.length} medicines to update.`);
    
    for (let med of meds) {
      const newPrice = Math.floor(Math.random() * 15) + 5; // 5 to 19
      med.price = newPrice;
      await med.save();
      console.log(`Updated ${med.name}: ${newPrice}`);
    }
    
    console.log("✅ All medicine prices are now below 20.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updatePrices();
