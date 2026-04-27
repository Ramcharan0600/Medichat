const axios = require("axios");

async function test() {
  try {
    const res = await axios.post("http://localhost:8888/api/chat/diagnose", {
      symptom: "fever",
      algorithm: "bfs"
    });
    console.log("Bot Response:", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

test();
