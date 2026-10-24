import { rng, randInt } from "../gen.js";

function randomNetwork(n, m, seed, k = 1) {
  const r = rng(seed);
  const times = [];
  const seen = new Set();
  // A random tree from k guarantees everything is reachable.
  for (let v = 1; v <= n; v++) {
    if (v === k) continue;
    const u = v === 1 ? k : randInt(r, 1, n);
    if (u !== v) {
      times.push([u, v, randInt(r, 0, 100)]);
      seen.add(`${u},${v}`);
    }
  }
  while (times.length < m) {
    const u = randInt(r, 1, n);
    const v = randInt(r, 1, n);
    if (u === v || seen.has(`${u},${v}`)) continue;
    seen.add(`${u},${v}`);
    times.push([u, v, randInt(r, 0, 100)]);
  }
  return { times, n, k };
}

export default {
  slug: "network-delay-time",
  description: `You are given a network of \`n\` nodes labelled \`1\` to \`n\`, and a list of travel times as directed edges \`times[i] = [u, v, w]\`: a signal takes \`w\` time to travel from \`u\` to \`v\`.

A signal is sent from node \`k\`. Return the **minimum time** for **all** \`n\` nodes to receive it. If some node can never receive it, return \`-1\`.`,
  examples: [
    { input: { times: [[2, 1, 1], [2, 3, 1], [3, 4, 1]], n: 4, k: 2 }, explanation: "From 2 the signal reaches 1 and 3 at time 1, and 4 at time 2." },
    { input: { times: [[1, 2, 1]], n: 2, k: 1 }, explanation: "Node 2 is reached at time 1." },
    { input: { times: [[1, 2, 1]], n: 2, k: 2 }, explanation: "Edges are one-way, so node 1 can never be reached from 2." },
  ],
  constraints: ["1 <= k <= n <= 100", "1 <= times.length <= 6000", "1 <= u, v <= n, u != v", "0 <= w <= 100", "All (u, v) pairs are unique."],
  harness: { fn: "networkDelayTime", params: { times: "int[][]", n: "int", k: "int" }, returns: "int" },
  tests: [
    { times: [], n: 1, k: 1 },
    { times: [[1, 2, 5]], n: 3, k: 1 },
    { times: [[1, 2, 1], [2, 3, 2], [1, 3, 4]], n: 3, k: 1 },
    { times: [[1, 2, 1], [2, 3, 2], [1, 3, 2]], n: 3, k: 1 },
    { times: [[1, 2, 0], [2, 3, 0]], n: 3, k: 1 },
    { times: [[3, 1, 5], [3, 2, 2], [2, 1, 2], [3, 4, 1], [4, 5, 1], [5, 6, 1], [6, 7, 1], [7, 8, 1], [8, 1, 1]], n: 8, k: 3 },
    { times: [[1, 2, 100], [2, 1, 100]], n: 2, k: 2 },
    { times: [[2, 1, 1], [2, 3, 1], [3, 4, 1]], n: 4, k: 1 },
    { times: [[1, 2, 1], [1, 3, 1], [1, 4, 1], [1, 5, 1]], n: 5, k: 1 },
    { times: [[4, 2, 76], [1, 3, 79], [3, 1, 81], [4, 3, 30], [2, 1, 47], [1, 5, 61], [1, 4, 99], [3, 4, 68], [3, 5, 46], [4, 1, 6], [5, 4, 7], [5, 3, 44], [4, 5, 19], [2, 3, 13], [3, 2, 18], [1, 2, 0], [5, 1, 25], [2, 5, 58], [2, 4, 77], [5, 2, 74]], n: 5, k: 3 },
    { times: [[1, 2, 1], [2, 3, 1], [3, 4, 1], [4, 1, 1]], n: 4, k: 3 },
    { times: [[1, 2, 10], [1, 3, 1], [3, 2, 1]], n: 3, k: 1 },
    randomNetwork(100, 6000, 1, 1),
    randomNetwork(100, 300, 2, 50),
    { ...randomNetwork(100, 2000, 3, 7), n: 100 },
  ],
  answer: {
    approach: [
      "This is single-source shortest paths with non-negative weights, so use Dijkstra's algorithm from k.",
      "Keep dist[] (∞ for all but dist[k] = 0) and a min-heap of (distance, node).",
      "Pop the closest unfinished node, and relax each outgoing edge: if dist[u] + w < dist[v], update dist[v] and push it.",
      "The answer is the largest dist value. If any node still has ∞, return -1. (With n <= 100, a simple O(n²) Dijkstra without a heap also works.)",
    ],
    time: "O(E log V)",
    space: "O(V + E)",
    javascript: `function networkDelayTime(times, n, k) {
    const adj = Array.from({ length: n + 1 }, () => []);
    for (const [u, v, w] of times) adj[u].push([v, w]);
    const dist = new Array(n + 1).fill(Infinity);
    const done = new Array(n + 1).fill(false);
    dist[k] = 0;
    for (let iter = 0; iter < n; iter++) {
        let u = -1;
        for (let i = 1; i <= n; i++) if (!done[i] && (u === -1 || dist[i] < dist[u])) u = i;
        if (dist[u] === Infinity) break;
        done[u] = true;
        for (const [v, w] of adj[u]) if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
    }
    const ans = Math.max(...dist.slice(1));
    return ans === Infinity ? -1 : ans;
}`,
    python: `class Solution:
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        adj = defaultdict(list)
        for u, v, w in times:
            adj[u].append((v, w))
        dist = {}
        heap = [(0, k)]
        while heap:
            d, u = heappop(heap)
            if u in dist:
                continue
            dist[u] = d
            for v, w in adj[u]:
                if v not in dist:
                    heappush(heap, (d + w, v))
        return max(dist.values()) if len(dist) == n else -1`,
  },
};
