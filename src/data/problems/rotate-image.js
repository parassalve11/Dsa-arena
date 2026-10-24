import { intGrid } from "../gen.js";

export default {
  slug: "rotate-image",
  description: `You are given an \`n x n\` 2D \`matrix\` that represents an image. Rotate the image by **90 degrees clockwise**.

You must rotate it **in place**: change the input matrix directly, without allocating another 2D matrix.`,
  examples: [
    { input: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] }, explanation: "The first row 1,2,3 becomes the last column, read top to bottom." },
    { input: { matrix: [[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]] }, explanation: "Result: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]." },
    { input: { matrix: [[1]] }, explanation: "A 1x1 image looks the same after rotation." },
  ],
  constraints: ["n == matrix.length == matrix[i].length", "1 <= n <= 20", "-1000 <= matrix[i][j] <= 1000"],
  harness: { fn: "rotate", params: { matrix: "int[][]" }, inplace: "matrix" },
  tests: [
    { matrix: [[1, 2], [3, 4]] },
    { matrix: [[0, 0], [0, 1]] },
    { matrix: [[-1, -2], [-3, -4]] },
    { matrix: [[1, 1, 1], [2, 2, 2], [3, 3, 3]] },
    { matrix: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]] },
    { matrix: [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15], [16, 17, 18, 19, 20], [21, 22, 23, 24, 25]] },
    { matrix: [[7, 7], [7, 7]] },
    { matrix: [[1000, -1000], [0, 5]] },
    { matrix: intGrid(6, 6, -1000, 1000, 1) },
    { matrix: intGrid(7, 7, -1000, 1000, 2) },
    { matrix: intGrid(9, 9, -10, 10, 3) },
    { matrix: intGrid(20, 20, -1000, 1000, 4) },
    { matrix: intGrid(19, 19, -1000, 1000, 5) },
  ],
  answer: {
    approach: [
      "A clockwise rotation is the same as two simple flips.",
      "First transpose the matrix: swap matrix[i][j] with matrix[j][i] for every j > i. Rows become columns.",
      "Then reverse each row. Together these move each element to its rotated position.",
    ],
    time: "O(n²)",
    space: "O(1)",
    javascript: `function rotate(matrix) {
    const n = matrix.length;
    for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++)
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    for (const row of matrix) row.reverse();
}`,
    python: `class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        n = len(matrix)
        for i in range(n):
            for j in range(i + 1, n):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
        for row in matrix:
            row.reverse()`,
  },
};
