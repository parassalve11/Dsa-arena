import { ints } from "../gen.js";

export default {
  slug: "house-robber",
  description: `You are a robber planning to rob houses along a street. \`nums[i]\` is the money in house \`i\`.

Neighbouring houses have connected alarms: if you rob **two adjacent houses**, the police are called.

Return the **maximum amount** you can rob without robbing two adjacent houses.`,
  examples: [
    { input: { nums: [1, 2, 3, 1] }, explanation: "Rob house 0 (1) and house 2 (3): total 4." },
    { input: { nums: [2, 7, 9, 3, 1] }, explanation: "Rob houses 0, 2 and 4: 2 + 9 + 1 = 12." },
    { input: { nums: [5] }, explanation: "Rob the only house." },
  ],
  constraints: ["1 <= nums.length <= 100 (tests go higher)", "0 <= nums[i] <= 400"],
  harness: { fn: "rob", params: { nums: "int[]" }, returns: "int" },
  tests: [
    { nums: [0] },
    { nums: [1, 2] },
    { nums: [2, 1] },
    { nums: [2, 1, 1, 2] },
    { nums: [0, 0, 0] },
    { nums: [400, 1, 1, 400] },
    { nums: [1, 3, 1, 3, 100] },
    { nums: [5, 5, 10, 100, 10, 5] },
    { nums: [2, 4, 8, 9, 9, 3] },
    { nums: [10, 1, 1, 10, 1, 1, 10] },
    { nums: [1, 1, 1, 1, 1, 1] },
    { nums: [183, 219, 57, 193, 94, 233, 202, 154, 65, 240, 97, 234, 100, 249, 186, 66, 90, 238, 168, 128] },
    { nums: ints(10000, 0, 400, 1) },
    { nums: ints(9999, 0, 400, 2) },
  ],
  answer: {
    approach: [
      "At each house you either skip it (keep the best total so far) or rob it (best total up to two houses back, plus this house).",
      "best(i) = max(best(i - 1), best(i - 2) + nums[i]).",
      "Only the previous two values matter, so keep two variables.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function rob(nums) {
    let prev = 0, cur = 0;
    for (const x of nums) [prev, cur] = [cur, Math.max(cur, prev + x)];
    return cur;
}`,
    python: `class Solution:
    def rob(self, nums: List[int]) -> int:
        prev = cur = 0
        for x in nums:
            prev, cur = cur, max(cur, prev + x)
        return cur`,
  },
};
