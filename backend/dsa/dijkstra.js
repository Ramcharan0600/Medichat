/**
 * Dijkstra's Shortest Path Algorithm — Pure JavaScript
 * Used in: Delivery routing across LPU campus
 * Complexity: O((V+E) log V) using min-priority-queue
 */
class MinHeap {
  constructor() { this.h = []; }
  push(node) { this.h.push(node); this._up(this.h.length - 1); }
  pop() {
    if (!this.h.length) return null;
    const top = this.h[0], last = this.h.pop();
    if (this.h.length) { this.h[0] = last; this._down(0); }
    return top;
  }
  _up(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.h[p].dist <= this.h[i].dist) break;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]]; i = p;
    }
  }
  _down(i) {
    const n = this.h.length;
    while (true) {
      const l = 2*i+1, r = 2*i+2; let m = i;
      if (l < n && this.h[l].dist < this.h[m].dist) m = l;
      if (r < n && this.h[r].dist < this.h[m].dist) m = r;
      if (m === i) break;
      [this.h[m], this.h[i]] = [this.h[i], this.h[m]]; i = m;
    }
  }
  get size() { return this.h.length; }
}

/**
 * @param {Object} graph  adjacency list { nodeId: [{to, weight}, ...] }
 * @param {string} src
 * @param {string} dest
 * @returns {{distance:number, path:string[], steps:Array}}
 */
function dijkstra(graph, src, dest) {
  const dist = {}, prev = {}, visited = new Set();
  const steps = [];
  Object.keys(graph).forEach(n => dist[n] = Infinity);
  dist[src] = 0;

  const heap = new MinHeap();
  heap.push({ node: src, dist: 0 });

  while (heap.size) {
    const { node: u, dist: d } = heap.pop();
    if (visited.has(u)) continue;
    visited.add(u);
    steps.push({ visiting: u, currentDist: d });
    if (u === dest) break;

    for (const { to: v, weight: w } of (graph[u] || [])) {
      const nd = d + w;
      if (nd < dist[v]) {
        dist[v] = nd; prev[v] = u;
        heap.push({ node: v, dist: nd });
      }
    }
  }

  const path = [];
  let cur = dest;
  if (dist[dest] === Infinity) return { distance: Infinity, path: [], steps };
  while (cur !== undefined) { path.unshift(cur); cur = prev[cur]; }
  return { distance: dist[dest], path, steps };
}

function bfs(graph, src, dest) {
  const queue = [[src]];
  const visited = new Set([src]);
  while (queue.length) {
    const path = queue.shift();
    const node = path[path.length - 1];
    if (node === dest) return path;
    for (const { to: v } of (graph[node] || [])) {
      if (!visited.has(v)) {
        visited.add(v);
        queue.push([...path, v]);
      }
    }
  }
  return [];
}

module.exports = { dijkstra, MinHeap, bfs };
