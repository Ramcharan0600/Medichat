/**
 * DSA Visualization in terminal — perfect for faculty viva screenshots.
 * Run: npm run dsa-demo
 */
const { dijkstra } = require("../dsa/dijkstra");
const { bfs } = require("../dsa/bfs");
const { dfs } = require("../dsa/dfs");
const { earliestFreeSlot } = require("../dsa/greedy");
const { knapsack } = require("../dsa/knapsack");

const line = (c="=") => console.log(c.repeat(60));

console.log("\n🏥 CalmCure LPU — DSA Algorithm Demonstration\n");

// 1. Dijkstra
line(); console.log("1️⃣  DIJKSTRA — Delivery Route Optimization"); line();
const graph = {
  Chemist: [{to:"UniMall",weight:120},{to:"BH1",weight:400}],
  UniMall: [{to:"Chemist",weight:120},{to:"Block34",weight:200},{to:"BH1",weight:250}],
  Block34: [{to:"UniMall",weight:200},{to:"GH1",weight:300}],
  BH1: [{to:"Chemist",weight:400},{to:"UniMall",weight:250},{to:"BH2",weight:100}],
  BH2: [{to:"BH1",weight:100},{to:"BH3",weight:100}],
  BH3: [{to:"BH2",weight:100},{to:"BH4",weight:100}],
  BH4: [{to:"BH3",weight:100}],
  GH1: [{to:"Block34",weight:300}],
};
const r = dijkstra(graph, "Chemist", "BH4");
console.log("Source: Chemist  → Target: BH4");
console.log("Path :", r.path.join(" → "));
console.log("Total Distance :", r.distance, "meters");
console.log("Visit order    :", r.steps.map(s=>s.visiting).join(", "));

// 2. BFS
line(); console.log("\n2️⃣  BFS — Symptom Diagnosis Tree"); line();
const tree = { name:"Root", symptoms:[], children:[
  { name:"ENT", department:"ENT", symptoms:["sore throat","cough"] },
  { name:"Cardio", department:"Cardiology", symptoms:["chest pain"] },
  { name:"Neuro", department:"Neurology", symptoms:["headache"] },
]};
const b = bfs(tree, tree, "headache");
console.log("Symptom: headache");
console.log("Traversal :", b.traversal.join(" → "));
console.log("Mapped to :", b.department);

// 3. DFS
line(); console.log("\n3️⃣  DFS — Deep Symptom Search"); line();
const d = dfs(tree, "chest pain");
console.log("Symptom: chest pain");
console.log("Traversal :", d.traversal.join(" → "));
console.log("Mapped to :", d.department);

// 4. Greedy
line(); console.log("\n4️⃣  GREEDY — Earliest Doctor Slot"); line();
const today = new Date(); today.setHours(9,0,0,0);
const busy = [
  { start: new Date(today.getTime()+30*60000), end: new Date(today.getTime()+60*60000) },
  { start: new Date(today.getTime()+90*60000), end: new Date(today.getTime()+120*60000) },
];
const slot = earliestFreeSlot(busy, 15);
console.log("Doctor busy slots:", busy.map(s=>`${s.start.toLocaleTimeString()}–${s.end.toLocaleTimeString()}`));
console.log("Earliest free 15-min slot:", slot.start.toLocaleTimeString(), "→", slot.end.toLocaleTimeString());

// 5. Knapsack
line(); console.log("\n5️⃣  KNAPSACK (DP) — Best Medicine Combo within Budget"); line();
const items = [
  { name:"Paracetamol", price:20, benefit:8 },
  { name:"Cetirizine", price:15, benefit:6 },
  { name:"ORS", price:10, benefit:7 },
  { name:"Cough Syrup", price:80, benefit:7 },
  { name:"Vitamin C", price:60, benefit:6 },
];
const k = knapsack(items, 100);
console.log("Budget: ₹100");
console.log("Chosen items :", k.chosen.map(i=>i.name).join(", "));
console.log("Spent : ₹"+k.spent, "| Total Benefit:", k.maxBenefit);

line(); console.log("\n✅ All 5 algorithms executed successfully!\n");
