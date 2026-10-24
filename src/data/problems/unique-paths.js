export default {
  slug: "unique-paths",
  description: `A robot starts in the **top-left** corner of an \`m x n\` grid and wants to reach the **bottom-right** corner.

It can only move **right** or **down**, one cell at a time. How many different paths are there?

The answer is at most 2 · 10^9.`,
  examples: [
    { input: { m: 3, n: 7 }, explanation: "There are 28 different paths." },
    { input: { m: 3, n: 2 }, explanation: "Right→Down→Down, Down→Right→Down, Down→Down→Right: 3 paths." },
    { input: { m: 1, n: 1 }, explanation: "The robot is already at the goal: one (empty) path." },
  ],
  constraints: ["1 <= m, n <= 100", "The answer is at most 2 * 10^9."],
  harness: { fn: "uniquePaths", params: { m: "int", n: "int" }, returns: "int" },
  tests: [
    { m: 1, n: 10 },
    { m: 10, n: 1 },
    { m: 2, n: 2 },
    { m: 3, n: 3 },
    { m: 7, n: 3 },
    { m: 10, n: 10 },
    { m: 23, n: 12 },
    { m: 51, n: 9 },
    { m: 100, n: 2 },
    { m: 17, n: 17 },
    { m: 1, n: 100 },
    { m: 19, n: 13 },
    { m: 36, n: 7 },
  ],
  answer: {
    approach: [
      "The number of ways to reach a cell is the ways to reach the cell above plus the ways to reach the cell to the left.",
      "Every cell in the first row or first column has exactly one path.",
      "Fill the grid row by row. A single row array is enough: row[j] += row[j - 1].",
      "Math shortcut: the robot makes (m - 1) down moves and (n - 1) right moves, so the answer is C(m + n - 2, m - 1).",
    ],
    time: "O(m · n)",
    space: "O(n)",
    javascript: `function uniquePaths(m, n) {
    const row = new Array(n).fill(1);
    for (let i = 1; i < m; i++)
        for (let j = 1; j < n; j++) row[j] += row[j - 1];
    return row[n - 1];
}`,
    python: `class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        return math.comb(m + n - 2, m - 1)`,
  },
};
