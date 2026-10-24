import { str } from "../gen.js";

export default {
  slug: "longest-substring-without-repeating-characters",
  description: `Given a string \`s\`, find the length of the **longest substring** that has **no repeated characters**.

A substring is a contiguous block of characters.`,
  examples: [
    { input: { s: "abcabcbb" }, explanation: "\"abc\" is the longest substring with all different characters, length 3." },
    { input: { s: "bbbbb" }, explanation: "Every substring longer than 1 repeats 'b'." },
    { input: { s: "pwwkew" }, explanation: "\"wke\" has length 3. \"pwke\" is a subsequence, not a substring." },
  ],
  constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
  harness: { fn: "lengthOfLongestSubstring", params: { s: "string" }, returns: "int" },
  tests: [
    { s: "" },
    { s: " " },
    { s: "a" },
    { s: "au" },
    { s: "dvdf" },
    { s: "abba" },
    { s: "tmmzuxt" },
    { s: "abcdefg" },
    { s: "aab" },
    { s: "a b c a" },
    { s: "!@#$%^&*()!" },
    { s: "anviaj" },
    { s: str(50000, "abcdefghijklmnopqrstuvwxyz0123456789", 1) },
    { s: "abcdefghijklmnopqrstuvwxyz".repeat(1900) },
  ],
  answer: {
    approach: [
      "Slide a window [left, right] over the string so that it never contains a repeated character.",
      "Remember the last index where each character was seen.",
      "When s[right] was seen inside the current window, jump left to one past that previous position.",
      "After each step, the window is valid, so update the best length with right - left + 1.",
    ],
    time: "O(n)",
    space: "O(k), where k is the number of distinct characters",
    javascript: `function lengthOfLongestSubstring(s) {
    const last = new Map();
    let left = 0, best = 0;
    for (let right = 0; right < s.length; right++) {
        const c = s[right];
        if (last.has(c) && last.get(c) >= left) left = last.get(c) + 1;
        last.set(c, right);
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
    python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last = {}
        left = best = 0
        for right, c in enumerate(s):
            if c in last and last[c] >= left:
                left = last[c] + 1
            last[c] = right
            best = max(best, right - left + 1)
        return best`,
  },
};
