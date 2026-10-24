import { ints, range } from "../gen.js";

export default {
  slug: "longest-increasing-subsequence",
  description: `Given an integer array \`nums\`, return the length of the **longest strictly increasing subsequence**.

A subsequence keeps the original order but may skip elements. For example, \`[3,6,2,7]\` is a subsequence of \`[0,3,1,6,2,2,7]\`.`,
  examples: [
    { input: { nums: [10, 9, 2, 5, 3, 7, 101, 18] }, explanation: "One longest subsequence is [2,3,7,101], length 4." },
    { input: { nums: [0, 1, 0, 3, 2, 3] }, explanation: "[0,1,2,3] has length 4." },
    { input: { nums: [7, 7, 7, 7, 7, 7, 7] }, explanation: "Strictly increasing, so equal values don't count: length 1." },
  ],
  constraints: ["1 <= nums.length <= 2500 (tests go higher)", "-10^4 <= nums[i] <= 10^4"],
  followUp: "Can you do it in O(n log n) time?",
  harness: { fn: "lengthOfLIS", params: { nums: "int[]" }, returns: "int" },
  tests: [
    { nums: [1] },
    { nums: [2, 1] },
    { nums: [1, 2] },
    { nums: [4, 10, 4, 3, 8, 9] },
    { nums: [1, 3, 6, 7, 9, 4, 10, 5, 6] },
    { nums: [3, 5, 6, 2, 5, 4, 19, 5, 6, 7, 12] },
    { nums: [5, 4, 3, 2, 1] },
    { nums: [-2, -1] },
    { nums: [10000, -10000, 0, 1] },
    { nums: [2, 2, 3, 3, 4, 4] },
    { nums: [1, 5, 2, 6, 3, 7, 4, 8] },
    { nums: [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15] },
    { nums: ints(20000, -10000, 10000, 1) },
    { nums: range(20000, -10000) },
  ],
  answer: {
    approach: [
      "Keep an array tails, where tails[k] is the smallest possible last value of an increasing subsequence of length k + 1.",
      "tails stays sorted. For each number x, binary search for the first tail >= x.",
      "If there is none, x extends the longest subsequence: append it. Otherwise replace that tail with x (a smaller tail is always better).",
      "The answer is tails.length. (The simple O(n²) DP: dp[i] = 1 + max dp[j] over j < i with nums[j] < nums[i].)",
    ],
    time: "O(n log n)",
    space: "O(n)",
    javascript: `function lengthOfLIS(nums) {
    const tails = [];
    for (const x of nums) {
        let lo = 0, hi = tails.length;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (tails[mid] < x) lo = mid + 1;
            else hi = mid;
        }
        tails[lo] = x;
    }
    return tails.length;
}`,
    python: `class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        tails = []
        for x in nums:
            i = bisect_left(tails, x)
            if i == len(tails):
                tails.append(x)
            else:
                tails[i] = x
        return len(tails)`,
  },
};
