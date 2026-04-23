const mongoose = require("mongoose");
module.exports = async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB error:", err.message);
    // Removed process.exit(1) to keep server alive for diagnostics
  }
};
