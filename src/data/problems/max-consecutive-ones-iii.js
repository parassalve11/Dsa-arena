import { grid } from "../gen.js";

const big = (n, p, seed) => grid(1, n, (r) => (r() < p ? 1 : 0), seed)[0];

export default {
  slug: "max-consecutive-ones-iii",
  description: `Given a binary array \`nums\` and an integer \`k\`, return the maximum number of **consecutive 1s** you can get if you are allowed to flip **at most \`k\` zeros** into ones.`,
  examples: [
    { input: { nums: [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], k: 2 }, explanation: "Flip the zeros at indices 5 and 10 to get six 1s in a row (indices 5–10)." },
    { input: { nums: [0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], k: 3 }, explanation: "Flipping three zeros gives a run of 10 (indices 2–11)." },
    { input: { nums: [0, 0, 0], k: 0 }, explanation: "No flips allowed and there are no ones." },
  ],
  constraints: ["1 <= nums.length <= 10^5", "nums[i] is 0 or 1.", "0 <= k <= nums.length"],
  harness: { fn: "longestOnes", params: { nums: "int[]", k: "int" }, returns: "int" },
  tests: [
    { nums: [1], k: 0 },
    { nums: [0], k: 0 },
    { nums: [0], k: 1 },
    { nums: [1, 1, 1], k: 0 },
    { nums: [0, 0, 0, 1], k: 4 },
    { nums: [1, 0, 1, 0, 1], k: 1 },
    { nums: [0, 1, 0, 1, 0], k: 2 },
    { nums: [1, 1, 0, 0, 1, 1, 1], k: 1 },
    { nums: [0, 0, 1, 1, 1, 0, 0], k: 0 },
    { nums: [1, 0, 0, 0, 1], k: 3 },
    { nums: [0, 0, 0, 0, 0], k: 2 },
    { nums: [1, 0, 1, 1, 0, 1, 1, 1, 0, 1], k: 2 },
    { nums: big(100000, 0.7, 1), k: 1000 },
    { nums: big(100000, 0.5, 2), k: 0 },
  ],
  answer: {
    approach: [
      "Rephrase the problem: find the longest window that contains at most k zeros.",
      "Expand the window to the right, counting zeros inside it.",
      "While the window has more than k zeros, move the left edge right (and drop a zero from the count when one leaves).",
      "The largest valid window length is the answer.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function longestOnes(nums, k) {
    let left = 0, zeros = 0, best = 0;
    for (let right = 0; right < nums.length; right++) {
        if (nums[right] === 0) zeros++;
        while (zeros > k) {
            if (nums[left] === 0) zeros--;
            left++;
        }
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
    python: `class Solution:
    def longestOnes(self, nums: List[int], k: int) -> int:
        left = zeros = best = 0
        for right, x in enumerate(nums):
            if x == 0:
                zeros += 1
            while zeros > k:
                if nums[left] == 0:
                    zeros -= 1
                left += 1
            best = max(best, right - left + 1)
        return best`,
  },
};
