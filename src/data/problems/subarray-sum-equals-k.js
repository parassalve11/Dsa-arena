import { ints } from "../gen.js";

export default {
  slug: "subarray-sum-equals-k",
  description: `Given an integer array \`nums\` and an integer \`k\`, return the **number of contiguous subarrays** whose elements add up to exactly \`k\`.

A subarray is a non-empty run of consecutive elements.`,
  examples: [
    { input: { nums: [1, 1, 1], k: 2 }, explanation: "The subarrays [1,1] at positions 0–1 and 1–2 both sum to 2." },
    { input: { nums: [1, 2, 3], k: 3 }, explanation: "[1,2] and [3] both sum to 3." },
    { input: { nums: [1, -1, 0], k: 0 }, explanation: "[1,-1], [0] and [1,-1,0] all sum to 0." },
  ],
  constraints: ["1 <= nums.length <= 2 * 10^4", "-1000 <= nums[i] <= 1000", "-10^7 <= k <= 10^7"],
  harness: { fn: "subarraySum", params: { nums: "int[]", k: "int" }, returns: "int" },
  tests: [
    { nums: [1], k: 0 },
    { nums: [1], k: 1 },
    { nums: [-1], k: -1 },
    { nums: [0, 0, 0], k: 0 },
    { nums: [3, 4, 7, 2, -3, 1, 4, 2], k: 7 },
    { nums: [1, 2, 1, 2, 1], k: 3 },
    { nums: [-1, -1, 1], k: 0 },
    { nums: [1000, -1000, 1000, -1000], k: 0 },
    { nums: [5, 5, 5, 5], k: 10 },
    { nums: [1, 2, 3, 4, 5], k: 100 },
    { nums: [28, 54, 7, -70, 22, 65, -6], k: 100 },
    { nums: [2, -2, 2, -2, 2], k: 2 },
    { nums: ints(20000, -1000, 1000, 6), k: 1000 },
    { nums: ints(20000, -2, 2, 7), k: 0 },
    { nums: new Array(20000).fill(0), k: 0 },
  ],
  answer: {
    approach: [
      "Let prefix be the running sum. The sum of nums[i..j] equals prefix[j] - prefix[i - 1].",
      "So a subarray ending at j sums to k exactly when some earlier prefix equals prefix[j] - k.",
      "Keep a hash map counting how many times each prefix sum has occurred, starting with {0: 1} for the empty prefix.",
      "At each element, add count[prefix - k] to the answer, then record the current prefix.",
    ],
    time: "O(n)",
    space: "O(n)",
    javascript: `function subarraySum(nums, k) {
    const seen = new Map([[0, 1]]);
    let sum = 0, count = 0;
    for (const x of nums) {
        sum += x;
        count += seen.get(sum - k) || 0;
        seen.set(sum, (seen.get(sum) || 0) + 1);
    }
    return count;
}`,
    python: `class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        seen = defaultdict(int)
        seen[0] = 1
        total = count = 0
        for x in nums:
            total += x
            count += seen[total - k]
            seen[total] += 1
        return count`,
  },
};
