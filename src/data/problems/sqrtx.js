export default {
  slug: "sqrtx",
  description: `Given a non-negative integer \`x\`, return the **square root of \`x\` rounded down** to the nearest integer. The result must also be non-negative.

You may **not** use any built-in power or square-root function (no \`Math.sqrt\`, \`x ** 0.5\`, \`pow\` and so on).`,
  examples: [
    { input: { x: 4 }, explanation: "The square root of 4 is exactly 2." },
    { input: { x: 8 }, explanation: "The square root of 8 is about 2.828, which rounds down to 2." },
    { input: { x: 0 }, explanation: "The square root of 0 is 0." },
  ],
  constraints: ["0 <= x <= 2^31 - 1"],
  harness: { fn: "mySqrt", params: { x: "int" }, returns: "int" },
  tests: [
    { x: 1 },
    { x: 2 },
    { x: 3 },
    { x: 9 },
    { x: 15 },
    { x: 16 },
    { x: 17 },
    { x: 99 },
    { x: 100 },
    { x: 2147395599 },
    { x: 2147395600 },
    { x: 2147483647 },
    { x: 1000000000 },
    { x: 999999999 },
  ],
  answer: {
    approach: [
      "Binary search for the largest integer m with m × m <= x.",
      "Search the range [0, x]. If mid × mid <= x, mid is a valid candidate, so remember it and look higher. Otherwise look lower.",
      "The last valid candidate is the answer.",
      "In languages with fixed-size integers, compare mid <= x / mid to avoid overflow.",
    ],
    time: "O(log x)",
    space: "O(1)",
    javascript: `function mySqrt(x) {
    let lo = 0, hi = x, ans = 0;
    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (mid * mid <= x) {
            ans = mid;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return ans;
}`,
    python: `class Solution:
    def mySqrt(self, x: int) -> int:
        lo, hi, ans = 0, x, 0
        while lo <= hi:
            mid = (lo + hi) // 2
            if mid * mid <= x:
                ans = mid
                lo = mid + 1
            else:
                hi = mid - 1
        return ans`,
  },
};
