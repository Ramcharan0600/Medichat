require("dotenv").config({ override: true });
const mongoose = require("mongoose");
const CampusGraph = require("../models/CampusGraph");

async function seedGraph() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Seeding Campus Graph...");
    
    await CampusGraph.deleteMany({ name: "LPU_MAIN" });
    
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
    
    console.log("✅ Campus Graph seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedGraph();
