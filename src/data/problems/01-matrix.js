import { grid } from "../gen.js";

const big = (m, n, p, seed) => grid(m, n, (r) => (r() < p ? 0 : 1), seed);
const oneZero = Array.from({ length: 100 }, (_, i) => Array.from({ length: 100 }, (_, j) => (i === 0 && j === 0 ? 0 : 1)));

export default {
  slug: "01-matrix",
  description: `Given an \`m x n\` binary matrix \`mat\`, return a matrix where each cell holds the **distance to the nearest \`0\`**.

The distance between two adjacent cells (sharing an edge) is 1. The matrix always contains at least one \`0\`.`,
  examples: [
    { input: { mat: [[0, 0, 0], [0, 1, 0], [0, 0, 0]] }, explanation: "The single 1 is next to a 0, so its distance is 1." },
    { input: { mat: [[0, 0, 0], [0, 1, 0], [1, 1, 1]] }, explanation: "The bottom-middle 1 is two steps from the nearest 0." },
    { input: { mat: [[1, 0, 1]] }, explanation: "Both 1s are next to the 0." },
  ],
  constraints: ["m == mat.length, n == mat[i].length", "1 <= m, n <= 10^4", "1 <= m * n <= 10^4", "mat[i][j] is 0 or 1.", "There is at least one 0."],
  harness: { fn: "updateMatrix", params: { mat: "int[][]" }, returns: "int[][]" },
  tests: [
    { mat: [[0]] },
    { mat: [[0, 1]] },
    { mat: [[1], [0]] },
    { mat: [[0, 1, 1, 1]] },
    { mat: [[1, 1, 1], [1, 0, 1], [1, 1, 1]] },
    { mat: [[0, 1, 1], [1, 1, 1], [1, 1, 1]] },
    { mat: [[1, 1, 0], [1, 1, 1], [0, 1, 1]] },
    { mat: [[0, 0], [0, 0]] },
    { mat: [[1, 0, 1, 1, 0, 0, 1, 0, 0, 1], [0, 1, 1, 0, 1, 0, 1, 0, 1, 1], [0, 0, 1, 0, 1, 0, 0, 1, 0, 0], [1, 0, 1, 0, 1, 1, 1, 1, 1, 1]] },
    { mat: [[1], [1], [1], [0], [1]] },
    { mat: [[1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 0]] },
    { mat: [[0, 1, 0, 1, 0]] },
    { mat: big(100, 100, 0.1, 1) },
    { mat: oneZero },
    { mat: big(1, 10000, 0.01, 2) },
  ],
  answer: {
    approach: [
      "Run a multi-source BFS starting from every 0 at once.",
      "Set every 0 to distance 0 and put it in the queue. Mark every 1 as 'not yet reached' (for example -1 or Infinity).",
      "Pop a cell, and for each neighbour that hasn't been reached, set its distance to this cell's distance + 1 and queue it.",
      "BFS reaches each cell first along a shortest path, so each cell is set exactly once with the correct distance.",
    ],
    time: "O(m · n)",
    space: "O(m · n)",
    javascript: `function updateMatrix(mat) {
    const m = mat.length, n = mat[0].length;
    const dist = mat.map((row) => row.map((v) => (v === 0 ? 0 : -1)));
    const queue = [];
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (mat[i][j] === 0) queue.push([i, j]);
    for (let q = 0; q < queue.length; q++) {
        const [r, c] = queue[q];
        for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
            if (nr >= 0 && nr < m && nc >= 0 && nc < n && dist[nr][nc] === -1) {
                dist[nr][nc] = dist[r][c] + 1;
                queue.push([nr, nc]);
            }
        }
    }
    return dist;
}`,
    python: `class Solution:
    def updateMatrix(self, mat: List[List[int]]) -> List[List[int]]:
        m, n = len(mat), len(mat[0])
        dist = [[0 if v == 0 else -1 for v in row] for row in mat]
        queue = deque((i, j) for i in range(m) for j in range(n) if mat[i][j] == 0)
        while queue:
            r, c = queue.popleft()
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < m and 0 <= nc < n and dist[nr][nc] == -1:
                    dist[nr][nc] = dist[r][c] + 1
                    queue.append((nr, nc))
        return dist`,
  },
};
