import { ints, range, shuffle } from "../gen.js";

const perm = shuffle(range(100000, 1), 3);
const holed = perm.slice();
holed[777] = -5;

export default {
  slug: "first-missing-positive",
  description: `Given an unsorted integer array \`nums\`, return the **smallest positive integer** that does **not** appear in it.

You must use **O(n)** time and **O(1)** extra space.`,
  examples: [
    { input: { nums: [1, 2, 0] }, explanation: "1 and 2 are present, so the answer is 3." },
    { input: { nums: [3, 4, -1, 1] }, explanation: "1 is present but 2 is missing." },
    { input: { nums: [7, 8, 9, 11, 12] }, explanation: "Even 1 is missing." },
  ],
  constraints: ["1 <= nums.length <= 10^5", "-2^31 <= nums[i] <= 2^31 - 1"],
  harness: { fn: "firstMissingPositive", params: { nums: "int[]" }, returns: "int" },
  tests: [
    { nums: [1] },
    { nums: [2] },
    { nums: [-1] },
    { nums: [0] },
    { nums: [1, 1] },
    { nums: [2, 2] },
    { nums: [1, 2, 3] },
    { nums: [3, 2, 1, 5] },
    { nums: [2147483647, 1, 2] },
    { nums: [-2147483648, -1, 0] },
    { nums: [0, 2, 2, 1, 1] },
    { nums: [4, 1, 6, 3, 2, 8, 5] },
    { nums: perm },
    { nums: holed },
    { nums: ints(100000, -100000, 100000, 4) },
  ],
  answer: {
    approach: [
      "The answer is always between 1 and n + 1, so only values in 1..n matter.",
      "Use the array itself as a hash table: try to put each value v (1 <= v <= n) at index v - 1 by swapping it there.",
      "Keep swapping at the same index until the value there is out of range or already in its correct spot (this also handles duplicates).",
      "Then scan: the first index i where nums[i] != i + 1 gives the answer i + 1. If every slot is correct, the answer is n + 1.",
    ],
    time: "O(n): every swap puts one value in its final place",
    space: "O(1)",
    javascript: `function firstMissingPositive(nums) {
    const n = nums.length;
    for (let i = 0; i < n; i++) {
        while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
            const j = nums[i] - 1;
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }
    }
    for (let i = 0; i < n; i++) if (nums[i] !== i + 1) return i + 1;
    return n + 1;
}`,
    python: `class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        n = len(nums)
        for i in range(n):
            while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
                j = nums[i] - 1
                nums[i], nums[j] = nums[j], nums[i]
        for i in range(n):
            if nums[i] != i + 1:
                return i + 1
        return n + 1`,
  },
};
