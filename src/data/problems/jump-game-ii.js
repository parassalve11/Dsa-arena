import { ints } from "../gen.js";

export default {
  slug: "jump-game-ii",
  description: `You are given an integer array \`nums\` and start at index \`0\`. \`nums[i]\` is the **maximum** length of a forward jump from index \`i\`.

Return the **minimum number of jumps** needed to reach the last index. The tests guarantee the last index can be reached.`,
  examples: [
    { input: { nums: [2, 3, 1, 1, 4] }, explanation: "Jump 1 step to index 1, then 3 steps to the end: 2 jumps." },
    { input: { nums: [2, 3, 0, 1, 4] }, explanation: "Same idea: 2 jumps." },
    { input: { nums: [0] }, explanation: "You are already at the end: 0 jumps." },
  ],
  constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 1000", "The last index is always reachable."],
  harness: { fn: "jump", params: { nums: "int[]" }, returns: "int" },
  tests: [
    { nums: [1] },
    { nums: [1, 1] },
    { nums: [2, 1] },
    { nums: [1, 2] },
    { nums: [1, 1, 1, 1] },
    { nums: [3, 2, 1] },
    { nums: [1, 2, 3] },
    { nums: [5, 9, 3, 2, 1, 0, 2, 3, 3, 1, 0, 0] },
    { nums: [2, 1, 1, 1, 1] },
    { nums: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 0] },
    { nums: [1, 4, 3, 7, 1, 2, 6, 7, 6, 10] },
    { nums: [1000, 0, 0, 0, 0] },
    { nums: new Array(10000).fill(1) },
    { nums: ints(10000, 1, 10, 1) },
    { nums: ints(10000, 1, 1000, 2) },
  ],
  answer: {
    approach: [
      "Treat it as a BFS over index ranges: all indices reachable with j jumps form a window [start, end].",
      "While scanning the current window, track the furthest index reachable from it.",
      "When you reach the end of the current window, you must take another jump: increase the count and make the next window end at that furthest index.",
      "Stop as soon as the window covers the last index.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function jump(nums) {
    let jumps = 0, end = 0, far = 0;
    for (let i = 0; i < nums.length - 1; i++) {
        far = Math.max(far, i + nums[i]);
        if (i === end) {
            jumps++;
            end = far;
        }
    }
    return jumps;
}`,
    python: `class Solution:
    def jump(self, nums: List[int]) -> int:
        jumps = end = far = 0
        for i in range(len(nums) - 1):
            far = max(far, i + nums[i])
            if i == end:
                jumps += 1
                end = far
        return jumps`,
  },
};
