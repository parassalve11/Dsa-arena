export default {
  slug: "climbing-stairs",
  description: `You are climbing a staircase with \`n\` steps. Each time you can climb **1 or 2 steps**.

In how many **distinct ways** can you reach the top?`,
  examples: [
    { input: { n: 2 }, explanation: "1 + 1 or 2: two ways." },
    { input: { n: 3 }, explanation: "1 + 1 + 1, 1 + 2, or 2 + 1: three ways." },
    { input: { n: 1 }, explanation: "Only a single 1-step." },
  ],
  constraints: ["1 <= n <= 45"],
  harness: { fn: "climbStairs", params: { n: "int" }, returns: "int" },
  tests: [{ n: 4 }, { n: 5 }, { n: 6 }, { n: 10 }, { n: 15 }, { n: 20 }, { n: 25 }, { n: 30 }, { n: 35 }, { n: 40 }, { n: 44 }, { n: 45 }],
  answer: {
    approach: [
      "To stand on step i, your last move came from step i - 1 or step i - 2.",
      "So ways(i) = ways(i - 1) + ways(i - 2): the Fibonacci numbers.",
      "Start with ways(1) = 1 and ways(2) = 2, and keep only the last two values while looping up to n.",
      "Plain recursion without memoisation is exponential and too slow for n = 45.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function climbStairs(n) {
    let a = 1, b = 1;
    for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
    return b;
}`,
    python: `class Solution:
    def climbStairs(self, n: int) -> int:
        a, b = 1, 1
        for _ in range(n - 1):
            a, b = b, a + b
        return b`,
  },
};
