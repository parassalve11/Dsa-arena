import { ints, shuffle } from "../gen.js";

function big(n, value, seed) {
  const k = Math.floor(n / 2) + 1;
  const rest = ints(n - k, -1e9, 1e9, seed).map((x) => (x === value ? x + 1 : x));
  return { nums: shuffle([...new Array(k).fill(value), ...rest], seed + 1) };
}

export default {
  slug: "majority-element",
  description: `Given an array \`nums\` of length \`n\`, return its **majority element**: the value that appears **more than ⌊n / 2⌋ times**.

You can assume a majority element always exists.`,
  examples: [
    { input: { nums: [3, 2, 3] }, explanation: "3 appears twice out of three, which is more than half." },
    { input: { nums: [2, 2, 1, 1, 1, 2, 2] }, explanation: "2 appears 4 times out of 7." },
    { input: { nums: [6] }, explanation: "A single element is the majority." },
  ],
  constraints: ["n == nums.length", "1 <= n <= 5 * 10^4", "-10^9 <= nums[i] <= 10^9", "A majority element always exists."],
  followUp: "Can you solve it in O(n) time and O(1) extra space?",
  harness: { fn: "majorityElement", params: { nums: "int[]" }, returns: "int" },
  tests: [
    { nums: [1, 1] },
    { nums: [1, 2, 1] },
    { nums: [-1, -1, 2] },
    { nums: [5, 5, 5, 1, 2] },
    { nums: [1, 2, 5, 5, 5] },
    { nums: [4, 1, 4, 2, 4, 3, 4] },
    { nums: [0, 0, 0, 0] },
    { nums: [-1000000000, -1000000000, 1000000000] },
    { nums: [8, 9, 8, 9, 8] },
    { nums: [7, 7, 5, 7, 5, 1, 5, 7, 5, 5, 7, 7, 7, 7, 7, 7] },
    { nums: [3, 3, 4] },
    { nums: [2, 9, 2, 9, 2, 9, 2] },
    big(50000, 42, 7),
    big(49999, -7, 8),
  ],
  answer: {
    approach: [
      "Use the Boyer–Moore voting idea: keep a candidate and a counter.",
      "When the counter is 0, take the current number as the new candidate.",
      "If the number equals the candidate, add 1 to the counter, otherwise subtract 1.",
      "Each different value cancels one copy of the candidate. The majority has more copies than everything else combined, so it is the one left at the end.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function majorityElement(nums) {
    let candidate = 0, count = 0;
    for (const x of nums) {
        if (count === 0) candidate = x;
        count += x === candidate ? 1 : -1;
    }
    return candidate;
}`,
    python: `class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        candidate, count = 0, 0
        for x in nums:
            if count == 0:
                candidate = x
            count += 1 if x == candidate else -1
        return candidate`,
  },
};
