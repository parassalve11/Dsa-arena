import { str } from "../gen.js";

export default {
  slug: "decode-ways",
  description: `A message of letters A–Z is encoded as digits using \`"1" → A\`, \`"2" → B\`, …, \`"26" → Z\`.

To decode a string of digits, split it into groups where each group is a number from 1 to 26, then map each group back to a letter. Groups may not have leading zeros (\`"06"\` is not valid, though \`"6"\` is).

Given a digit string \`s\`, return the **number of ways** to decode it. The answer fits in a 32-bit integer.`,
  examples: [
    { input: { s: "12" }, explanation: "\"AB\" (1 2) or \"L\" (12)." },
    { input: { s: "226" }, explanation: "\"BZ\" (2 26), \"VF\" (22 6) or \"BBF\" (2 2 6)." },
    { input: { s: "06" }, explanation: "A leading 0 can't be decoded." },
  ],
  constraints: ["1 <= s.length <= 100", "s contains only digits and may contain leading zeros."],
  harness: { fn: "numDecodings", params: { s: "string" }, returns: "int" },
  tests: [
    { s: "0" },
    { s: "1" },
    { s: "10" },
    { s: "27" },
    { s: "100" },
    { s: "101" },
    { s: "110" },
    { s: "2101" },
    { s: "11106" },
    { s: "1201234" },
    { s: "301" },
    { s: "2611055971756562" },
    { s: "1".repeat(45) },
    { s: str(100, "1234567890", 1) },
    { s: "12".repeat(10) + "0" + "1".repeat(20) },
  ],
  answer: {
    approach: [
      "Let dp[i] be the number of ways to decode the first i characters. dp[0] = 1.",
      "A single digit s[i-1] can stand alone if it isn't '0': add dp[i-1].",
      "The two digits s[i-2..i-1] can form a letter if they make a number from 10 to 26: add dp[i-2].",
      "Return dp[n]. Only the last two values are needed.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function numDecodings(s) {
    let prev2 = 1, prev1 = s[0] === "0" ? 0 : 1;
    for (let i = 2; i <= s.length; i++) {
        let cur = 0;
        if (s[i - 1] !== "0") cur += prev1;
        const two = Number(s.slice(i - 2, i));
        if (two >= 10 && two <= 26) cur += prev2;
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}`,
    python: `class Solution:
    def numDecodings(self, s: str) -> int:
        prev2, prev1 = 1, (0 if s[0] == '0' else 1)
        for i in range(2, len(s) + 1):
            cur = 0
            if s[i - 1] != '0':
                cur += prev1
            if 10 <= int(s[i - 2:i]) <= 26:
                cur += prev2
            prev2, prev1 = prev1, cur
        return prev1`,
  },
};
