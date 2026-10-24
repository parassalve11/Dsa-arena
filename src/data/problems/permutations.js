export default {
  slug: "permutations",
  description: `Given an array \`nums\` of **distinct** integers, return **all possible permutations** (orderings) of it.

You may return the permutations in **any order**. The order of numbers inside each permutation matters, of course.`,
  examples: [
    { input: { nums: [1, 2, 3] }, explanation: "There are 3! = 6 orderings." },
    { input: { nums: [0, 1] }, explanation: "[0,1] and [1,0]." },
    { input: { nums: [1] }, explanation: "Only one ordering." },
  ],
  constraints: ["1 <= nums.length <= 6 (tests go up to 7)", "-10 <= nums[i] <= 10", "All integers are unique."],
  harness: { fn: "permute", params: { nums: "int[]" }, returns: "int[][]", compare: "unordered" },
  tests: [
    { nums: [5] },
    { nums: [-1, 1] },
    { nums: [3, 2, 1] },
    { nums: [0, -1, 1] },
    { nums: [1, 2, 3, 4] },
    { nums: [10, -10, 0, 5] },
    { nums: [4, 3, 2, 1] },
    { nums: [1, 2, 3, 4, 5] },
    { nums: [-5, 5, -3, 3, 0] },
    { nums: [9, 8] },
    { nums: [7, 1, 4] },
    { nums: [1, 2, 3, 4, 5, 6] },
    { nums: [6, -4, 2, 0, 9, -1, 3] },
  ],
  answer: {
    approach: [
      "Backtracking: build a permutation one position at a time.",
      "Keep a 'used' flag for each element. At each step, try every unused element in the next position, mark it used, and recurse.",
      "When the permutation has n elements, record a copy.",
      "Undo the choice (unmark it and pop it) before trying the next element.",
    ],
    time: "O(n · n!)",
    space: "O(n) for the recursion (plus the output)",
    javascript: `function permute(nums) {
    const out = [], cur = [], used = new Array(nums.length).fill(false);
    const backtrack = () => {
        if (cur.length === nums.length) {
            out.push(cur.slice());
            return;
        }
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            cur.push(nums[i]);
            backtrack();
            cur.pop();
            used[i] = false;
        }
    };
    backtrack();
    return out;
}`,
    python: `class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        out = []

        def backtrack(cur, rest):
            if not rest:
                out.append(cur[:])
                return
            for i in range(len(rest)):
                cur.append(rest[i])
                backtrack(cur, rest[:i] + rest[i + 1:])
                cur.pop()

        backtrack([], nums)
        return out`,
  },
};
