export default {
  slug: "number-of-1-bits",
  description: `Given a positive integer \`n\`, return the **number of 1 bits** in its binary representation (its **Hamming weight**).`,
  examples: [
    { input: { n: 11 }, explanation: "11 in binary is 1011, which has three 1 bits." },
    { input: { n: 128 }, explanation: "128 is 10000000: one 1 bit." },
    { input: { n: 2147483645 }, explanation: "1111111111111111111111111111101 has thirty 1 bits." },
  ],
  constraints: ["1 <= n <= 2^31 - 1"],
  followUp: "If this function is called many times, how would you optimise it?",
  harness: { fn: "hammingWeight", params: { n: "int" }, returns: "int" },
  tests: [
    { n: 1 },
    { n: 2 },
    { n: 3 },
    { n: 7 },
    { n: 8 },
    { n: 255 },
    { n: 256 },
    { n: 1023 },
    { n: 1073741824 },
    { n: 2147483647 },
    { n: 1431655765 },
    { n: 123456789 },
    { n: 987654321 },
  ],
  answer: {
    approach: [
      "n & (n - 1) clears the lowest set bit of n.",
      "Repeat that until n becomes 0, counting how many times you did it.",
      "The loop runs once per 1 bit, not once per bit position.",
      "If called a lot, precompute the count for every 8-bit value and add up the four bytes.",
    ],
    time: "O(number of 1 bits)",
    space: "O(1)",
    javascript: `function hammingWeight(n) {
    let count = 0;
    while (n !== 0) {
        n &= n - 1;
        count++;
    }
    return count;
}`,
    python: `class Solution:
    def hammingWeight(self, n: int) -> int:
        count = 0
        while n:
            n &= n - 1
            count += 1
        return count`,
  },
};
