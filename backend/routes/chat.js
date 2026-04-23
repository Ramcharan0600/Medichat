const router = require("express").Router();
const { bfs } = require("../dsa/bfs");
const { dfs } = require("../dsa/dfs");

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

router.post("/diagnose", (req, res) => {
  const { symptom, algorithm = "bfs" } = req.body;
  if (!symptom) return res.status(400).json({ msg: "Symptom required" });
  const fn = algorithm === "dfs" ? dfs : bfs;
  const result = algorithm === "dfs" ? dfs(symptomTree, symptom) : bfs(symptomTree, symptomTree, symptom);
  res.json({
    bot: `Based on "${symptom}", I recommend visiting ${result.department}.`,
    department: result.department,
    algorithmUsed: algorithm.toUpperCase(),
    traversal: result.traversal,
    found: result.found,
  });
});

module.exports = router;
