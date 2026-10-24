import { shuffle, str } from "../gen.js";

const base = str(50000, "abcdefghijklmnopqrstuvwxyz", 1);
const perm = shuffle([...base], 2).join("");
const off = perm.slice(0, -1) + (perm.at(-1) === "a" ? "b" : "a");

export default {
  slug: "valid-anagram",
  description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an **anagram** of \`s\`, and \`false\` otherwise.

An anagram uses exactly the same letters the same number of times, just in a different order.`,
  examples: [
    { input: { s: "anagram", t: "nagaram" }, explanation: "Both words use a×3, n, g, r, m." },
    { input: { s: "rat", t: "car" }, explanation: "s has a 't' and t has a 'c', so they differ." },
    { input: { s: "listen", t: "silent" }, explanation: "Same letters, rearranged." },
  ],
  constraints: ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters."],
  followUp: "What if the inputs contain Unicode characters? How would you adapt your solution?",
  harness: { fn: "isAnagram", params: { s: "string", t: "string" }, returns: "bool" },
  tests: [
    { s: "a", t: "a" },
    { s: "a", t: "b" },
    { s: "ab", t: "a" },
    { s: "aa", t: "a" },
    { s: "ab", t: "ba" },
    { s: "aacc", t: "ccac" },
    { s: "abc", t: "abcd" },
    { s: "zzzz", t: "zzzz" },
    { s: "hello", t: "olleh" },
    { s: "dusty", t: "study" },
    { s: "abcdefghijklmnopqrstuvwxyz", t: "zyxwvutsrqponmlkjihgfedcba" },
    { s: "aab", t: "abb" },
    { s: base, t: perm },
    { s: base, t: off },
  ],
  answer: {
    approach: [
      "If the lengths differ, they can't be anagrams.",
      "Count letters: add 1 for every character of s and subtract 1 for every character of t, using an array of 26 counters (or a hash map).",
      "They are anagrams exactly when every counter ends at 0.",
      "For Unicode, use a hash map instead of a fixed 26-slot array.",
    ],
    time: "O(n)",
    space: "O(1), only 26 counters",
    javascript: `function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    const count = new Array(26).fill(0);
    for (let i = 0; i < s.length; i++) {
        count[s.charCodeAt(i) - 97]++;
        count[t.charCodeAt(i) - 97]--;
    }
    return count.every((c) => c === 0);
}`,
    python: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        return len(s) == len(t) and Counter(s) == Counter(t)`,
  },
};
