import { sortedInts } from "../gen.js";

const flat = sortedInts(100 * 100, -10000, 10000, 4);
const big = Array.from({ length: 100 }, (_, i) => flat.slice(i * 100, i * 100 + 100));

export default {
  slug: "search-a-2d-matrix",
  description: `You are given an \`m x n\` integer matrix with two properties:

- Each row is sorted in non-decreasing order.
- The first number of each row is greater than the last number of the previous row.

Given an integer \`target\`, return \`true\` if \`target\` is in the matrix, or \`false\` otherwise.

Your solution must run in **O(log(m · n))** time.`,
  examples: [
    { input: { matrix: [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target: 3 }, explanation: "3 is in the first row." },
    { input: { matrix: [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target: 13 }, explanation: "13 would sit between 11 and 16, but it is not there." },
    { input: { matrix: [[1]], target: 1 }, explanation: "The single element matches." },
  ],
  constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 100", "-10^4 <= matrix[i][j], target <= 10^4"],
  harness: { fn: "searchMatrix", params: { matrix: "int[][]", target: "int" }, returns: "bool" },
  tests: [
    { matrix: [[1]], target: 2 },
    { matrix: [[1, 3]], target: 3 },
    { matrix: [[1], [3]], target: 3 },
    { matrix: [[1], [3]], target: 2 },
    { matrix: [[1, 3, 5]], target: 0 },
    { matrix: [[1, 3, 5]], target: 6 },
    { matrix: [[1, 2], [3, 4], [5, 6]], target: 6 },
    { matrix: [[1, 2], [3, 4], [5, 6]], target: 1 },
    { matrix: [[-10, -8], [-5, -1], [0, 4]], target: -5 },
    { matrix: [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target: 60 },
    { matrix: [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target: 9 },
    { matrix: [[-10000, 10000]], target: 10000 },
    { matrix: big, target: flat[5555] },
    { matrix: big, target: 10001 },
    { matrix: big, target: flat[0] },
  ],
  answer: {
    approach: [
      "Because of the two properties, reading the matrix row by row gives one fully sorted list of m × n numbers.",
      "Binary search over indices 0..m·n - 1 of that virtual list.",
      "Convert a virtual index k to a cell with row = floor(k / n) and col = k % n.",
      "Compare and narrow the range as in a normal binary search.",
    ],
    time: "O(log(m · n))",
    space: "O(1)",
    javascript: `function searchMatrix(matrix, target) {
    const m = matrix.length, n = matrix[0].length;
    let lo = 0, hi = m * n - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const v = matrix[Math.floor(mid / n)][mid % n];
        if (v === target) return true;
        if (v < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return false;
}`,
    python: `class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        m, n = len(matrix), len(matrix[0])
        lo, hi = 0, m * n - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            v = matrix[mid // n][mid % n]
            if v == target:
                return True
            if v < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return False`,
  },
};
