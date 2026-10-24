import { ints } from "../gen.js";

export default {
  slug: "rotate-array",
  description: `Given an integer array \`nums\`, rotate it to the **right** by \`k\` steps, where \`k\` is non-negative.

Rotating right by one step moves the last element to the front. Modify \`nums\` **in place**.`,
  examples: [
    { input: { nums: [1, 2, 3, 4, 5, 6, 7], k: 3 }, explanation: "After 1 step: [7,1,2,3,4,5,6]. After 2: [6,7,1,2,3,4,5]. After 3: [5,6,7,1,2,3,4]." },
    { input: { nums: [-1, -100, 3, 99], k: 2 }, explanation: "The last two elements move to the front: [3,99,-1,-100]." },
    { input: { nums: [1, 2], k: 3 }, explanation: "Rotating a length-2 array 3 times is the same as rotating it once: [2,1]." },
  ],
  constraints: ["1 <= nums.length <= 10^5", "-2^31 <= nums[i] <= 2^31 - 1", "0 <= k <= 10^5"],
  followUp: "Can you do it in place with O(1) extra space?",
  harness: { fn: "rotate", params: { nums: "int[]", k: "int" }, inplace: "nums" },
  tests: [
    { nums: [1], k: 0 },
    { nums: [1], k: 5 },
    { nums: [1, 2, 3], k: 0 },
    { nums: [1, 2, 3], k: 3 },
    { nums: [1, 2, 3], k: 4 },
    { nums: [1, 2, 3, 4, 5, 6], k: 2 },
    { nums: [1, 2, 3, 4, 5, 6], k: 5 },
    { nums: [-1, -2], k: 1 },
    { nums: [2147483647, -2147483648, 0], k: 1 },
    { nums: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], k: 100000 },
    { nums: [5, 5, 6, 6], k: 2 },
    { nums: [9, 8, 7, 6, 5], k: 7 },
    { nums: ints(100000, -1e9, 1e9, 1), k: 54321 },
    { nums: ints(99999, -1e9, 1e9, 2), k: 100000 },
  ],
  answer: {
    approach: [
      "Only k % n steps matter, because n steps bring the array back to where it started.",
      "Reverse the whole array. The last k elements are now at the front, but in reverse order.",
      "Reverse the first k elements, then reverse the remaining n - k elements, to put both parts back in order.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function rotate(nums, k) {
    const n = nums.length;
    k %= n;
    const reverse = (l, r) => {
        while (l < r) {
            [nums[l], nums[r]] = [nums[r], nums[l]];
            l++; r--;
        }
    };
    reverse(0, n - 1);
    reverse(0, k - 1);
    reverse(k, n - 1);
}`,
    python: `class Solution:
    def rotate(self, nums: List[int], k: int) -> None:
        n = len(nums)
        k %= n

        def reverse(l, r):
            while l < r:
                nums[l], nums[r] = nums[r], nums[l]
                l += 1
                r -= 1

        reverse(0, n - 1)
        reverse(0, k - 1)
        reverse(k, n - 1)`,
  },
};
