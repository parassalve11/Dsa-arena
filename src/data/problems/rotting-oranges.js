import { grid } from "../gen.js";

const big = (p0, p2, seed) => grid(10, 10, (r) => { const x = r(); return x < p0 ? 0 : x < p0 + p2 ? 2 : 1; }, seed);

export default {
  slug: "rotting-oranges",
  description: `You are given an \`m x n\` grid where each cell is:

- \`0\`: an empty cell,
- \`1\`: a fresh orange, or
- \`2\`: a rotten orange.

Every minute, any fresh orange that is **next to** a rotten orange (up, down, left or right) becomes rotten.

Return the **minimum number of minutes** until no fresh orange is left. If that can never happen, return \`-1\`.`,
  examples: [
    { input: { grid: [[2, 1, 1], [1, 1, 0], [0, 1, 1]] }, explanation: "The rot spreads from the top-left corner and reaches the last orange after 4 minutes." },
    { input: { grid: [[2, 1, 1], [0, 1, 1], [1, 0, 1]] }, explanation: "The orange in the bottom-left corner can never be reached, so -1." },
    { input: { grid: [[0, 2]] }, explanation: "There are no fresh oranges, so 0 minutes are needed." },
  ],
  constraints: ["m == grid.length, n == grid[i].length", "1 <= m, n <= 10", "grid[i][j] is 0, 1 or 2."],
  harness: { fn: "orangesRotting", params: { grid: "int[][]" }, returns: "int" },
  tests: [
    { grid: [[0]] },
    { grid: [[1]] },
    { grid: [[2]] },
    { grid: [[2, 1]] },
    { grid: [[1, 2, 1]] },
    { grid: [[2, 2], [1, 1], [0, 0], [2, 0]] },
    { grid: [[1, 1, 1], [1, 1, 1], [1, 1, 2]] },
    { grid: [[2, 1, 1], [1, 1, 1], [0, 1, 2]] },
    { grid: [[2, 0, 1]] },
    { grid: [[1, 1, 1, 1, 1, 1, 1, 1, 1, 2]] },
    { grid: [[2, 1, 0, 2], [1, 0, 1, 2], [1, 0, 0, 1]] },
    { grid: [[0, 0, 0], [0, 0, 0]] },
    { grid: big(0.1, 0.05, 1) },
    { grid: big(0.3, 0.02, 2) },
    { grid: [[2, 1, 1, 1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 1]] },
  ],
  answer: {
    approach: [
      "This is a multi-source BFS: all rotten oranges start spreading at the same time.",
      "Put every rotten orange in the queue (minute 0) and count the fresh ones.",
      "Process the queue level by level. Each level is one minute; rot every fresh neighbour and add it to the next level.",
      "When the queue is empty, return the number of minutes if no fresh orange is left, otherwise -1.",
    ],
    time: "O(m · n)",
    space: "O(m · n)",
    javascript: `function orangesRotting(grid) {
    const m = grid.length, n = grid[0].length;
    let level = [], fresh = 0;
    for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 2) level.push([i, j]);
            else if (grid[i][j] === 1) fresh++;
        }
    let minutes = 0;
    while (level.length && fresh > 0) {
        const next = [];
        for (const [r, c] of level) {
            for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
                if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1) {
                    grid[nr][nc] = 2;
                    fresh--;
                    next.push([nr, nc]);
                }
            }
        }
        level = next;
        minutes++;
    }
    return fresh === 0 ? minutes : -1;
}`,
    python: `class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        level, fresh = [], 0
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 2:
                    level.append((i, j))
                elif grid[i][j] == 1:
                    fresh += 1
        minutes = 0
        while level and fresh:
            nxt = []
            for r, c in level:
                for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                    if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:
                        grid[nr][nc] = 2
                        fresh -= 1
                        nxt.append((nr, nc))
            level = nxt
            minutes += 1
        return minutes if fresh == 0 else -1`,
  },
};
