import { rng, randInt } from "../gen.js";

function randomGraph(n, m, seed) {
  const r = rng(seed);
  const edges = [];
  for (let i = 0; i < m; i++) {
    const a = randInt(r, 0, n - 1);
    let b = randInt(r, 0, n - 1);
    if (a === b) b = (b + 1) % n;
    edges.push([a, b]);
  }
  return edges;
}

const chain = Array.from({ length: 199999 }, (_, i) => [i, i + 1]);

export default {
  slug: "find-if-path-exists-in-graph",
  description: `There is an **undirected** graph with \`n\` vertices labelled \`0\` to \`n - 1\`. The edges are given as \`edges[i] = [u, v]\`, meaning \`u\` and \`v\` are connected.

Return \`true\` if there is a path from vertex \`source\` to vertex \`destination\`, and \`false\` otherwise.`,
  examples: [
    { input: { n: 3, edges: [[0, 1], [1, 2], [2, 0]], source: 0, destination: 2 }, explanation: "0 → 2 directly, or 0 → 1 → 2." },
    { input: { n: 6, edges: [[0, 1], [0, 2], [3, 5], [5, 4], [4, 3]], source: 0, destination: 5 }, explanation: "0 is in the group {0,1,2} and 5 is in {3,4,5}. They are not connected." },
    { input: { n: 1, edges: [], source: 0, destination: 0 }, explanation: "A vertex can always reach itself." },
  ],
  constraints: ["1 <= n <= 2 * 10^5", "0 <= edges.length <= 2 * 10^5", "No duplicate edges and no self-loops.", "0 <= source, destination < n"],
  harness: { fn: "validPath", params: { n: "int", edges: "int[][]", source: "int", destination: "int" }, returns: "bool" },
  tests: [
    { n: 2, edges: [], source: 0, destination: 1 },
    { n: 2, edges: [[0, 1]], source: 1, destination: 0 },
    { n: 4, edges: [[0, 1], [2, 3]], source: 1, destination: 2 },
    { n: 4, edges: [[0, 1], [1, 2], [2, 3]], source: 0, destination: 3 },
    { n: 5, edges: [[0, 4]], source: 0, destination: 4 },
    { n: 5, edges: [[0, 4]], source: 2, destination: 2 },
    { n: 10, edges: [[4, 3], [1, 4], [4, 8], [1, 7], [6, 4], [4, 2], [7, 4], [4, 0], [0, 9], [5, 4]], source: 5, destination: 9 },
    { n: 6, edges: [[0, 1], [1, 2], [3, 4], [4, 5]], source: 2, destination: 3 },
    { n: 7, edges: [[0, 1], [0, 2], [1, 3], [2, 3], [5, 6]], source: 3, destination: 0 },
    { n: 3, edges: [[1, 2]], source: 0, destination: 2 },
    { n: 8, edges: [[0, 7], [7, 6], [6, 5], [5, 4], [4, 3], [3, 2], [2, 1]], source: 1, destination: 0 },
    { n: 4, edges: [[0, 1], [1, 2], [2, 0]], source: 3, destination: 0 },
    { n: 200000, edges: chain, source: 0, destination: 199999 },
    { n: 200000, edges: randomGraph(200000, 100000, 1), source: 5, destination: 77777 },
    { n: 100000, edges: randomGraph(100000, 200000, 2), source: 0, destination: 99999 },
  ],
  answer: {
    approach: [
      "Build an adjacency list from the edges (add both directions, since the graph is undirected).",
      "Run a BFS or iterative DFS from source, marking visited vertices.",
      "If you reach destination, return true. If the search finishes without reaching it, return false.",
      "Union-Find also works: union every edge, then check whether source and destination share a root.",
    ],
    time: "O(n + E)",
    space: "O(n + E)",
    javascript: `function validPath(n, edges, source, destination) {
    const adj = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
        adj[u].push(v);
        adj[v].push(u);
    }
    const seen = new Uint8Array(n);
    const stack = [source];
    seen[source] = 1;
    while (stack.length) {
        const u = stack.pop();
        if (u === destination) return true;
        for (const v of adj[u]) {
            if (!seen[v]) { seen[v] = 1; stack.push(v); }
        }
    }
    return false;
}`,
    python: `class Solution:
    def validPath(self, n: int, edges: List[List[int]], source: int, destination: int) -> bool:
        parent = list(range(n))

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        for u, v in edges:
            parent[find(u)] = find(v)
        return find(source) == find(destination)`,
  },
};
