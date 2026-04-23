require("dotenv").config({ override: true });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (_, res) => res.json({ ok: true, app: "CalmCure LPU API" }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/shop", require("./routes/shop"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/delivery", require("./routes/delivery"));
app.use("/api/doctor", require("./routes/doctor"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🏥 CalmCure LPU running on :${PORT}`));
