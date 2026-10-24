export default {
  slug: "first-bad-version",
  description: `You are a product manager and your latest product version failed a quality check. Every version is built on the previous one, so **every version after a bad version is also bad**.

There are \`n\` versions \`[1, 2, …, n]\`, and you want to find the **first bad one**, which causes all the later ones to be bad.

You are given an API \`isBadVersion(version)\` that returns whether \`version\` is bad. Find the first bad version while making **as few API calls as possible**.

**How the input works:** \`n\` is the number of versions and \`bad\` is the (hidden) first bad version. Your code only gets \`n\` and must use \`isBadVersion\` to find \`bad\`.`,
  examples: [
    { input: { n: 5, bad: 4 }, explanation: "isBadVersion(3) is false, isBadVersion(4) is true, so 4 is the first bad version." },
    { input: { n: 1, bad: 1 }, explanation: "The only version is bad." },
    { input: { n: 10, bad: 1 }, explanation: "Every version is bad, so the first is 1." },
  ],
  constraints: ["1 <= bad <= n <= 2^31 - 1"],
  harness: { fn: "firstBadVersion", adapter: "firstBadVersion", params: { n: "int" }, returns: "int", inputs: ["n", "bad"] },
  starter: {
    javascript: `/**
 * Definition for isBadVersion()
 *
 * @param {number} version number
 * @return {boolean} whether the version is bad
 * isBadVersion = function(version) {
 *     ...
 * };
 */

/**
 * @param {function} isBadVersion()
 * @return {function}
 */
var solution = function(isBadVersion) {
    /**
     * @param {number} n Total versions
     * @return {number} The first bad version
     */
    return function(n) {

    };
};
`,
    python: `# The isBadVersion API is already defined for you.
# def isBadVersion(version: int) -> bool:

class Solution:
    def firstBadVersion(self, n: int) -> int:
        `,
  },
  tests: [
    { n: 2, bad: 1 },
    { n: 2, bad: 2 },
    { n: 3, bad: 2 },
    { n: 100, bad: 50 },
    { n: 100, bad: 100 },
    { n: 100, bad: 1 },
    { n: 7, bad: 6 },
    { n: 1000000, bad: 999999 },
    { n: 2147483647, bad: 2147483647 },
    { n: 2147483647, bad: 1 },
    { n: 2126753390, bad: 1702766719 },
    { n: 2147483647, bad: 1073741824 },
    { n: 12, bad: 9 },
  ],
  answer: {
    approach: [
      "The versions look like [good, good, …, good, bad, bad, …], so binary search for the boundary.",
      "Search the range [1, n]. If isBadVersion(mid) is true, the first bad version is mid or earlier (hi = mid). Otherwise it is after mid (lo = mid + 1).",
      "When lo == hi, that is the first bad version.",
      "Compute mid as lo + (hi - lo) / 2 to avoid overflow in fixed-size integer languages.",
    ],
    time: "O(log n) API calls",
    space: "O(1)",
    javascript: `var solution = function(isBadVersion) {
    return function(n) {
        let lo = 1, hi = n;
        while (lo < hi) {
            const mid = lo + Math.floor((hi - lo) / 2);
            if (isBadVersion(mid)) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    };
};`,
    python: `class Solution:
    def firstBadVersion(self, n: int) -> int:
        lo, hi = 1, n
        while lo < hi:
            mid = (lo + hi) // 2
            if isBadVersion(mid):
                hi = mid
            else:
                lo = mid + 1
        return lo`,
  },
};
