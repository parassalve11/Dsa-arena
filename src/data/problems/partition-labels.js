import { str } from "../gen.js";

export default {
  slug: "partition-labels",
  description: `You are given a string \`s\`. Split it into **as many parts as possible** so that **each letter appears in at most one part**.

Joined back together in order, the parts must give \`s\`. Return a list with the **size** of each part, in order.`,
  examples: [
    { input: { s: "ababcbacadefegdehijhklij" }, explanation: "The parts are \"ababcbaca\", \"defegde\" and \"hijhklij\": sizes 9, 7 and 8." },
    { input: { s: "eccbbbbdec" }, explanation: "Every letter is tied together, so the whole string is one part." },
    { input: { s: "abc" }, explanation: "Each letter can be its own part." },
  ],
  constraints: ["1 <= s.length <= 500", "s consists of lowercase English letters."],
  harness: { fn: "partitionLabels", params: { s: "string" }, returns: "int[]" },
  tests: [
    { s: "a" },
    { s: "aa" },
    { s: "ab" },
    { s: "aba" },
    { s: "abab" },
    { s: "caedbdedda" },
    { s: "qiejxqfnqceocmy" },
    { s: "vhaagbqkaq" },
    { s: "abcdefghijklmnopqrstuvwxyz" },
    { s: "zzzzyyyyxxxx" },
    { s: "abcabcxyzxyz" },
    { s: "aebbedaddc" },
    { s: str(500, "abcdefghijklmnopqrstuvwxyz", 1) },
    { s: [..."abcdefghijklmnopqrstuvwxy"].map((c) => c.repeat(20)).join("") },
  ],
  answer: {
    approach: [
      "Record the last index where each letter appears.",
      "Scan the string, extending the current part's end to the last occurrence of every letter you see.",
      "When the scan index reaches the current end, every letter inside the part has no copies later, so close the part and record its size.",
      "Start the next part at the following index.",
    ],
    time: "O(n)",
    space: "O(1), 26 last positions",
    javascript: `function partitionLabels(s) {
    const last = {};
    for (let i = 0; i < s.length; i++) last[s[i]] = i;
    const out = [];
    let start = 0, end = 0;
    for (let i = 0; i < s.length; i++) {
        end = Math.max(end, last[s[i]]);
        if (i === end) {
            out.push(end - start + 1);
            start = i + 1;
        }
    }
    return out;
}`,
    python: `class Solution:
    def partitionLabels(self, s: str) -> List[int]:
        last = {c: i for i, c in enumerate(s)}
        out = []
        start = end = 0
        for i, c in enumerate(s):
            end = max(end, last[c])
            if i == end:
                out.append(end - start + 1)
                start = i + 1
        return out`,
  },
};
