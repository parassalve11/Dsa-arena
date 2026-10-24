import { str } from "../gen.js";

const a = str(50000, "abcdefghij", 12);
const map = { a: "q", b: "w", c: "e", d: "r", e: "t", f: "y", g: "u", h: "i", i: "o", j: "p" };
const b = [...a].map((c) => map[c]).join("");
const bBad = b.slice(0, 49999) + (b[49999] === "q" ? "w" : "q");

export default {
  slug: "isomorphic-strings",
  description: `Two strings \`s\` and \`t\` are **isomorphic** if the characters in \`s\` can be replaced to get \`t\`.

The replacement must be consistent: every occurrence of a character is replaced by the same character, and **no two different characters may map to the same character**. A character may map to itself.

Return \`true\` if \`s\` and \`t\` are isomorphic.`,
  examples: [
    { input: { s: "egg", t: "add" }, explanation: "e → a and g → d works for every position." },
    { input: { s: "foo", t: "bar" }, explanation: "o would have to map to both a and r." },
    { input: { s: "paper", t: "title" }, explanation: "p → t, a → i, e → l, r → e." },
  ],
  constraints: ["1 <= s.length <= 5 * 10^4", "t.length == s.length", "s and t consist of any valid ASCII characters."],
  harness: { fn: "isIsomorphic", params: { s: "string", t: "string" }, returns: "bool" },
  tests: [
    { s: "a", t: "a" },
    { s: "a", t: "b" },
    { s: "ab", t: "aa" },
    { s: "aa", t: "ab" },
    { s: "badc", t: "baba" },
    { s: "abc", t: "cba" },
    { s: "13", t: "42" },
    { s: "ab", t: "ca" },
    { s: "aaaa", t: "zzzz" },
    { s: "abab", t: "baba" },
    { s: "abba", t: "abab" },
    { s: "!@#!", t: "xyzx" },
    { s: a, t: b },
    { s: a, t: bBad },
  ],
  answer: {
    approach: [
      "Keep two maps: s-char → t-char and t-char → s-char.",
      "For each position, if s[i] is already mapped it must map to t[i], and if t[i] is already mapped it must map back to s[i].",
      "Any conflict means the strings are not isomorphic. Otherwise record both directions.",
      "Checking both directions is what stops two characters from mapping to the same one.",
    ],
    time: "O(n)",
    space: "O(k), where k is the alphabet size",
    javascript: `function isIsomorphic(s, t) {
    const st = new Map(), ts = new Map();
    for (let i = 0; i < s.length; i++) {
        const a = s[i], b = t[i];
        if ((st.has(a) && st.get(a) !== b) || (ts.has(b) && ts.get(b) !== a)) return false;
        st.set(a, b);
        ts.set(b, a);
    }
    return true;
}`,
    python: `class Solution:
    def isIsomorphic(self, s: str, t: str) -> bool:
        st, ts = {}, {}
        for a, b in zip(s, t):
            if st.get(a, b) != b or ts.get(b, a) != a:
                return False
            st[a] = b
            ts[b] = a
        return True`,
  },
};
