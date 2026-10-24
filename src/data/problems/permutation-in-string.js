import { shuffle, str } from "../gen.js";

const hay = str(10000, "abcdefghij", 3);
const needle = shuffle([...hay.slice(7000, 7500)], 4).join("");

export default {
  slug: "permutation-in-string",
  description: `Given two strings \`s1\` and \`s2\`, return \`true\` if \`s2\` contains a **permutation** of \`s1\` as a substring, or \`false\` otherwise.

In other words, return \`true\` if some contiguous block of \`s2\` uses exactly the same letters as \`s1\`, the same number of times.`,
  examples: [
    { input: { s1: "ab", s2: "eidbaooo" }, explanation: "s2 contains \"ba\", which is a permutation of \"ab\"." },
    { input: { s1: "ab", s2: "eidboaoo" }, explanation: "No two adjacent characters of s2 are an a and a b." },
    { input: { s1: "adc", s2: "dcda" }, explanation: "\"cda\" is a permutation of \"adc\"." },
  ],
  constraints: ["1 <= s1.length, s2.length <= 10^4", "s1 and s2 consist of lowercase English letters."],
  harness: { fn: "checkInclusion", params: { s1: "string", s2: "string" }, returns: "bool" },
  tests: [
    { s1: "a", s2: "a" },
    { s1: "a", s2: "b" },
    { s1: "ab", s2: "a" },
    { s1: "abc", s2: "bbbca" },
    { s1: "hello", s2: "ooolleoooleh" },
    { s1: "abc", s2: "ccccbbbbaaaa" },
    { s1: "aa", s2: "baab" },
    { s1: "xyz", s2: "zyx" },
    { s1: "abcd", s2: "dcbaxyz" },
    { s1: "trinitrophenylmethylnitramine", s2: "dinitrophenylhydrazinetrinitrophenylmethylnitramine" },
    { s1: "ab", s2: "aaaaaaab" },
    { s1: "aab", s2: "abab" },
    { s1: needle, s2: hay },
    { s1: needle + "k", s2: hay },
  ],
  answer: {
    approach: [
      "A permutation of s1 has the same letter counts as s1, so compare letter counts.",
      "Slide a window of length |s1| across s2, keeping its 26 letter counts up to date: add the new character, remove the one that falls out.",
      "Track how many of the 26 letters currently have matching counts so each check is O(1).",
      "If all 26 match at any point, return true.",
    ],
    time: "O(|s1| + |s2|)",
    space: "O(1)",
    javascript: `function checkInclusion(s1, s2) {
    if (s1.length > s2.length) return false;
    const need = new Array(26).fill(0), win = new Array(26).fill(0);
    for (let i = 0; i < s1.length; i++) {
        need[s1.charCodeAt(i) - 97]++;
        win[s2.charCodeAt(i) - 97]++;
    }
    let matches = 0;
    for (let i = 0; i < 26; i++) if (need[i] === win[i]) matches++;
    for (let r = s1.length; r < s2.length; r++) {
        if (matches === 26) return true;
        const add = s2.charCodeAt(r) - 97, rem = s2.charCodeAt(r - s1.length) - 97;
        win[add]++;
        if (win[add] === need[add]) matches++;
        else if (win[add] === need[add] + 1) matches--;
        win[rem]--;
        if (win[rem] === need[rem]) matches++;
        else if (win[rem] === need[rem] - 1) matches--;
    }
    return matches === 26;
}`,
    python: `class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        n = len(s1)
        if n > len(s2):
            return False
        need = Counter(s1)
        window = Counter(s2[:n])
        if window == need:
            return True
        for r in range(n, len(s2)):
            window[s2[r]] += 1
            window[s2[r - n]] -= 1
            if window[s2[r - n]] == 0:
                del window[s2[r - n]]
            if window == need:
                return True
        return False`,
  },
};
