import { intGrid } from "../gen.js";

export default {
  slug: "spiral-matrix",
  description: `Given an \`m x n\` \`matrix\`, return all of its elements in **spiral order**: go right along the top row, down the right column, left along the bottom row, up the left column, and keep spiralling inwards.`,
  examples: [
    { input: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] }, explanation: "Right 1,2,3 → down 6,9 → left 8,7 → up 4 → right 5." },
    { input: { matrix: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]] }, explanation: "Result: [1,2,3,4,8,12,11,10,9,5,6,7]." },
    { input: { matrix: [[7], [9], [6]] }, explanation: "A single column is read top to bottom." },
  ],
  constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 10", "-100 <= matrix[i][j] <= 100"],
  harness: { fn: "spiralOrder", params: { matrix: "int[][]" }, returns: "int[]" },
  tests: [
    { matrix: [[1]] },
    { matrix: [[1, 2]] },
    { matrix: [[1], [2]] },
    { matrix: [[1, 2], [3, 4]] },
    { matrix: [[1, 2, 3, 4, 5]] },
    { matrix: [[1, 2], [3, 4], [5, 6]] },
    { matrix: [[1, 2, 3], [4, 5, 6]] },
    { matrix: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]] },
    { matrix: [[2, 5, 8], [4, 0, -1]] },
    { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]] },
    { matrix: [[-100, 100], [0, 0], [100, -100]] },
    { matrix: intGrid(10, 10, -100, 100, 1) },
    { matrix: intGrid(10, 7, -100, 100, 2) },
    { matrix: intGrid(3, 10, -100, 100, 3) },
  ],
  answer: {
    approach: [
      "Keep four boundaries: top, bottom, left and right.",
      "Read the top row from left to right, then move top down by one.",
      "Read the right column top to bottom, then move right in. Then the bottom row right to left (if top <= bottom), and the left column bottom to top (if left <= right).",
      "Repeat until the boundaries cross. The two checks stop single rows or columns from being read twice.",
    ],
    time: "O(m · n)",
    space: "O(1) besides the output",
    javascript: `function spiralOrder(matrix) {
    const out = [];
    let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
    while (top <= bottom && left <= right) {
        for (let j = left; j <= right; j++) out.push(matrix[top][j]);
        top++;
        for (let i = top; i <= bottom; i++) out.push(matrix[i][right]);
        right--;
        if (top <= bottom) {
            for (let j = right; j >= left; j--) out.push(matrix[bottom][j]);
            bottom--;
        }
        if (left <= right) {
            for (let i = bottom; i >= top; i--) out.push(matrix[i][left]);
            left++;
        }
    }
    return out;
}`,
    python: `class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        out = []
        top, bottom, left, right = 0, len(matrix) - 1, 0, len(matrix[0]) - 1
        while top <= bottom and left <= right:
            for j in range(left, right + 1):
                out.append(matrix[top][j])
            top += 1
            for i in range(top, bottom + 1):
                out.append(matrix[i][right])
            right -= 1
            if top <= bottom:
                for j in range(right, left - 1, -1):
                    out.append(matrix[bottom][j])
                bottom -= 1
            if left <= right:
                for i in range(bottom, top - 1, -1):
                    out.append(matrix[i][left])
                left += 1
        return out`,
  },
};
