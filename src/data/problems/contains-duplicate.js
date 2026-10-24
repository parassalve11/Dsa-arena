import { distinctInts, ints } from "../gen.js";

const unique = distinctInts(100000, -1e9, 1e9, 4);
const withDup = unique.slice();
withDup[99999] = withDup[12345];

export default {
  slug: "contains-duplicate",
  description: `Given an integer array \`nums\`, return \`true\` if **any value appears at least twice**. Return \`false\` if every element is distinct.`,
  examples: [
    { input: { nums: [1, 2, 3, 1] }, explanation: "The value 1 appears at index 0 and index 3." },
    { input: { nums: [1, 2, 3, 4] }, explanation: "All four values are different." },
    { input: { nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] }, explanation: "Several values repeat." },
  ],
  constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
  harness: { fn: "containsDuplicate", params: { nums: "int[]" }, returns: "bool" },
  tests: [
    { nums: [1] },
    { nums: [0, 0] },
    { nums: [-1, 1] },
    { nums: [5, 4, 3, 2, 1, 5] },
    { nums: [-1000000000, 1000000000] },
    { nums: [7, 7, 7, 7] },
    { nums: [3, 1, 4, 1, 5, 9] },
    { nums: [2, 14, 18, 22, 22] },
    { nums: [-3, -2, -1, 0, 1, 2, 3] },
    { nums: [1, 5, -2, -4, 0] },
    { nums: [0, 4, 5, 0, 3, 6] },
    { nums: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000] },
    { nums: unique },
    { nums: withDup },
    { nums: ints(100000, 1, 50000, 9) },
  ],
  answer: {
    approach: [
      "Keep a hash set of the values you have already seen.",
      "For each number, if it is already in the set you found a duplicate: return true.",
      "Otherwise add it. If the loop finishes, every value was unique.",
      "(Sorting and comparing neighbours also works in O(n log n) time with O(1) extra space.)",
    ],
    time: "O(n)",
    space: "O(n)",
    javascript: `function containsDuplicate(nums) {
    const seen = new Set();
    for (const x of nums) {
        if (seen.has(x)) return true;
        seen.add(x);
    }
    return false;
}`,
    python: `class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        seen = set()
        for x in nums:
            if x in seen:
                return True
            seen.add(x)
        return False`,
  },
};
