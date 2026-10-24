import { rng, randInt } from "../gen.js";

// Random bipartite graph: edges only between even and odd nodes.
function bipartite(n, m, seed, breakIt = false) {
  const r = rng(seed);
  const adj = Array.from({ length: n }, () => new Set());
  for (let i = 0; i < m; i++) {
    const a = 2 * randInt(r, 0, n / 2 - 1);
    const b = 2 * randInt(r, 0, n / 2 - 1) + 1;
    adj[a].add(b);
    adj[b].add(a);
  }
  if (breakIt) {
    // Triangle 0-1-2: 0 and 2 are both even, so this breaks bipartiteness.
    for (const [a, b] of [[0, 1], [1, 2], [0, 2]]) {
      adj[a].add(b);
      adj[b].add(a);
    }
  }
  return { graph: adj.map((s) => [...s].sort((x, y) => x - y)) };
}

export default {
  slug: "is-graph-bipartite",
  description: `There is an **undirected** graph with \`n\` nodes, numbered \`0\` to \`n - 1\`. \`graph[u]\` lists the nodes connected to \`u\`. There are no self-loops or parallel edges, and the graph may be **disconnected**.

A graph is **bipartite** if its nodes can be split into two groups A and B so that **every edge connects a node in A with a node in B**.

Return \`true\` if the graph is bipartite.`,
  examples: [
    { input: { graph: [[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]] }, explanation: "Nodes 0, 1, 2 form a triangle. A triangle can never be split into two sides." },
    { input: { graph: [[1, 3], [0, 2], [1, 3], [0, 2]] }, explanation: "Split into {0, 2} and {1, 3}." },
    { input: { graph: [[], [], []] }, explanation: "No edges at all, so any split works." },
  ],
  constraints: ["graph.length == n", "1 <= n <= 100 (tests go higher)", "0 <= graph[u].length < n", "graph[u] does not contain u, and the edges are symmetric."],
  harness: { fn: "isBipartite", params: { graph: "int[][]" }, returns: "bool" },
  tests: [
    { graph: [[]] },
    { graph: [[1], [0]] },
    { graph: [[1], [0, 2], [1]] },
    { graph: [[1, 2], [0, 2], [0, 1]] },
    { graph: [[1], [0], [3], [2]] },
    { graph: [[1], [0], [3, 4], [2, 4], [2, 3]] },
    { graph: [[1, 4], [0, 2], [1, 3], [2, 4], [3, 0]] },
    { graph: [[1, 5], [0, 2], [1, 3], [2, 4], [3, 5], [4, 0]] },
    { graph: [[], [2, 4, 6], [1, 4, 8, 9], [7, 8], [1, 2, 8, 9], [6, 9], [1, 5, 7, 8, 9], [3, 6, 9], [2, 3, 4, 6, 9], [2, 4, 5, 6, 7, 8]] },
    { graph: [[3], [2, 4], [1], [0, 4], [1, 3]] },
    { graph: [[2, 3], [2, 3], [0, 1], [0, 1]] },
    { graph: [[1, 2], [0], [0], [4], [3, 5], [4, 6], [5, 4]].map((x, i) => (i === 6 ? [5] : i === 4 ? [3, 5] : x)) },
    bipartite(2000, 6000, 1),
    bipartite(2000, 6000, 2, true),
  ],
  answer: {
    approach: [
      "Try to 2-colour the graph: neighbours must always get different colours.",
      "For every uncoloured node (the graph may be disconnected), give it colour 0 and BFS from it.",
      "Colour each uncoloured neighbour with the opposite colour. If a neighbour already has the same colour as the current node, the graph is not bipartite.",
      "If every edge connects different colours, return true.",
    ],
    time: "O(V + E)",
    space: "O(V)",
    javascript: `function isBipartite(graph) {
    const color = new Array(graph.length).fill(-1);
    for (let s = 0; s < graph.length; s++) {
        if (color[s] !== -1) continue;
        color[s] = 0;
        const queue = [s];
        for (let i = 0; i < queue.length; i++) {
            const u = queue[i];
            for (const v of graph[u]) {
                if (color[v] === -1) {
                    color[v] = 1 - color[u];
                    queue.push(v);
                } else if (color[v] === color[u]) {
                    return false;
                }
            }
        }
    }
    return true;
}`,
    python: `class Solution:
    def isBipartite(self, graph: List[List[int]]) -> bool:
        color = [-1] * len(graph)
        for s in range(len(graph)):
            if color[s] != -1:
                continue
            color[s] = 0
            queue = deque([s])
            while queue:
                u = queue.popleft()
                for v in graph[u]:
                    if color[v] == -1:
                        color[v] = 1 - color[u]
                        queue.append(v)
                    elif color[v] == color[u]:
                        return False
        return True`,
  },
};
