/**
 * Breadth-First Search — Pure JavaScript
 * Used in: Symptom → Department mapping (level-by-level)
 * Complexity: O(V+E)
 */
function bfs(tree, root, targetSymptom) {
  const queue = [{ node: root, path: [root.name] }];
  const visited = new Set();
  const traversal = [];

  while (queue.length) {
    const { node, path } = queue.shift();
    if (visited.has(node.name)) continue;
    visited.add(node.name);
    traversal.push(node.name);

    if (node.symptoms && node.symptoms.includes(targetSymptom.toLowerCase())) {
      return { found: true, department: node.department || node.name, path, traversal };
    }
    for (const child of (node.children || [])) {
      queue.push({ node: child, path: [...path, child.name] });
    }
  }
  return { found: false, department: "General Physician", path: [], traversal };
}
module.exports = { bfs };
