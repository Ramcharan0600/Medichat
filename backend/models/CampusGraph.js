const mongoose = require("mongoose");
// Stores LPU campus nodes & weighted edges for Dijkstra
const edgeSchema = new mongoose.Schema({
  from: String, to: String, weight: Number,
});
const graphSchema = new mongoose.Schema({
  name: { type: String, default: "LPU_MAIN" },
  nodes: [String],
  edges: [edgeSchema],
});
module.exports = mongoose.model("CampusGraph", graphSchema);
