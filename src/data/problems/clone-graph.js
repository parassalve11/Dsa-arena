import { rng, randInt } from "../gen.js";

function randomGraph(n, extra, seed) {
  const r = rng(seed);
  const adj = Array.from({ length: n }, () => new Set());
  // A random spanning tree keeps the graph connected.
  for (let v = 2; v <= n; v++) {
    const u = randInt(r, 1, v - 1);
    adj[u - 1].add(v);
    adj[v - 1].add(u);
  }
  for (let i = 0; i < extra; i++) {
    const a = randInt(r, 1, n);
    const b = randInt(r, 1, n);
    if (a !== b) {
      adj[a - 1].add(b);
      adj[b - 1].add(a);
    }
  }
  return adj.map((s) => [...s]);
}

export default {
  slug: "clone-graph",
  description: `Given a reference to a node in a **connected undirected graph**, return a **deep copy** (clone) of the graph.

Each node has a value \`val\` and a list of its neighbours \`neighbors\`. The clone must use **brand-new nodes**: no node of the copy may be a node of the original graph.

**How the input works:** \`adjList\` is the adjacency list of the graph. Node values are \`1\` to \`n\`, and \`adjList[i]\` lists the neighbours of the node with value \`i + 1\`. Your function receives the node with value 1 (or \`null\` for an empty graph). The output is the adjacency list of the clone you return.`,
  examples: [
    { input: { adjList: [[2, 4], [1, 3], [2, 4], [1, 3]] }, explanation: "Four nodes in a square. The clone has the same connections." },
    { input: { adjList: [[]] }, explanation: "A single node with no neighbours." },
    { input: { adjList: [] }, explanation: "An empty graph: return null." },
  ],
  constraints: ["The number of nodes is in the range [0, 100].", "1 <= Node.val <= 100, and every value is unique.", "No repeated edges and no self-loops.", "The graph is connected."],
  harness: { fn: "cloneGraph", adapter: "cloneGraph", params: { node: "Node" }, returns: "Node", inputs: ["adjList"] },
  starter: {
    javascript: `/**
 * // Definition for a _Node.
 * function _Node(val, neighbors) {
 *    this.val = val === undefined ? 0 : val;
 *    this.neighbors = neighbors === undefined ? [] : neighbors;
 * };
 */

/**
 * @param {_Node} node
 * @return {_Node}
 */
function cloneGraph(node) {

}
`,
    python: `"""
# Definition for a Node.
class Node:
    def __init__(self, val = 0, neighbors = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
"""

from typing import Optional
class Solution:
    def cloneGraph(self, node: Optional['Node']) -> Optional['Node']:
        `,
  },
  tests: [
    { adjList: [[2], [1]] },
    { adjList: [[2, 3], [1, 3], [1, 2]] },
    { adjList: [[2], [1, 3], [2, 4], [3]] },
    { adjList: [[2, 3, 4], [1], [1], [1]] },
    { adjList: [[2, 5], [1, 3], [2, 4], [3, 5], [4, 1]] },
    { adjList: [[2, 3, 4, 5], [1, 3, 4, 5], [1, 2, 4, 5], [1, 2, 3, 5], [1, 2, 3, 4]] },
    { adjList: [[3], [3], [1, 2]] },
    { adjList: [[4], [4], [4], [1, 2, 3]] },
    { adjList: [[2], [1, 3, 5], [2, 4], [3], [2, 6], [5]] },
    { adjList: [[2, 6], [1, 3], [2, 4], [3, 5], [4, 6], [5, 1]] },
    { adjList: [[5], [5], [5], [5], [1, 2, 3, 4]] },
    { adjList: [[2, 3], [1, 4], [1, 4], [2, 3]] },
    { adjList: randomGraph(100, 300, 1) },
    { adjList: randomGraph(100, 0, 2) },
  ],
  answer: {
    approach: [
      "Keep a hash map from each original node to its clone. It also acts as the 'visited' set.",
      "Start from the given node: create its clone and put the original in a queue (or recurse).",
      "For each original node taken from the queue, look at its neighbours. If a neighbour has no clone yet, create one and queue the neighbour. Then add the neighbour's clone to the current clone's neighbour list.",
      "Return the clone of the starting node.",
    ],
    time: "O(V + E)",
    space: "O(V)",
    javascript: `function cloneGraph(node) {
    if (!node) return null;
    const clones = new Map([[node, new _Node(node.val)]]);
    const queue = [node];
    for (let i = 0; i < queue.length; i++) {
        const cur = queue[i];
        for (const nb of cur.neighbors) {
            if (!clones.has(nb)) {
                clones.set(nb, new _Node(nb.val));
                queue.push(nb);
            }
            clones.get(cur).neighbors.push(clones.get(nb));
        }
    }
    return clones.get(node);
}`,
    python: `class Solution:
    def cloneGraph(self, node: Optional['Node']) -> Optional['Node']:
        if not node:
            return None
        clones = {node: Node(node.val)}
        queue = deque([node])
        while queue:
            cur = queue.popleft()
            for nb in cur.neighbors:
                if nb not in clones:
                    clones[nb] = Node(nb.val)
                    queue.append(nb)
                clones[cur].neighbors.append(clones[nb])
        return clones[node]`,
  },
};
