export default {
  slug: "counting-bits",
  description: `Given an integer \`n\`, return an array \`ans\` of length \`n + 1\` where \`ans[i]\` is the **number of 1 bits** in the binary form of \`i\`, for every \`i\` from \`0\` to \`n\`.`,
  examples: [
    { input: { n: 2 }, explanation: "0 → 0, 1 → 1, 2 (10) → 1." },
    { input: { n: 5 }, explanation: "0, 1, 1, 2 (11), 1 (100), 2 (101)." },
    { input: { n: 0 }, explanation: "Just 0, which has no 1 bits." },
  ],
  constraints: ["0 <= n <= 10^5"],
  followUp: "Can you do it in one pass, O(n), without a built-in popcount?",
  harness: { fn: "countBits", params: { n: "int" }, returns: "int[]" },
  tests: [{ n: 1 }, { n: 3 }, { n: 4 }, { n: 7 }, { n: 8 }, { n: 15 }, { n: 16 }, { n: 31 }, { n: 64 }, { n: 100 }, { n: 1000 }, { n: 65536 }, { n: 100000 }],
  answer: {
    approach: [
      "i >> 1 is i with its last bit removed, and it is smaller than i, so its answer is already known.",
      "So ans[i] = ans[i >> 1] + (i & 1): the bits of i without the last bit, plus the last bit.",
      "Fill the array from 1 up to n in one pass.",
    ],
    time: "O(n)",
    space: "O(1) besides the output",
    javascript: `function countBits(n) {
    const ans = new Array(n + 1).fill(0);
    for (let i = 1; i <= n; i++) ans[i] = ans[i >> 1] + (i & 1);
    return ans;
}`,
    python: `class Solution:
    def countBits(self, n: int) -> List[int]:
        ans = [0] * (n + 1)
        for i in range(1, n + 1):
            ans[i] = ans[i >> 1] + (i & 1)
        return ans`,
  },
};
