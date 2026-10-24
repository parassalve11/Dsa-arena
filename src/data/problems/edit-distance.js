import { str } from "../gen.js";

export default {
  slug: "edit-distance",
  description: `Given two strings \`word1\` and \`word2\`, return the **minimum number of operations** needed to turn \`word1\` into \`word2\`.

You may use three operations, each costing 1:

- **Insert** a character
- **Delete** a character
- **Replace** a character`,
  examples: [
    { input: { word1: "horse", word2: "ros" }, explanation: "horse → rorse (replace h with r) → rose (delete r) → ros (delete e): 3 operations." },
    { input: { word1: "intention", word2: "execution" }, explanation: "5 operations are needed." },
    { input: { word1: "", word2: "abc" }, explanation: "Insert all three characters." },
  ],
  constraints: ["0 <= word1.length, word2.length <= 500", "Both words consist of lowercase English letters."],
  harness: { fn: "minDistance", params: { word1: "string", word2: "string" }, returns: "int" },
  tests: [
    { word1: "", word2: "" },
    { word1: "a", word2: "" },
    { word1: "a", word2: "a" },
    { word1: "a", word2: "b" },
    { word1: "ab", word2: "ba" },
    { word1: "kitten", word2: "sitting" },
    { word1: "sunday", word2: "saturday" },
    { word1: "abc", word2: "yabd" },
    { word1: "zoologicoarchaeologist", word2: "zoogeologist" },
    { word1: "plasma", word2: "altruism" },
    { word1: "dinitrophenylhydrazine", word2: "benzalphenylhydrazone" },
    { word1: "aaaaa", word2: "bbbbb" },
    { word1: str(500, "abcde", 1), word2: str(500, "abcde", 2) },
    { word1: str(500, "abcdefghijklmnopqrstuvwxyz", 3), word2: "" },
    { word1: str(450, "ab", 4), word2: str(500, "ab", 5) },
  ],
  answer: {
    approach: [
      "Let dp[i][j] be the edit distance between the first i letters of word1 and the first j letters of word2.",
      "Base cases: dp[i][0] = i (delete everything) and dp[0][j] = j (insert everything).",
      "If word1[i-1] == word2[j-1], no operation is needed: dp[i][j] = dp[i-1][j-1].",
      "Otherwise dp[i][j] = 1 + min(dp[i-1][j] (delete), dp[i][j-1] (insert), dp[i-1][j-1] (replace)). The answer is dp[m][n].",
    ],
    time: "O(m · n)",
    space: "O(n) with a rolling row",
    javascript: `function minDistance(word1, word2) {
    const m = word1.length, n = word2.length;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
        const cur = [i];
        for (let j = 1; j <= n; j++) {
            cur[j] = word1[i - 1] === word2[j - 1]
                ? prev[j - 1]
                : 1 + Math.min(prev[j], cur[j - 1], prev[j - 1]);
        }
        prev = cur;
    }
    return prev[n];
}`,
    python: `class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        n = len(word2)
        prev = list(range(n + 1))
        for i, a in enumerate(word1, 1):
            cur = [i] + [0] * n
            for j in range(1, n + 1):
                if a == word2[j - 1]:
                    cur[j] = prev[j - 1]
                else:
                    cur[j] = 1 + min(prev[j], cur[j - 1], prev[j - 1])
            prev = cur
        return prev[n]`,
  },
};
