import { str } from "../gen.js";

// The answer must be unique, so the target letters only appear together once.
const filler = str(50000, "abcdefgh", 2);
const big = filler.slice(0, 30000) + "XYZW" + filler.slice(30000);

export default {
  slug: "minimum-window-substring",
  description: `Given two strings \`s\` and \`t\`, return the **shortest substring** of \`s\` that contains **every character of \`t\`**, including duplicates (if \`t\` has two 'a's, the window needs at least two 'a's).

If there is no such substring, return the empty string \`""\`. The test cases are built so the answer is unique.`,
  examples: [
    { input: { s: "ADOBECODEBANC", t: "ABC" }, explanation: "\"BANC\" contains A, B and C, and no shorter window does." },
    { input: { s: "a", t: "a" }, explanation: "The whole string is the window." },
    { input: { s: "a", t: "aa" }, explanation: "s has only one 'a', so no window works." },
  ],
  constraints: ["m == s.length, n == t.length", "1 <= m, n <= 10^5", "s and t consist of uppercase and lowercase English letters."],
  followUp: "Can you find an algorithm that runs in O(m + n) time?",
  harness: { fn: "minWindow", params: { s: "string", t: "string" }, returns: "string" },
  tests: [
    { s: "a", t: "b" },
    { s: "ab", t: "b" },
    { s: "ab", t: "A" },
    { s: "abc", t: "cba" },
    { s: "aa", t: "aa" },
    { s: "bba", t: "ab" },
    { s: "cabwefgewcwaefgcf", t: "cae" },
    { s: "acbbaca", t: "aba" },
    { s: "aaaaaaaaaaaabbbbbcdd", t: "abcdd" },
    { s: "xyzabcxyz", t: "zab" },
    { s: "ABCDEFG", t: "GA" },
    { s: "aAbB", t: "Ab" },
    { s: big, t: "WXYZ" },
    { s: filler, t: "abcdefghX" },
  ],
  answer: {
    approach: [
      "Count the characters t needs, and track how many distinct characters are still unsatisfied.",
      "Move the right edge of a window over s, adding characters. When a character's count reaches what t needs, one fewer requirement is missing.",
      "Once nothing is missing, shrink from the left as far as possible while the window stays valid, recording the smallest window.",
      "Then drop the left character (which breaks validity) and continue expanding.",
    ],
    time: "O(m + n)",
    space: "O(k), where k is the alphabet size",
    javascript: `function minWindow(s, t) {
    const need = new Map();
    for (const c of t) need.set(c, (need.get(c) || 0) + 1);
    let missing = need.size, left = 0, bestL = 0, bestLen = Infinity;
    for (let right = 0; right < s.length; right++) {
        const c = s[right];
        if (need.has(c)) {
            need.set(c, need.get(c) - 1);
            if (need.get(c) === 0) missing--;
        }
        while (missing === 0) {
            if (right - left + 1 < bestLen) { bestLen = right - left + 1; bestL = left; }
            const d = s[left++];
            if (need.has(d)) {
                need.set(d, need.get(d) + 1);
                if (need.get(d) > 0) missing++;
            }
        }
    }
    return bestLen === Infinity ? "" : s.slice(bestL, bestL + bestLen);
}`,
    python: `class Solution:
    def minWindow(self, s: str, t: str) -> str:
        need = Counter(t)
        missing = len(need)
        left = 0
        best = (float('inf'), 0)
        for right, c in enumerate(s):
            if c in need:
                need[c] -= 1
                if need[c] == 0:
                    missing -= 1
            while missing == 0:
                best = min(best, (right - left + 1, left))
                d = s[left]
                left += 1
                if d in need:
                    need[d] += 1
                    if need[d] > 0:
                        missing += 1
        length, start = best
        return "" if length == float('inf') else s[start:start + length]`,
  },
};
