import { str } from "../gen.js";

const prefix = str(150, "ab", 5);
const many = Array.from({ length: 200 }, (_, i) => prefix + str(50, "abc", 100 + i));

export default {
  slug: "longest-common-prefix",
  description: `Write a function that finds the **longest common prefix** shared by all strings in the array \`strs\`.

If the strings have no common prefix, return an empty string \`""\`.`,
  examples: [
    { input: { strs: ["flower", "flow", "flight"] }, explanation: "All three start with \"fl\"." },
    { input: { strs: ["dog", "racecar", "car"] }, explanation: "The first letters already differ, so the answer is \"\"." },
    { input: { strs: ["interview", "internet", "interval"] }, explanation: "All three start with \"inter\"." },
  ],
  constraints: ["1 <= strs.length <= 200", "0 <= strs[i].length <= 200", "strs[i] consists of lowercase English letters."],
  harness: { fn: "longestCommonPrefix", params: { strs: "string[]" }, returns: "string" },
  tests: [
    { strs: ["a"] },
    { strs: [""] },
    { strs: ["", "b"] },
    { strs: ["a", "a", "a"] },
    { strs: ["ab", "a"] },
    { strs: ["abc", "abd", "abe"] },
    { strs: ["prefix", "prefixes", "prefixation"] },
    { strs: ["c", "acc", "ccc"] },
    { strs: ["aaa", "aa", "aaaa"] },
    { strs: ["reflower", "flow", "flight"] },
    { strs: ["same", "same"] },
    { strs: ["abab", "aba", ""] },
    { strs: many },
    { strs: [...many, prefix.slice(0, 77)] },
  ],
  answer: {
    approach: [
      "Take the first string as a candidate prefix.",
      "Compare it with each other string, and shorten the candidate until that string starts with it.",
      "If the candidate becomes empty, stop early: there is no common prefix.",
      "(Another option: compare characters column by column across all strings.)",
    ],
    time: "O(S), where S is the total number of characters",
    space: "O(1)",
    javascript: `function longestCommonPrefix(strs) {
    let prefix = strs[0];
    for (const s of strs) {
        while (!s.startsWith(prefix)) prefix = prefix.slice(0, -1);
        if (!prefix) return "";
    }
    return prefix;
}`,
    python: `class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        prefix = strs[0]
        for s in strs:
            while not s.startswith(prefix):
                prefix = prefix[:-1]
            if not prefix:
                return ""
        return prefix`,
  },
};
