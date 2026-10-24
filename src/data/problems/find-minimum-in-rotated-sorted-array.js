import { distinctInts } from "../gen.js";

const sorted = distinctInts(5000, -5000, 5000, 8).sort((a, b) => a - b);

export default {
  slug: "find-minimum-in-rotated-sorted-array",
  description: `An array of **unique** integers, sorted in ascending order, has been **rotated** between 1 and \`n\` times. For example \`[0,1,2,4,5,6,7]\` might become \`[4,5,6,7,0,1,2]\` (rotated 4 times) or stay \`[0,1,2,4,5,6,7]\` (rotated 7 times).

Given the rotated array \`nums\`, return its **minimum** element.

Your algorithm must run in **O(log n)** time.`,
  examples: [
    { input: { nums: [3, 4, 5, 1, 2] }, explanation: "The original array was [1,2,3,4,5], rotated 3 times." },
    { input: { nums: [4, 5, 6, 7, 0, 1, 2] }, explanation: "The minimum is 0." },
    { input: { nums: [11, 13, 15, 17] }, explanation: "Rotated a full cycle, so the array is sorted and the minimum is first." },
  ],
  constraints: ["n == nums.length", "1 <= n <= 5000", "-5000 <= nums[i] <= 5000", "All values are unique."],
  harness: { fn: "findMin", params: { nums: "int[]" }, returns: "int" },
  tests: [
    { nums: [1] },
    { nums: [2, 1] },
    { nums: [1, 2] },
    { nums: [3, 1, 2] },
    { nums: [2, 3, 1] },
    { nums: [5, 1, 2, 3, 4] },
    { nums: [2, 3, 4, 5, 1] },
    { nums: [-5000, 5000] },
    { nums: [10, 20, 30, -10, 0] },
    { nums: [6, 7, 8, 9, 10, 1, 2, 3, 4, 5] },
    { nums: [-1, 0, 1, 2, -3, -2] },
    { nums: [100, -100] },
    { nums: [...sorted.slice(4999), ...sorted.slice(0, 4999)] },
    { nums: [...sorted.slice(1), sorted[0]] },
    { nums: [...sorted.slice(2500), ...sorted.slice(0, 2500)] },
  ],
  answer: {
    approach: [
      "Binary search comparing nums[mid] with nums[hi].",
      "If nums[mid] > nums[hi], the rotation point (the minimum) must be to the right of mid: lo = mid + 1.",
      "Otherwise the right part from mid to hi is sorted, so the minimum is at mid or to its left: hi = mid.",
      "When lo == hi, that index holds the minimum.",
    ],
    time: "O(log n)",
    space: "O(1)",
    javascript: `function findMin(nums) {
    let lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] > nums[hi]) lo = mid + 1;
        else hi = mid;
    }
    return nums[lo];
}`,
    python: `class Solution:
    def findMin(self, nums: List[int]) -> int:
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] > nums[hi]:
                lo = mid + 1
            else:
                hi = mid
        return nums[lo]`,
  },
};
