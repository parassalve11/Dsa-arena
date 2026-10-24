import { str } from "../gen.js";

const mag = str(100000, "abcdefghijklmnopqrstuvwxyz", 13);
const note = mag.slice(500, 60500);

export default {
  slug: "ransom-note",
  description: `Given two strings \`ransomNote\` and \`magazine\`, return \`true\` if \`ransomNote\` can be built from the letters of \`magazine\`, and \`false\` otherwise.

Each letter in \`magazine\` can be used **only once**.`,
  examples: [
    { input: { ransomNote: "a", magazine: "b" }, explanation: "There is no 'a' in the magazine." },
    { input: { ransomNote: "aa", magazine: "ab" }, explanation: "The note needs two a's but the magazine has one." },
    { input: { ransomNote: "aa", magazine: "aab" }, explanation: "Both a's are available." },
  ],
  constraints: ["1 <= ransomNote.length, magazine.length <= 10^5", "Both strings consist of lowercase English letters."],
  harness: { fn: "canConstruct", params: { ransomNote: "string", magazine: "string" }, returns: "bool" },
  tests: [
    { ransomNote: "a", magazine: "a" },
    { ransomNote: "ab", magazine: "ba" },
    { ransomNote: "abc", magazine: "ab" },
    { ransomNote: "aab", magazine: "baa" },
    { ransomNote: "bg", magazine: "efjbdfbdgfjhhaiigfhbaejahgfbbgbjagbddfgdiaigdadhcfcj" },
    { ransomNote: "fffbfg", magazine: "effjfggbffjdgbjjhhdegh" },
    { ransomNote: "zzz", magazine: "zz" },
    { ransomNote: "hello", magazine: "hleloxyz" },
    { ransomNote: "abcdefghijklmnopqrstuvwxyz", magazine: "zyxwvutsrqponmlkjihgfedcba" },
    { ransomNote: "q", magazine: "abcdefghijklmnoprstuvwxyz" },
    { ransomNote: "aaaa", magazine: "aaaaaaa" },
    { ransomNote: "xy", magazine: "xxxx" },
    { ransomNote: note, magazine: mag },
    { ransomNote: mag + "a", magazine: mag },
  ],
  answer: {
    approach: [
      "Count how many times each letter appears in the magazine.",
      "Go through the note and use up one count per letter.",
      "If any count would go below zero, the magazine does not have enough of that letter.",
    ],
    time: "O(m + n)",
    space: "O(1), only 26 counters",
    javascript: `function canConstruct(ransomNote, magazine) {
    const count = new Array(26).fill(0);
    for (const c of magazine) count[c.charCodeAt(0) - 97]++;
    for (const c of ransomNote) {
        if (--count[c.charCodeAt(0) - 97] < 0) return false;
    }
    return true;
}`,
    python: `class Solution:
    def canConstruct(self, ransomNote: str, magazine: str) -> bool:
        need = Counter(ransomNote)
        have = Counter(magazine)
        return all(have[c] >= k for c, k in need.items())`,
  },
};
