import { ints } from "../gen.js";

export default {
  slug: "trapping-rain-water",
  description: `You are given \`n\` non-negative integers that describe an elevation map. Each bar has width 1, and \`height[i]\` is the height of bar \`i\`.

Work out how many units of rain **water** are trapped between the bars after it rains.`,
  examples: [
    { input: { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] }, explanation: "Water collects in the dips between taller bars, 6 units in total." },
    { input: { height: [4, 2, 0, 3, 2, 5] }, explanation: "Water above each bar: 0,2,4,1,2,0, giving 9." },
    { input: { height: [3, 0, 3] }, explanation: "The middle gap holds 3 units." },
  ],
  constraints: ["n == height.length", "1 <= n <= 2 * 10^4", "0 <= height[i] <= 10^5"],
  harness: { fn: "trap", params: { height: "int[]" }, returns: "int" },
  tests: [
    { height: [0] },
    { height: [5] },
    { height: [2, 0] },
    { height: [1, 2, 3, 4] },
    { height: [4, 3, 2, 1] },
    { height: [2, 0, 2] },
    { height: [5, 4, 1, 2] },
    { height: [0, 0, 0, 0] },
    { height: [5, 2, 1, 2, 1, 5] },
    { height: [4, 2, 3] },
    { height: [100000, 0, 0, 0, 100000] },
    { height: [6, 4, 2, 0, 3, 2, 0, 3, 1, 4, 5, 3, 2, 7, 5, 3, 0, 1, 2, 1, 3, 4, 6, 8, 1, 3] },
    { height: ints(20000, 0, 100000, 1) },
    { height: Array.from({ length: 20000 }, (_, i) => Math.abs(10000 - i)) },
  ],
  answer: {
    approach: [
      "The water above bar i equals min(highest bar on its left, highest bar on its right) - height[i].",
      "Use two pointers from both ends, keeping leftMax and rightMax.",
      "Move the side whose current max is smaller. That side's water level is fully decided by its own max, because the other side is known to have something at least as tall.",
      "Add max - height at the moved pointer to the total.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function trap(height) {
    let l = 0, r = height.length - 1;
    let leftMax = 0, rightMax = 0, water = 0;
    while (l < r) {
        if (height[l] < height[r]) {
            leftMax = Math.max(leftMax, height[l]);
            water += leftMax - height[l];
            l++;
        } else {
            rightMax = Math.max(rightMax, height[r]);
            water += rightMax - height[r];
            r--;
        }
    }
    return water;
}`,
    python: `class Solution:
    def trap(self, height: List[int]) -> int:
        l, r = 0, len(height) - 1
        left_max = right_max = water = 0
        while l < r:
            if height[l] < height[r]:
                left_max = max(left_max, height[l])
                water += left_max - height[l]
                l += 1
            else:
                right_max = max(right_max, height[r])
                water += right_max - height[r]
                r -= 1
        return water`,
  },
};
