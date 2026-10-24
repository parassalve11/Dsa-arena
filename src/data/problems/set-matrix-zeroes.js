import { grid, randInt } from "../gen.js";

const big = (m, n, seed) => grid(m, n, (r) => (r() < 0.002 ? 0 : randInt(r, -1000, 1000) || 1), seed);

export default {
  slug: "set-matrix-zeroes",
  description: `Given an \`m x n\` integer \`matrix\`, if any element is \`0\`, set its **entire row and entire column** to \`0\`.

Do it **in place**. Only zeros that were in the original matrix count; zeros you write do not spread further.`,
  examples: [
    { input: { matrix: [[1, 1, 1], [1, 0, 1], [1, 1, 1]] }, explanation: "The 0 in the middle wipes out row 1 and column 1." },
    { input: { matrix: [[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]] }, explanation: "Row 0 and columns 0 and 3 become zero." },
    { input: { matrix: [[1, 2], [3, 4]] }, explanation: "There are no zeros, so nothing changes." },
  ],
  constraints: ["m == matrix.length", "n == matrix[0].length", "1 <= m, n <= 200", "-2^31 <= matrix[i][j] <= 2^31 - 1"],
  followUp: "A simple fix uses O(m + n) space. Can you get down to O(1) extra space?",
  harness: { fn: "setZeroes", params: { matrix: "int[][]" }, inplace: "matrix" },
  tests: [
    { matrix: [[0]] },
    { matrix: [[5]] },
    { matrix: [[1, 0]] },
    { matrix: [[1], [0]] },
    { matrix: [[0, 0], [0, 0]] },
    { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 0]] },
    { matrix: [[0, 1], [1, 1]] },
    { matrix: [[1, 1, 1], [0, 1, 2]] },
    { matrix: [[1, 2, 3, 4], [5, 0, 7, 8], [0, 10, 11, 12], [13, 14, 15, 0]] },
    { matrix: [[-1], [2], [3]] },
    { matrix: [[1, 0, 3]] },
    { matrix: [[3, 5, 5, 6, 9, 1, 4, 5, 0, 5], [2, 7, 9, 5, 9, 5, 4, 9, 6, 8], [6, 0, 7, 8, 1, 0, 1, 6, 8, 1], [7, 2, 6, 5, 8, 5, 6, 5, 0, 6], [2, 3, 3, 1, 0, 4, 6, 5, 3, 5]] },
    { matrix: big(200, 200, 1) },
    { matrix: big(150, 200, 2) },
  ],
  answer: {
    approach: [
      "Use the first row and first column as marker storage: if matrix[i][j] is 0, set matrix[i][0] = 0 and matrix[0][j] = 0.",
      "Before that, remember separately whether the first row and the first column themselves had a zero, because their cells are about to be reused as markers.",
      "Then for every cell outside the first row and column, zero it if its row marker or column marker is 0.",
      "Finally zero the first row and/or first column if they originally contained a zero.",
    ],
    time: "O(m · n)",
    space: "O(1)",
    javascript: `function setZeroes(matrix) {
    const m = matrix.length, n = matrix[0].length;
    const firstRow = matrix[0].some((v) => v === 0);
    const firstCol = matrix.some((row) => row[0] === 0);
    for (let i = 1; i < m; i++)
        for (let j = 1; j < n; j++)
            if (matrix[i][j] === 0) { matrix[i][0] = 0; matrix[0][j] = 0; }
    for (let i = 1; i < m; i++)
        for (let j = 1; j < n; j++)
            if (matrix[i][0] === 0 || matrix[0][j] === 0) matrix[i][j] = 0;
    if (firstRow) for (let j = 0; j < n; j++) matrix[0][j] = 0;
    if (firstCol) for (let i = 0; i < m; i++) matrix[i][0] = 0;
}`,
    python: `class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        m, n = len(matrix), len(matrix[0])
        first_row = any(v == 0 for v in matrix[0])
        first_col = any(row[0] == 0 for row in matrix)
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][j] == 0:
                    matrix[i][0] = 0
                    matrix[0][j] = 0
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][0] == 0 or matrix[0][j] == 0:
                    matrix[i][j] = 0
        if first_row:
            for j in range(n):
                matrix[0][j] = 0
        if first_col:
            for i in range(m):
                matrix[i][0] = 0`,
  },
};
