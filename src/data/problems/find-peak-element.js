import { rng, randInt } from "../gen.js";

// Random walk with no two equal neighbours.
function walk(n, seed) {
  const r = rng(seed);
  const out = [randInt(r, -1000, 1000)];
  for (let i = 1; i < n; i++) {
    let step = randInt(r, -5, 5);
    if (step === 0) step = 1;
    out.push(out[i - 1] + step);
  }
  return out;
}

export default {
  slug: "find-peak-element",
  description: `A **peak element** is an element strictly greater than its neighbours.

Given an integer array \`nums\` where no two adjacent elements are equal, find a peak element and return its **index**. If there are several peaks, returning **any** of them is accepted.

Treat \`nums[-1]\` and \`nums[n]\` as negative infinity, so an element at either end only needs to beat its one real neighbour.

Your algorithm must run in **O(log n)** time.`,
  examples: [
    { input: { nums: [1, 2, 3, 1] }, explanation: "3 at index 2 is a peak." },
    { input: { nums: [1, 2, 1, 3, 5, 6, 4] }, explanation: "Index 1 (value 2) and index 5 (value 6) are both peaks. Either answer is accepted." },
    { input: { nums: [5] }, explanation: "A single element is a peak." },
  ],
  constraints: ["1 <= nums.length <= 1000 (tests go up to 10^5)", "-2^31 <= nums[i] <= 2^31 - 1", "nums[i] != nums[i + 1] for every valid i."],
  harness: { fn: "findPeakElement", params: { nums: "int[]" }, returns: "int", validator: "peakElement" },
  tests: [
    { nums: [1, 2] },
    { nums: [2, 1] },
    { nums: [1, 2, 3] },
    { nums: [3, 2, 1] },
    { nums: [1, 3, 2] },
    { nums: [3, 1, 3] },
    { nums: [1, 2, 1, 2, 1] },
    { nums: [-2147483648, 2147483647] },
    { nums: [-2147483648] },
    { nums: [6, 5, 4, 3, 2, 3, 2] },
    { nums: [1, 5, 2, 7, 3, 9, 4] },
    { nums: [0, 10, 9, 8, 7, 6, 5, 4] },
    { nums: walk(100000, 1) },
    { nums: Array.from({ length: 100000 }, (_, i) => i) },
  ],
  answer: {
    approach: [
      "Compare nums[mid] with nums[mid + 1].",
      "If nums[mid] < nums[mid + 1], you are on an uphill slope, and there must be a peak to the right (the values can't rise forever because nums[n] is -∞): lo = mid + 1.",
      "Otherwise there is a peak at mid or to its left: hi = mid.",
      "When lo == hi you are standing on a peak.",
    ],
    time: "O(log n)",
    space: "O(1)",
    javascript: `function findPeakElement(nums) {
    let lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] < nums[mid + 1]) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
    python: `class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] < nums[mid + 1]:
                lo = mid + 1
            else:
                hi = mid
        return lo`,
  },
};
