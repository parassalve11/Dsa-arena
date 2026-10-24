import { ints } from "../gen.js";

export default {
  slug: "next-permutation",
  description: `A permutation of an array is any ordering of its elements. The **next permutation** is the next ordering in dictionary (lexicographic) order.

For example, the next permutation of \`[1,2,3]\` is \`[1,3,2]\`. If the array is already the **largest** ordering (like \`[3,2,1]\`), wrap around to the **smallest** one, which is sorted ascending.

Rearrange \`nums\` into its next permutation **in place**, using only constant extra memory.`,
  examples: [
    { input: { nums: [1, 2, 3] }, explanation: "The next ordering after 1,2,3 is 1,3,2." },
    { input: { nums: [3, 2, 1] }, explanation: "This is the largest ordering, so wrap around to [1,2,3]." },
    { input: { nums: [1, 1, 5] }, explanation: "The next ordering is [1,5,1]." },
  ],
  constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 100"],
  harness: { fn: "nextPermutation", params: { nums: "int[]" }, inplace: "nums" },
  tests: [
    { nums: [1] },
    { nums: [1, 2] },
    { nums: [2, 1] },
    { nums: [1, 3, 2] },
    { nums: [2, 3, 1] },
    { nums: [1, 5, 1] },
    { nums: [5, 1, 1] },
    { nums: [2, 2, 2] },
    { nums: [1, 2, 3, 6, 5, 4] },
    { nums: [0, 0, 4, 2, 1, 0] },
    { nums: [4, 3, 2, 1, 5] },
    { nums: [100, 99, 0, 100] },
    { nums: ints(100, 0, 100, 3) },
    { nums: Array.from({ length: 100 }, (_, i) => 100 - i) },
  ],
  answer: {
    approach: [
      "From the right, find the first index i where nums[i] < nums[i + 1]. Everything after i is in decreasing order, so it is already the largest it can be.",
      "If no such i exists, the whole array is decreasing: reverse it to get the smallest ordering.",
      "Otherwise, find the rightmost j > i with nums[j] > nums[i], and swap nums[i] and nums[j]. This makes position i just a little bigger.",
      "Finally reverse the part after i, so it becomes increasing (the smallest possible tail).",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function nextPermutation(nums) {
    let i = nums.length - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) i--;
    if (i >= 0) {
        let j = nums.length - 1;
        while (nums[j] <= nums[i]) j--;
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
        [nums[l], nums[r]] = [nums[r], nums[l]];
        l++; r--;
    }
}`,
    python: `class Solution:
    def nextPermutation(self, nums: List[int]) -> None:
        i = len(nums) - 2
        while i >= 0 and nums[i] >= nums[i + 1]:
            i -= 1
        if i >= 0:
            j = len(nums) - 1
            while nums[j] <= nums[i]:
                j -= 1
            nums[i], nums[j] = nums[j], nums[i]
        l, r = i + 1, len(nums) - 1
        while l < r:
            nums[l], nums[r] = nums[r], nums[l]
            l += 1
            r -= 1`,
  },
};
