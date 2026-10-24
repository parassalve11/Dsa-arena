import { rng, randInt } from "../gen.js";

function randomMatrix(n, links, seed) {
  const r = rng(seed);
  const m = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  for (let k = 0; k < links; k++) {
    const a = randInt(r, 0, n - 1);
    const b = randInt(r, 0, n - 1);
    m[a][b] = 1;
    m[b][a] = 1;
  }
  return { isConnected: m };
}

export default {
  slug: "number-of-provinces",
  description: `There are \`n\` cities. Some are connected directly. If city \`a\` is connected to \`b\`, and \`b\` to \`c\`, then \`a\` is **indirectly** connected to \`c\`.

A **province** is a group of cities that are all connected (directly or indirectly), with no other city connected to the group.

You are given an \`n x n\` matrix \`isConnected\`, where \`isConnected[i][j] = 1\` if cities \`i\` and \`j\` are directly connected and \`0\` otherwise. Return the total number of provinces.`,
  examples: [
    { input: { isConnected: [[1, 1, 0], [1, 1, 0], [0, 0, 1]] }, explanation: "Cities 0 and 1 form one province, city 2 is another." },
    { input: { isConnected: [[1, 0, 0], [0, 1, 0], [0, 0, 1]] }, explanation: "No connections, so every city is its own province." },
    { input: { isConnected: [[1, 1], [1, 1]] }, explanation: "Both cities are connected: one province." },
  ],
  constraints: ["1 <= n <= 200", "isConnected[i][j] is 1 or 0.", "isConnected[i][i] == 1", "isConnected[i][j] == isConnected[j][i]"],
  harness: { fn: "findCircleNum", params: { isConnected: "int[][]" }, returns: "int" },
  tests: [
    { isConnected: [[1]] },
    { isConnected: [[1, 0], [0, 1]] },
    { isConnected: [[1, 0, 1], [0, 1, 0], [1, 0, 1]] },
    { isConnected: [[1, 1, 1], [1, 1, 1], [1, 1, 1]] },
    { isConnected: [[1, 0, 0, 1], [0, 1, 1, 0], [0, 1, 1, 1], [1, 0, 1, 1]] },
    { isConnected: [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 1, 1], [0, 0, 1, 1]] },
    { isConnected: [[1, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 1, 1], [0, 0, 0, 1, 1]] },
    { isConnected: [[1, 1, 0, 0, 0], [1, 1, 1, 0, 0], [0, 1, 1, 1, 0], [0, 0, 1, 1, 1], [0, 0, 0, 1, 1]] },
    { isConnected: [[1, 0, 0, 0, 1], [0, 1, 0, 1, 0], [0, 0, 1, 0, 0], [0, 1, 0, 1, 0], [1, 0, 0, 0, 1]] },
    randomMatrix(10, 3, 1),
    randomMatrix(30, 20, 2),
    randomMatrix(50, 0, 3),
    randomMatrix(200, 150, 4),
    randomMatrix(200, 600, 5),
  ],
  answer: {
    approach: [
      "Count the connected components of the graph.",
      "Loop over the cities. Each unvisited city starts a new province: add 1 and run a DFS/BFS that marks every city reachable from it.",
      "From city i, a neighbour is any j with isConnected[i][j] == 1.",
      "Union-Find also works: union every connected pair and count the distinct roots.",
    ],
    time: "O(n²)",
    space: "O(n)",
    javascript: `function findCircleNum(isConnected) {
    const n = isConnected.length;
    const seen = new Array(n).fill(false);
    let provinces = 0;
    for (let s = 0; s < n; s++) {
        if (seen[s]) continue;
        provinces++;
        seen[s] = true;
        const stack = [s];
        while (stack.length) {
            const i = stack.pop();
            for (let j = 0; j < n; j++) {
                if (isConnected[i][j] && !seen[j]) {
                    seen[j] = true;
                    stack.push(j);
                }
            }
        }
    }
    return provinces;
}`,
    python: `class Solution:
    def findCircleNum(self, isConnected: List[List[int]]) -> int:
        n = len(isConnected)
        parent = list(range(n))

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        count = n
        for i in range(n):
            for j in range(i + 1, n):
                if isConnected[i][j]:
                    a, b = find(i), find(j)
                    if a != b:
                        parent[a] = b
                        count -= 1
        return count`,
  },
};
