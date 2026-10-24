import { sortedInts } from "../gen.js";

export default {
  slug: "remove-duplicates-from-sorted-array",
  description: `Given an integer array \`nums\` sorted in **non-decreasing** order, remove the duplicates **in place** so each unique value appears only once, keeping their order.

Return \`k\`, the number of unique values. The first \`k\` slots of \`nums\` must hold those unique values in order. What you leave after the first \`k\` slots does not matter.

**How it is judged:** your returned \`k\` and the first \`k\` elements of \`nums\` are checked (the output shows \`nums[0..k-1]\`).`,
  examples: [
    { input: { nums: [1, 1, 2] }, explanation: "Return k = 2 with nums starting [1,2,…]." },
    { input: { nums: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4] }, explanation: "Return k = 5 with nums starting [0,1,2,3,4,…]." },
    { input: { nums: [7] }, explanation: "A single element is already unique." },
  ],
  constraints: ["1 <= nums.length <= 3 * 10^4", "-100 <= nums[i] <= 100", "nums is sorted in non-decreasing order."],
  harness: { fn: "removeDuplicates", params: { nums: "int[]" }, returns: "int", adapter: "firstK" },
  tests: [
    { nums: [1, 1] },
    { nums: [1, 2] },
    { nums: [1, 1, 1, 1] },
    { nums: [-1, 0, 0, 0, 3, 3] },
    { nums: [-100, -100, 100, 100] },
    { nums: [1, 2, 3, 4, 5] },
    { nums: [0, 0, 0, 1] },
    { nums: [0, 1, 1, 1] },
    { nums: [-3, -3, -2, -1, -1, 0, 0, 0, 0, 0] },
    { nums: [5, 6, 6, 7, 8, 8, 8, 9] },
    { nums: [2, 2, 2, 3] },
    { nums: [-50, -49, -49, -48] },
    { nums: sortedInts(30000, -100, 100, 1) },
    { nums: sortedInts(30000, -5, 5, 2) },
  ],
  answer: {
    approach: [
      "Because the array is sorted, duplicates sit next to each other.",
      "Keep a write pointer k that marks the end of the unique part (start with k = 1).",
      "Scan from index 1: when nums[i] differs from nums[k - 1], it is a new value, so copy it to nums[k] and increase k.",
      "Return k.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function removeDuplicates(nums) {
    let k = 1;
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] !== nums[k - 1]) nums[k++] = nums[i];
    }
    return k;
}`,
    python: `class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        k = 1
        for i in range(1, len(nums)):
            if nums[i] != nums[k - 1]:
                nums[k] = nums[i]
                k += 1
        return k`,
  },
};
