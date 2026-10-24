import { grid } from "../gen.js";

const big = (m, n, p, seed) => grid(m, n, (r) => (r() < p ? "1" : "0"), seed);

export default {
  slug: "number-of-islands",
  description: `Given an \`m x n\` grid of \`"1"\`s (land) and \`"0"\`s (water), return the **number of islands**.

An island is a group of land cells connected **horizontally or vertically** (not diagonally) and surrounded by water. You can assume everything outside the grid is water.`,
  examples: [
    {
      input: { grid: [["1", "1", "1", "1", "0"], ["1", "1", "0", "1", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "0", "0", "0"]] },
      explanation: "All the land is connected into one island.",
    },
    {
      input: { grid: [["1", "1", "0", "0", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "1", "0", "0"], ["0", "0", "0", "1", "1"]] },
      explanation: "Three separate islands.",
    },
    { input: { grid: [["1", "0", "1"]] }, explanation: "Two single-cell islands." },
  ],
  constraints: ["m == grid.length, n == grid[i].length", "1 <= m, n <= 300", "grid[i][j] is '0' or '1'."],
  harness: { fn: "numIslands", params: { grid: "char[][]" }, returns: "int" },
  tests: [
    { grid: [["0"]] },
    { grid: [["1"]] },
    { grid: [["1", "1"], ["1", "1"]] },
    { grid: [["1", "0"], ["0", "1"]] },
    { grid: [["0", "0", "0"], ["0", "0", "0"]] },
    { grid: [["1", "0", "1", "0", "1"], ["0", "1", "0", "1", "0"]] },
    { grid: [["1", "1", "1"], ["0", "1", "0"], ["1", "1", "1"]] },
    { grid: [["1", "1", "1"], ["1", "0", "1"], ["1", "1", "1"]] },
    { grid: [["1"], ["0"], ["1"], ["1"], ["0"], ["1"]] },
    { grid: [["1", "0", "0", "1"], ["1", "0", "0", "1"], ["1", "1", "1", "1"]] },
    { grid: [["0", "1", "0"], ["1", "1", "1"], ["0", "1", "0"]] },
    { grid: [["1", "0", "1", "1", "0", "1", "1"]] },
    { grid: big(300, 300, 0.45, 1) },
    { grid: big(300, 300, 0.9, 2) },
    { grid: big(200, 300, 0.2, 3) },
  ],
  answer: {
    approach: [
      "Scan every cell. Each time you find a '1' that hasn't been visited, you've found a new island: add 1 to the count.",
      "Then 'sink' that whole island with a DFS/BFS: turn every connected '1' into '0' (or mark it visited).",
      "Sinking makes sure the cells of one island are counted only once.",
      "Use an explicit stack or queue to avoid deep recursion on big islands.",
    ],
    time: "O(m · n)",
    space: "O(m · n) in the worst case for the stack",
    javascript: `function numIslands(grid) {
    const m = grid.length, n = grid[0].length;
    let count = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] !== "1") continue;
            count++;
            grid[i][j] = "0";
            const stack = [[i, j]];
            while (stack.length) {
                const [r, c] = stack.pop();
                for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
                    if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === "1") {
                        grid[nr][nc] = "0";
                        stack.push([nr, nc]);
                    }
                }
            }
        }
    }
    return count;
}`,
    python: `class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        m, n = len(grid), len(grid[0])
        count = 0
        for i in range(m):
            for j in range(n):
                if grid[i][j] != '1':
                    continue
                count += 1
                grid[i][j] = '0'
                stack = [(i, j)]
                while stack:
                    r, c = stack.pop()
                    for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                        if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == '1':
                            grid[nr][nc] = '0'
                            stack.append((nr, nc))
        return count`,
  },
};
