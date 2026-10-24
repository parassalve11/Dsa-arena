import { ints } from "../gen.js";

export default {
  slug: "container-with-most-water",
  description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines: line \`i\` goes from \`(i, 0)\` up to \`(i, height[i])\`.

Pick **two lines** that, together with the x-axis, hold the most water. The amount of water is the distance between the lines times the height of the **shorter** line.

Return the maximum amount of water a container can hold. You may not tilt the container.`,
  examples: [
    { input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, explanation: "Lines at index 1 (height 8) and index 8 (height 7) are 7 apart: 7 × 7 = 49." },
    { input: { height: [1, 1] }, explanation: "Width 1, height 1: area 1." },
    { input: { height: [4, 3, 2, 1, 4] }, explanation: "The two lines of height 4 are 4 apart: 16." },
  ],
  constraints: ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
  harness: { fn: "maxArea", params: { height: "int[]" }, returns: "int" },
  tests: [
    { height: [0, 0] },
    { height: [0, 5] },
    { height: [1, 2, 1] },
    { height: [2, 3, 4, 5, 18, 17, 6] },
    { height: [1, 2, 4, 3] },
    { height: [10000, 1, 10000] },
    { height: [5, 5, 5, 5, 5] },
    { height: [1, 3, 2, 5, 25, 24, 5] },
    { height: [6, 1, 1, 1, 1, 1, 6] },
    { height: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { height: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] },
    { height: [0, 14, 6, 2, 10, 9, 4, 1, 10, 3] },
    { height: ints(100000, 0, 10000, 1) },
    { height: Array.from({ length: 100000 }, (_, i) => (i % 2 ? 10000 : 1)) },
  ],
  answer: {
    approach: [
      "Start with the widest container: one pointer at each end.",
      "The area is limited by the shorter line. Moving the taller line inwards can never help, because the width shrinks and the height is still capped by the shorter line.",
      "So always move the pointer at the shorter line inwards, and record the area at every step.",
      "Stop when the pointers meet. The best area seen is the answer.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function maxArea(height) {
    let l = 0, r = height.length - 1, best = 0;
    while (l < r) {
        best = Math.max(best, (r - l) * Math.min(height[l], height[r]));
        if (height[l] < height[r]) l++;
        else r--;
    }
    return best;
}`,
    python: `class Solution:
    def maxArea(self, height: List[int]) -> int:
        l, r, best = 0, len(height) - 1, 0
        while l < r:
            best = max(best, (r - l) * min(height[l], height[r]))
            if height[l] < height[r]:
                l += 1
            else:
                r -= 1
        return best`,
  },
};
