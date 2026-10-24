import { rng, randInt, str } from "../gen.js";

function big(n, seed) {
  const r = rng(seed);
  const words = Array.from({ length: n }, (_, i) => str(randInt(r, 1, 6), "abcXYZ123", seed * 100000 + i));
  return { s: "  " + words.map((w) => w + " ".repeat(randInt(r, 1, 3))).join("") };
}

export default {
  slug: "reverse-words-in-a-string",
  description: `Given a string \`s\`, reverse the **order of the words**.

A word is a run of non-space characters. Words in \`s\` are separated by at least one space, and \`s\` may have leading or trailing spaces or several spaces between words.

Return the words in reverse order, joined by **exactly one space**, with no leading or trailing spaces.`,
  examples: [
    { input: { s: "the sky is blue" }, explanation: "The four words come out in reverse order." },
    { input: { s: "  hello world  " }, explanation: "Leading and trailing spaces are dropped." },
    { input: { s: "a good   example" }, explanation: "The run of spaces collapses to a single space." },
  ],
  constraints: ["1 <= s.length <= 10^4", "s contains English letters, digits and spaces ' '.", "There is at least one word in s."],
  followUp: "If strings were mutable in your language, could you do it in place with O(1) extra space?",
  harness: { fn: "reverseWords", params: { s: "string" }, returns: "string" },
  tests: [
    { s: "a" },
    { s: "   a   " },
    { s: "ab cd" },
    { s: "one two three" },
    { s: "  Bob    Loves  Alice   " },
    { s: "Alice does not even like bob" },
    { s: "x  y  z" },
    { s: "123 456 789" },
    { s: "EPY2giL" },
    { s: "  F R  I E   N D S      " },
    { s: "hello" },
    { s: "a b c d e f g" },
    big(2000, 1),
    big(2500, 2),
  ],
  answer: {
    approach: [
      "Split the string on runs of whitespace, ignoring empty pieces caused by extra spaces.",
      "Reverse the list of words.",
      "Join them with a single space.",
      "In place version: reverse the whole string, then reverse each word, then squeeze out extra spaces.",
    ],
    time: "O(n)",
    space: "O(n)",
    javascript: `function reverseWords(s) {
    return s.trim().split(/\\s+/).reverse().join(" ");
}`,
    python: `class Solution:
    def reverseWords(self, s: str) -> str:
        return ' '.join(reversed(s.split()))`,
  },
};
