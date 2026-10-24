import { ints } from "../gen.js";

export default {
  slug: "product-of-array-except-self",
  description: `Given an integer array \`nums\`, return an array \`answer\` where \`answer[i]\` is the product of **every element except \`nums[i]\`**.

Every product fits in a 32-bit integer. You must solve it in **O(n)** time and **without using division**.`,
  examples: [
    { input: { nums: [1, 2, 3, 4] }, explanation: "For index 0: 2·3·4 = 24. For index 1: 1·3·4 = 12, and so on." },
    { input: { nums: [-1, 1, 0, -3, 3] }, explanation: "Only index 2 skips the zero, so it is the only non-zero product: -1·1·-3·3 = 9." },
    { input: { nums: [2, 3] }, explanation: "Each element's answer is simply the other element." },
  ],
  constraints: ["2 <= nums.length <= 10^5", "-30 <= nums[i] <= 30", "The product of any prefix or suffix fits in a 32-bit integer."],
  followUp: "Can you use only O(1) extra space (the output array does not count)?",
  harness: { fn: "productExceptSelf", params: { nums: "int[]" }, returns: "int[]" },
  tests: [
    { nums: [0, 0] },
    { nums: [0, 4] },
    { nums: [1, 1, 1, 1] },
    { nums: [-1, -1] },
    { nums: [5, 0, 2] },
    { nums: [0, 0, 3, 4] },
    { nums: [2, 2, 2, 2, 2] },
    { nums: [-2, 3, -4, 5] },
    { nums: [30, -30] },
    { nums: [1, 2, 3, 4, 5, 6] },
    { nums: [4, 3, 2, 1, 2] },
    { nums: [9, -1, 0, 1] },
    { nums: ints(100000, -1, 1, 4).map((x) => (x === 0 ? 1 : x)) },
    { nums: [...ints(50000, -1, 1, 5).map((x) => (x === 0 ? -1 : x)), 2, 3, 5, ...ints(49997, 1, 1, 6)] },
  ],
  answer: {
    approach: [
      "answer[i] = (product of everything to the left of i) × (product of everything to the right of i).",
      "First pass, left to right: store the running prefix product in answer[i] before multiplying in nums[i].",
      "Second pass, right to left: keep a running suffix product and multiply it into answer[i].",
      "No division is needed, and zeros are handled naturally.",
    ],
    time: "O(n)",
    space: "O(1) extra (besides the output)",
    javascript: `function productExceptSelf(nums) {
    const n = nums.length;
    const ans = new Array(n).fill(1);
    let left = 1;
    for (let i = 0; i < n; i++) {
        ans[i] = left;
        left *= nums[i];
    }
    let right = 1;
    for (let i = n - 1; i >= 0; i--) {
        ans[i] *= right;
        right *= nums[i];
    }
    return ans.map((x) => x + 0);
}`,
    python: `class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        ans = [1] * n
        left = 1
        for i in range(n):
            ans[i] = left
            left *= nums[i]
        right = 1
        for i in range(n - 1, -1, -1):
            ans[i] *= right
            right *= nums[i]
        return ans`,
  },
};
