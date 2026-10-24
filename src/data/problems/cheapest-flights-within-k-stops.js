import { rng, randInt } from "../gen.js";

function randomFlights(n, m, seed, k) {
  const r = rng(seed);
  const seen = new Set();
  const flights = [];
  while (flights.length < m) {
    const a = randInt(r, 0, n - 1);
    const b = randInt(r, 0, n - 1);
    if (a === b || seen.has(`${a},${b}`)) continue;
    seen.add(`${a},${b}`);
    flights.push([a, b, randInt(r, 1, 10000)]);
  }
  return { n, flights, src: 0, dst: n - 1, k };
}

export default {
  slug: "cheapest-flights-within-k-stops",
  description: `There are \`n\` cities connected by flights. \`flights[i] = [from, to, price]\` is a one-way flight from \`from\` to \`to\` costing \`price\`.

Given \`src\`, \`dst\` and \`k\`, return the **cheapest price** to travel from \`src\` to \`dst\` using **at most \`k\` stops** (a stop is a city in between, so at most \`k + 1\` flights). If there is no such route, return \`-1\`.`,
  examples: [
    { input: { n: 4, flights: [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]], src: 0, dst: 3, k: 1 }, explanation: "0 → 1 → 3 costs 700. The cheaper 0 → 1 → 2 → 3 needs 2 stops, which is too many." },
    { input: { n: 3, flights: [[0, 1, 100], [1, 2, 100], [0, 2, 500]], src: 0, dst: 2, k: 1 }, explanation: "0 → 1 → 2 costs 200 with one stop." },
    { input: { n: 3, flights: [[0, 1, 100], [1, 2, 100], [0, 2, 500]], src: 0, dst: 2, k: 0 }, explanation: "With no stops allowed, only the direct flight (500) works." },
  ],
  constraints: ["1 <= n <= 100", "0 <= flights.length <= n * (n - 1) / 2", "0 <= from, to < n, from != to", "1 <= price <= 10^4", "No repeated flights.", "0 <= src, dst, k < n, src != dst"],
  harness: { fn: "findCheapestPrice", params: { n: "int", flights: "int[][]", src: "int", dst: "int", k: "int" }, returns: "int" },
  tests: [
    { n: 2, flights: [], src: 0, dst: 1, k: 0 },
    { n: 2, flights: [[0, 1, 5]], src: 0, dst: 1, k: 0 },
    { n: 2, flights: [[1, 0, 5]], src: 0, dst: 1, k: 1 },
    { n: 3, flights: [[0, 1, 1], [1, 2, 1]], src: 0, dst: 2, k: 0 },
    { n: 4, flights: [[0, 1, 1], [0, 2, 5], [1, 2, 1], [2, 3, 1]], src: 0, dst: 3, k: 1 },
    { n: 4, flights: [[0, 1, 1], [0, 2, 5], [1, 2, 1], [2, 3, 1]], src: 0, dst: 3, k: 2 },
    { n: 5, flights: [[0, 1, 5], [1, 2, 5], [0, 3, 2], [3, 1, 2], [1, 4, 1], [4, 2, 1]], src: 0, dst: 2, k: 2 },
    { n: 5, flights: [[4, 1, 1], [1, 2, 3], [0, 3, 2], [0, 4, 10], [3, 1, 1], [1, 4, 3]], src: 2, dst: 1, k: 1 },
    { n: 4, flights: [[0, 1, 1], [1, 2, 1], [2, 3, 1], [0, 3, 10]], src: 0, dst: 3, k: 3 },
    { n: 3, flights: [[0, 1, 2], [1, 2, 1], [2, 0, 10]], src: 1, dst: 2, k: 1 },
    { n: 6, flights: [[0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1], [4, 5, 1], [0, 5, 100]], src: 0, dst: 5, k: 3 },
    { n: 4, flights: [[0, 1, 100], [1, 2, 100], [2, 3, 100], [0, 3, 1000]], src: 0, dst: 3, k: 2 },
    randomFlights(100, 2000, 1, 5),
    randomFlights(100, 4950, 2, 1),
    randomFlights(100, 300, 3, 99),
  ],
  answer: {
    approach: [
      "Use Bellman–Ford limited to k + 1 rounds, since a route with at most k stops uses at most k + 1 flights.",
      "Keep cost[], with cost[src] = 0 and ∞ elsewhere.",
      "In each round, copy cost into next, then for every flight [u, v, p] set next[v] = min(next[v], cost[u] + p). Using the copy stops a round from chaining several flights.",
      "After k + 1 rounds, cost[dst] is the answer, or -1 if it is still ∞.",
    ],
    time: "O(k · E)",
    space: "O(n)",
    javascript: `function findCheapestPrice(n, flights, src, dst, k) {
    let cost = new Array(n).fill(Infinity);
    cost[src] = 0;
    for (let i = 0; i <= k; i++) {
        const next = cost.slice();
        for (const [u, v, p] of flights) {
            if (cost[u] + p < next[v]) next[v] = cost[u] + p;
        }
        cost = next;
    }
    return cost[dst] === Infinity ? -1 : cost[dst];
}`,
    python: `class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
        cost = [float('inf')] * n
        cost[src] = 0
        for _ in range(k + 1):
            nxt = cost[:]
            for u, v, p in flights:
                if cost[u] + p < nxt[v]:
                    nxt[v] = cost[u] + p
            cost = nxt
        return -1 if cost[dst] == float('inf') else cost[dst]`,
  },
};
