import { rng, randInt, str } from "../gen.js";

function big(n, seed) {
  const r = rng(seed);
  const roots = Array.from({ length: 400 }, (_, i) => str(randInt(r, 1, 8), "abcdefg", seed * 1000 + i));
  return {
    strs: Array.from({ length: n }, () => {
      const w = [...roots[randInt(r, 0, roots.length - 1)]];
      for (let i = w.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        [w[i], w[j]] = [w[j], w[i]];
      }
      return w.join("");
    }),
  };
}

export default {
  slug: "group-anagrams",
  description: `Given an array of strings \`strs\`, group the **anagrams** together.

Two words are anagrams if they use exactly the same letters the same number of times. Return the groups in **any order**, and the words inside each group in any order too.`,
  examples: [
    { input: { strs: ["eat", "tea", "tan", "ate", "nat", "bat"] }, explanation: "eat/tea/ate share letters, tan/nat share letters, and bat is on its own." },
    { input: { strs: [""] }, explanation: "One group containing the empty string." },
    { input: { strs: ["a"] }, explanation: "One group with a single word." },
  ],
  constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] consists of lowercase English letters."],
  harness: { fn: "groupAnagrams", params: { strs: "string[]" }, returns: "string[][]", compare: "unorderedNested" },
  tests: [
    { strs: ["", ""] },
    { strs: ["", "b"] },
    { strs: ["abc", "bca", "cab"] },
    { strs: ["abc", "def", "ghi"] },
    { strs: ["aab", "aba", "baa", "abb"] },
    { strs: ["a", "a", "a"] },
    { strs: ["ab", "ba", "abc", "cba", "bac", "a"] },
    { strs: ["listen", "silent", "enlist", "google", "gooegl"] },
    { strs: ["ddddddddddg", "dgggggggggg"] },
    { strs: ["tin", "ram", "zip", "cry", "pus", "jon", "zip", "pyx"] },
    { strs: ["hhhhu", "tttti", "tttit", "hhhuh", "hhuhh", "tittt"] },
    { strs: ["bdddddddddd", "bbbbbbbbbbc"] },
    big(10000, 1),
    big(10000, 2),
  ],
  answer: {
    approach: [
      "Anagrams become identical once their letters are sorted, so the sorted word works as a group key.",
      "Use a hash map from key to the list of words with that key.",
      "For each word, compute its key and append the word to that list.",
      "Return all the lists. (A 26-letter count string also works as a key and avoids sorting.)",
    ],
    time: "O(n · k log k), where k is the longest word",
    space: "O(n · k)",
    javascript: `function groupAnagrams(strs) {
    const groups = new Map();
    for (const s of strs) {
        const key = [...s].sort().join("");
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(s);
    }
    return [...groups.values()];
}`,
    python: `class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        groups = defaultdict(list)
        for s in strs:
            groups[''.join(sorted(s))].append(s)
        return list(groups.values())`,
  },
};
