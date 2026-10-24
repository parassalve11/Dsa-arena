import { ints } from "../gen.js";

const blocked = [...ints(9999, 1, 3, 1).map((x, i) => (i === 5000 ? 0 : x)), 1];
const ones = new Array(10000).fill(1);

export default {
  slug: "jump-game",
  description: `You are given an integer array \`nums\`. You start at the **first index**, and \`nums[i]\` is the **maximum** jump length from position \`i\`.

Return \`true\` if you can reach the **last index**, or \`false\` otherwise.`,
  examples: [
    { input: { nums: [2, 3, 1, 1, 4] }, explanation: "Jump 1 step to index 1, then 3 steps to the last index." },
    { input: { nums: [3, 2, 1, 0, 4] }, explanation: "Every path lands on index 3, whose jump length is 0." },
    { input: { nums: [0] }, explanation: "You already stand on the last index." },
  ],
  constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 10^5"],
  harness: { fn: "canJump", params: { nums: "int[]" }, returns: "bool" },
  tests: [
    { nums: [1] },
    { nums: [0, 1] },
    { nums: [1, 0] },
    { nums: [2, 0, 0] },
    { nums: [1, 0, 1] },
    { nums: [2, 5, 0, 0] },
    { nums: [1, 1, 1, 0] },
    { nums: [1, 1, 0, 1] },
    { nums: [5, 0, 0, 0, 0, 0] },
    { nums: [5, 0, 0, 0, 0, 0, 1] },
    { nums: [3, 0, 8, 2, 0, 0, 1] },
    { nums: [100000, 0, 0, 0] },
    { nums: ones },
    { nums: blocked },
    { nums: ints(10000, 0, 5, 2) },
  ],
  answer: {
    approach: [
      "Walk left to right, keeping the furthest index you can reach so far.",
      "If the current index is beyond that furthest point, you got stuck: return false.",
      "Otherwise update furthest = max(furthest, i + nums[i]).",
      "If you finish the loop (or furthest reaches the last index), return true.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function canJump(nums) {
    let far = 0;
    for (let i = 0; i < nums.length; i++) {
        if (i > far) return false;
        far = Math.max(far, i + nums[i]);
    }
    return true;
}`,
    python: `class Solution:
    def canJump(self, nums: List[int]) -> bool:
        far = 0
        for i, x in enumerate(nums):
            if i > far:
                return False
            far = max(far, i + x)
        return True`,
  },
};
