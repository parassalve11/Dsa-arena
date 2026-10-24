import { ints } from "../gen.js";

export default {
  slug: "sort-colors",
  description: `You are given an array \`nums\` of \`n\` items, each coloured red, white or blue, written as \`0\`, \`1\` and \`2\`.

Sort the array **in place** so that all 0s come first, then all 1s, then all 2s.

Do not use the library's sort function.`,
  examples: [
    { input: { nums: [2, 0, 2, 1, 1, 0] }, explanation: "Result: [0,0,1,1,2,2]." },
    { input: { nums: [2, 0, 1] }, explanation: "Result: [0,1,2]." },
    { input: { nums: [1] }, explanation: "A single element is already sorted." },
  ],
  constraints: ["n == nums.length", "1 <= n <= 300", "nums[i] is 0, 1 or 2."],
  followUp: "Can you do it in one pass with constant extra space?",
  harness: { fn: "sortColors", params: { nums: "int[]" }, inplace: "nums" },
  tests: [
    { nums: [0] },
    { nums: [2] },
    { nums: [2, 2, 2] },
    { nums: [1, 0] },
    { nums: [2, 1, 0] },
    { nums: [0, 1, 2] },
    { nums: [1, 2, 0, 1, 2, 0] },
    { nums: [2, 0, 2, 0, 2, 0] },
    { nums: [1, 1, 1, 0] },
    { nums: [2, 2, 1, 1, 0, 0] },
    { nums: [0, 0, 2, 2, 1] },
    { nums: [1, 2, 1, 2, 1] },
    { nums: ints(300, 0, 2, 7) },
    { nums: ints(299, 0, 2, 8) },
  ],
  answer: {
    approach: [
      "Dutch National Flag: keep three regions with pointers low, mid and high.",
      "Everything before low is 0, everything after high is 2, and mid scans the unknown middle part.",
      "If nums[mid] is 0, swap it with nums[low] and move both forward. If it is 1, just move mid. If it is 2, swap with nums[high] and move high back (don't move mid, since the swapped-in value is unchecked).",
      "Stop when mid passes high.",
    ],
    time: "O(n), one pass",
    space: "O(1)",
    javascript: `function sortColors(nums) {
    let low = 0, mid = 0, high = nums.length - 1;
    while (mid <= high) {
        if (nums[mid] === 0) {
            [nums[low], nums[mid]] = [nums[mid], nums[low]];
            low++; mid++;
        } else if (nums[mid] === 1) {
            mid++;
        } else {
            [nums[mid], nums[high]] = [nums[high], nums[mid]];
            high--;
        }
    }
}`,
    python: `class Solution:
    def sortColors(self, nums: List[int]) -> None:
        low, mid, high = 0, 0, len(nums) - 1
        while mid <= high:
            if nums[mid] == 0:
                nums[low], nums[mid] = nums[mid], nums[low]
                low += 1
                mid += 1
            elif nums[mid] == 1:
                mid += 1
            else:
                nums[mid], nums[high] = nums[high], nums[mid]
                high -= 1`,
  },
};
