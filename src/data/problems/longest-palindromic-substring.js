import { str } from "../gen.js";

const core = str(300, "xyz", 9);
const big = str(350, "abcd", 10) + core + [...core].reverse().join("") + str(350, "abcd", 11);

export default {
  slug: "longest-palindromic-substring",
  description: `Given a string \`s\`, return the **longest substring** of \`s\` that is a **palindrome** (reads the same forwards and backwards).

If there are several longest palindromes of the same length, you may return any of them.`,
  examples: [
    { input: { s: "babad" }, explanation: "\"bab\" is a longest palindrome. \"aba\" would also be accepted." },
    { input: { s: "cbbd" }, explanation: "\"bb\" is the longest palindrome." },
    { input: { s: "a" }, explanation: "A single character is a palindrome." },
  ],
  constraints: ["1 <= s.length <= 1000", "s consists of English letters and digits."],
  harness: { fn: "longestPalindrome", params: { s: "string" }, returns: "string", validator: "longestPalindrome" },
  tests: [
    { s: "ac" },
    { s: "bb" },
    { s: "aaaa" },
    { s: "abcba" },
    { s: "abacdfgdcaba" },
    { s: "forgeeksskeegfor" },
    { s: "racecarxyz" },
    { s: "xyzracecar" },
    { s: "abcd" },
    { s: "aaabaaaa" },
    { s: "1221x" },
    { s: "Aa" },
    { s: "abbcccbbbcaaccbababcbcabca" },
    { s: big },
    { s: "a".repeat(1000) },
  ],
  answer: {
    approach: [
      "Every palindrome has a centre: either one character (odd length) or the gap between two characters (even length).",
      "For each of the 2n - 1 possible centres, expand outwards while the characters on both sides match.",
      "Track the longest span found and return that substring.",
      "This is O(n²) but very simple. Manacher's algorithm does it in O(n) if you need it.",
    ],
    time: "O(n²)",
    space: "O(1)",
    javascript: `function longestPalindrome(s) {
    let start = 0, len = 0;
    const expand = (l, r) => {
        while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
        if (r - l - 1 > len) { len = r - l - 1; start = l + 1; }
    };
    for (let i = 0; i < s.length; i++) {
        expand(i, i);
        expand(i, i + 1);
    }
    return s.slice(start, start + len);
}`,
    python: `class Solution:
    def longestPalindrome(self, s: str) -> str:
        start, length = 0, 0
        for i in range(len(s)):
            for l, r in ((i, i), (i, i + 1)):
                while l >= 0 and r < len(s) and s[l] == s[r]:
                    l -= 1
                    r += 1
                if r - l - 1 > length:
                    start, length = l + 1, r - l - 1
        return s[start:start + length]`,
  },
};
