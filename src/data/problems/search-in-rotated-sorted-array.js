import { distinctInts } from "../gen.js";

const sorted = distinctInts(5000, -10000, 10000, 7).sort((a, b) => a - b);
const rotated = [...sorted.slice(3210), ...sorted.slice(0, 3210)];

export default {
  slug: "search-in-rotated-sorted-array",
  description: `An array sorted in ascending order with **distinct** values has been **rotated** at some unknown pivot. For example, \`[0,1,2,4,5,6,7]\` might become \`[4,5,6,7,0,1,2]\`.

Given the rotated array \`nums\` and an integer \`target\`, return the index of \`target\`, or \`-1\` if it is not in \`nums\`.

Your algorithm must run in **O(log n)** time.`,
  examples: [
    { input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 0 }, explanation: "0 is at index 4." },
    { input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 3 }, explanation: "3 is not present." },
    { input: { nums: [1], target: 0 }, explanation: "Not present." },
  ],
  constraints: ["1 <= nums.length <= 5000", "-10^4 <= nums[i], target <= 10^4", "All values are unique.", "nums is an ascending array that may have been rotated."],
  harness: { fn: "search", params: { nums: "int[]", target: "int" }, returns: "int" },
  tests: [
    { nums: [1], target: 1 },
    { nums: [1, 3], target: 3 },
    { nums: [3, 1], target: 1 },
    { nums: [3, 1], target: 3 },
    { nums: [5, 1, 3], target: 5 },
    { nums: [5, 1, 3], target: 3 },
    { nums: [4, 5, 6, 7, 8, 1, 2, 3], target: 8 },
    { nums: [6, 7, 1, 2, 3, 4, 5], target: 6 },
    { nums: [1, 2, 3, 4, 5, 6], target: 4 },
    { nums: [2, 3, 4, 5, 6, 7, 8, 9, 1], target: 9 },
    { nums: [7, 8, 1, 2, 3, 4, 5, 6], target: 2 },
    { nums: [15, 16, 19, 20, 25, 1, 3, 4, 5, 7, 10, 14], target: 13 },
    { nums: rotated, target: rotated[100] },
    { nums: rotated, target: rotated[4000] },
    { nums: rotated, target: 10001 },
  ],
  answer: {
    approach: [
      "Do a binary search, but at each step at least one half of [lo, hi] is properly sorted.",
      "If nums[lo] <= nums[mid], the left half is sorted. If target lies between nums[lo] and nums[mid], search left, otherwise search right.",
      "Otherwise the right half is sorted. If target lies between nums[mid] and nums[hi], search right, otherwise search left.",
      "Return mid when nums[mid] == target, or -1 when the range is empty.",
    ],
    time: "O(log n)",
    space: "O(1)",
    javascript: `function search(nums, target) {
    let lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] === target) return mid;
        if (nums[lo] <= nums[mid]) {
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}`,
    python: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        lo, hi = 0, len(nums) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                return mid
            if nums[lo] <= nums[mid]:
                if nums[lo] <= target < nums[mid]:
                    hi = mid - 1
                else:
                    lo = mid + 1
            else:
                if nums[mid] < target <= nums[hi]:
                    lo = mid + 1
                else:
                    hi = mid - 1
        return -1`,
  },
};
