/**
 * Depth-First Search — Pure JavaScript (recursive)
 * Used in: Deep symptom tree exploration / debugging
 * Complexity: O(V+E)
 */
function dfs(node, targetSymptom, path = [], traversal = []) {
  traversal.push(node.name);
  path.push(node.name);

  if (node.symptoms && node.symptoms.includes(targetSymptom.toLowerCase())) {
    return { found: true, department: node.department || node.name, path: [...path], traversal };
  }
  for (const child of (node.children || [])) {
    const r = dfs(child, targetSymptom, path, traversal);
    if (r.found) return r;
  }
  path.pop();
  return { found: false, department: "General Physician", path: [], traversal };
}
module.exports = { dfs };
