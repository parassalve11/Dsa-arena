import { str } from "../gen.js";

const big = str(10000, "abcde", 7);
const sub = [...big].filter((_, i) => i % 97 === 0).join("");

export default {
  slug: "is-subsequence",
  description: `Given two strings \`s\` and \`t\`, return \`true\` if \`s\` is a **subsequence** of \`t\`, or \`false\` otherwise.

A subsequence is formed by deleting some (possibly zero) characters from a string **without changing the order** of the rest. For example, \`"ace"\` is a subsequence of \`"abcde"\`, but \`"aec"\` is not.`,
  examples: [
    { input: { s: "abc", t: "ahbgdc" }, explanation: "a, b and c appear in t in that order." },
    { input: { s: "axc", t: "ahbgdc" }, explanation: "There is no 'x' in t." },
    { input: { s: "", t: "abc" }, explanation: "The empty string is a subsequence of every string." },
  ],
  constraints: ["0 <= s.length <= 100", "0 <= t.length <= 10^4", "s and t consist of lowercase English letters."],
  followUp: "If there are lots of strings s to check against the same t, how would you speed things up?",
  harness: { fn: "isSubsequence", params: { s: "string", t: "string" }, returns: "bool" },
  tests: [
    { s: "", t: "" },
    { s: "a", t: "" },
    { s: "a", t: "a" },
    { s: "b", t: "abc" },
    { s: "abc", t: "abc" },
    { s: "abcd", t: "abc" },
    { s: "aaa", t: "aa" },
    { s: "aaa", t: "baaab" },
    { s: "ace", t: "abcde" },
    { s: "aec", t: "abcde" },
    { s: "acb", t: "ahbgdc" },
    { s: "bb", t: "ahbgdc" },
    { s: sub.slice(0, 100), t: big },
    { s: sub.slice(0, 99) + "z", t: big },
  ],
  answer: {
    approach: [
      "Walk through t with one pointer and keep a second pointer i into s.",
      "Whenever t's current character equals s[i], move i forward: that character of s has been matched.",
      "If i reaches the end of s, every character was found in order.",
      "For many queries against the same t, store the positions of each letter in t and binary-search the next position.",
    ],
    time: "O(|t|)",
    space: "O(1)",
    javascript: `function isSubsequence(s, t) {
    let i = 0;
    for (let j = 0; j < t.length && i < s.length; j++) {
        if (s[i] === t[j]) i++;
    }
    return i === s.length;
}`,
    python: `class Solution:
    def isSubsequence(self, s: str, t: str) -> bool:
        i = 0
        for c in t:
            if i < len(s) and s[i] == c:
                i += 1
        return i == len(s)`,
  },
};
