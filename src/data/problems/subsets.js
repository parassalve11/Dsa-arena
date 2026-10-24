import { distinctInts } from "../gen.js";

export default {
  slug: "subsets",
  description: `Given an integer array \`nums\` of **unique** elements, return **all possible subsets** (the power set).

The result must not contain duplicate subsets. You may return them in **any order**, and the elements inside each subset in any order.`,
  examples: [
    { input: { nums: [1, 2, 3] }, explanation: "All 2³ = 8 subsets, from [] to [1,2,3]." },
    { input: { nums: [0] }, explanation: "The empty set and [0]." },
    { input: { nums: [4, 7] }, explanation: "[], [4], [7] and [4,7]." },
  ],
  constraints: ["1 <= nums.length <= 10", "-10 <= nums[i] <= 10", "All elements are unique."],
  harness: { fn: "subsets", params: { nums: "int[]" }, returns: "int[][]", compare: "unorderedNested" },
  tests: [
    { nums: [5] },
    { nums: [-1, 1] },
    { nums: [3, 2, 1] },
    { nums: [1, 2, 3, 4] },
    { nums: [-10, 10, 0] },
    { nums: [9, 0, 3, 5, 7] },
    { nums: [1, 3, 5, 7, 9, 2] },
    { nums: [-5, -4, -3, -2] },
    { nums: [0, 1] },
    { nums: [8, 6, 4, 2, 0, -2, -4] },
    { nums: [10, -10] },
    { nums: [1, 2, 3, 4, 5, 6, 7, 8] },
    { nums: distinctInts(10, -10, 10, 1) },
    { nums: [-10, -8, -6, -4, -2, 0, 2, 4, 6, 8] },
  ],
  answer: {
    approach: [
      "Backtracking: for each element, either leave it out or put it in, giving 2^n subsets.",
      "Use a recursive helper start(i) with a current list. Record a copy of the current list (every partial list is a valid subset).",
      "Then for each j from i to n - 1, add nums[j], recurse with j + 1, and remove nums[j] again.",
      "Iterative alternative: start with [[]] and for each number append it to a copy of every subset so far.",
    ],
    time: "O(n · 2^n)",
    space: "O(n) for the recursion (plus the output)",
    javascript: `function subsets(nums) {
    const out = [], cur = [];
    const backtrack = (start) => {
        out.push(cur.slice());
        for (let i = start; i < nums.length; i++) {
            cur.push(nums[i]);
            backtrack(i + 1);
            cur.pop();
        }
    };
    backtrack(0);
    return out;
}`,
    python: `class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        out = [[]]
        for x in nums:
            out += [s + [x] for s in out]
        return out`,
  },
};
