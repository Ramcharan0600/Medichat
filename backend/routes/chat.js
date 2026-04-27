const router = require("express").Router();
const { bfs } = require("../dsa/bfs");
const { dfs } = require("../dsa/dfs");
const Medicine = require("../models/Medicine");

// Symptom Tree (used by BFS/DFS)
const symptomTree = {
  name: "Root",
  symptoms: [],
  children: [
    { name: "ENT", department: "ENT", symptoms: ["sore throat","ear pain","cough","cold","sinus"] },
    { name: "Cardio", department: "Cardiology", symptoms: ["chest pain","palpitation","shortness of breath"] },
    { name: "Gastro", department: "Gastroenterology", symptoms: ["stomach pain","vomiting","diarrhea","acidity"] },
    { name: "Neuro", department: "Neurology", symptoms: ["headache","migraine","dizziness","seizure"] },
    { name: "Ortho", department: "Orthopedics", symptoms: ["joint pain","back pain","fracture","sprain"] },
    { name: "Derma", department: "Dermatology", symptoms: ["rash","itching","acne","skin allergy"] },
    { name: "General", department: "General Physician", symptoms: ["fever","weakness","body ache"] },
  ],
};

const deptToCategory = {
  "ENT": "Cold",
  "Cardiology": "Fever",
  "Gastroenterology": "Acidity",
  "Neurology": "Pain Relief",
  "Orthopedics": "Pain Relief",
  "Dermatology": "Allergy",
  "General Physician": "Fever"
};

router.post("/diagnose", async (req, res) => {
  try {
    const { symptom, algorithm = "bfs" } = req.body;
    if (!symptom) return res.status(400).json({ msg: "Symptom required" });
    
    const result = algorithm === "dfs" ? dfs(symptomTree, symptom) : bfs(symptomTree, symptomTree, symptom);
    
    // Fetch medicine suggestion
    const category = deptToCategory[result.department] || "Fever";
    const medicine = await Medicine.findOne({ category: new RegExp(category, 'i'), stock: { $gt: 0 } });

    let botResponse = `I'm truly sorry to hear that you're dealing with ${symptom}. It sounds very distressing, and I really hope you find some relief soon. `;
    
    if (medicine) {
      botResponse += `For temporary relief, you might try **${medicine.name}** (available in the campus pharmacy), which is commonly used for ${category.toLowerCase()} symptoms. `;
    }

    botResponse += `However, your health is our primary concern. Please consider scheduling an appointment with the **${result.department}** specialist for a thorough diagnosis.`;

    res.json({
      bot: botResponse,
      department: result.department,
      algorithmUsed: algorithm.toUpperCase(),
      traversal: result.traversal,
      found: result.found,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Diagnosis Error" });
  }
});

module.exports = router;
