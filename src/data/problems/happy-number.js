export default {
  slug: "happy-number",
  description: `A **happy number** is defined by this process:

- Start with any positive integer.
- Replace the number by the **sum of the squares of its digits**.
- Repeat. The number is happy if this eventually reaches \`1\`. Otherwise it loops forever in a cycle that does not include \`1\`.

Return \`true\` if \`n\` is a happy number, and \`false\` if it is not.`,
  examples: [
    { input: { n: 19 }, explanation: "1² + 9² = 82 → 8² + 2² = 68 → 6² + 8² = 100 → 1² + 0² + 0² = 1." },
    { input: { n: 2 }, explanation: "2 enters a cycle (4 → 16 → 37 → …) that never reaches 1." },
    { input: { n: 7 }, explanation: "7 → 49 → 97 → 130 → 10 → 1." },
  ],
  constraints: ["1 <= n <= 2^31 - 1"],
  harness: { fn: "isHappy", params: { n: "int" }, returns: "bool" },
  tests: [
    { n: 1 },
    { n: 3 },
    { n: 4 },
    { n: 10 },
    { n: 13 },
    { n: 20 },
    { n: 23 },
    { n: 100 },
    { n: 1111111 },
    { n: 2147483647 },
    { n: 999999999 },
    { n: 1000000000 },
    { n: 116 },
    { n: 989 },
  ],
  answer: {
    approach: [
      "Repeatedly replace n by the sum of the squares of its digits.",
      "The sequence either reaches 1 or falls into a cycle, so you need cycle detection.",
      "Either remember every number seen in a hash set, or use Floyd's tortoise-and-hare: move one pointer one step and another two steps, and stop when they meet.",
      "n is happy if the place they meet (or the end of the sequence) is 1.",
    ],
    time: "O(log n) per step, with a small bounded number of steps",
    space: "O(1) with Floyd's method",
    javascript: `function isHappy(n) {
    const next = (x) => {
        let sum = 0;
        while (x > 0) {
            const d = x % 10;
            sum += d * d;
            x = Math.floor(x / 10);
        }
        return sum;
    };
    let slow = n, fast = next(n);
    while (fast !== 1 && slow !== fast) {
        slow = next(slow);
        fast = next(next(fast));
    }
    return fast === 1;
}`,
    python: `class Solution:
    def isHappy(self, n: int) -> bool:
        def nxt(x):
            return sum(int(d) ** 2 for d in str(x))

        slow, fast = n, nxt(n)
        while fast != 1 and slow != fast:
            slow = nxt(slow)
            fast = nxt(nxt(fast))
        return fast == 1`,
  },
};
