import { ints } from "../gen.js";

export default {
  slug: "move-zeroes",
  description: `Given an integer array \`nums\`, move every \`0\` to the **end** of the array while keeping the **relative order** of the non-zero elements.

Do it **in place**, without making a copy of the array.`,
  examples: [
    { input: { nums: [0, 1, 0, 3, 12] }, explanation: "The non-zero values 1, 3, 12 keep their order, and both zeros go to the end." },
    { input: { nums: [0] }, explanation: "A single zero stays where it is." },
    { input: { nums: [4, 2, 0, 0, 1] }, explanation: "Result: [4,2,1,0,0]." },
  ],
  constraints: ["1 <= nums.length <= 10^4", "-2^31 <= nums[i] <= 2^31 - 1"],
  followUp: "Could you keep the number of writes to a minimum?",
  harness: { fn: "moveZeroes", params: { nums: "int[]" }, inplace: "nums" },
  tests: [
    { nums: [1] },
    { nums: [0, 0] },
    { nums: [1, 0] },
    { nums: [0, 1] },
    { nums: [1, 2, 3] },
    { nums: [0, 0, 1] },
    { nums: [2, 1, 0, 0, 0] },
    { nums: [-1, 0, -2, 0, -3] },
    { nums: [0, 0, 0, 5, 0, 0, 6] },
    { nums: [2147483647, 0, -2147483648] },
    { nums: [1, 0, 1, 0, 1, 0] },
    { nums: [9, 8, 7, 0, 6, 5, 0, 4] },
    { nums: ints(10000, -3, 3, 5) },
    { nums: ints(10000, 0, 1, 6) },
  ],
  answer: {
    approach: [
      "Keep a write pointer w that marks where the next non-zero value should go.",
      "Scan the array. Each time you meet a non-zero value, swap it into position w and move w forward.",
      "Because non-zero values are written in the order they appear, their relative order is kept.",
      "Everything from w to the end ends up being zero.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function moveZeroes(nums) {
    let w = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== 0) {
            [nums[w], nums[i]] = [nums[i], nums[w]];
            w++;
        }
    }
}`,
    python: `class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        w = 0
        for i in range(len(nums)):
            if nums[i] != 0:
                nums[w], nums[i] = nums[i], nums[w]
                w += 1`,
  },
};
