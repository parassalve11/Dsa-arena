import { str } from "../gen.js";

export default {
  slug: "longest-common-subsequence",
  description: `Given two strings \`text1\` and \`text2\`, return the length of their **longest common subsequence**, or \`0\` if they have none.

A subsequence keeps the original order of characters but may skip some. For example, \`"ace"\` is a subsequence of \`"abcde"\`. A common subsequence is one that appears in both strings.`,
  examples: [
    { input: { text1: "abcde", text2: "ace" }, explanation: "\"ace\" appears in both, length 3." },
    { input: { text1: "abc", text2: "abc" }, explanation: "The whole string is common." },
    { input: { text1: "abc", text2: "def" }, explanation: "No characters in common." },
  ],
  constraints: ["1 <= text1.length, text2.length <= 1000", "Both strings consist of lowercase English letters."],
  harness: { fn: "longestCommonSubsequence", params: { text1: "string", text2: "string" }, returns: "int" },
  tests: [
    { text1: "a", text2: "a" },
    { text1: "a", text2: "b" },
    { text1: "ab", text2: "ba" },
    { text1: "bsbininm", text2: "jmjkbkjkv" },
    { text1: "oxcpqrsvwf", text2: "shmtulqrypy" },
    { text1: "ezupkr", text2: "ubmrapg" },
    { text1: "aaaa", text2: "aa" },
    { text1: "abcba", text2: "abcbcba" },
    { text1: "pmjghexybyrgzczy", text2: "hafcdqbgncrcbihkd" },
    { text1: "xyz", text2: "zyx" },
    { text1: "aggtab", text2: "gxtxayb" },
    { text1: "mhunuzqrkzsnidwbun", text2: "szulspmhwpazoxijwbq" },
    { text1: str(1000, "abcd", 1), text2: str(1000, "abcd", 2) },
    { text1: str(1000, "abcdefghijklmnopqrstuvwxyz", 3), text2: str(1000, "abcdefghijklmnopqrstuvwxyz", 4) },
  ],
  answer: {
    approach: [
      "Let dp[i][j] be the LCS length of the first i characters of text1 and the first j characters of text2.",
      "If text1[i-1] == text2[j-1], that character extends the common subsequence: dp[i][j] = dp[i-1][j-1] + 1.",
      "Otherwise drop a character from one of the strings: dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
      "The answer is dp[m][n]. Only the previous row is needed, so space can be O(n).",
    ],
    time: "O(m · n)",
    space: "O(n)",
    javascript: `function longestCommonSubsequence(text1, text2) {
    const n = text2.length;
    let prev = new Array(n + 1).fill(0);
    for (let i = 1; i <= text1.length; i++) {
        const cur = new Array(n + 1).fill(0);
        for (let j = 1; j <= n; j++) {
            cur[j] = text1[i - 1] === text2[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
        }
        prev = cur;
    }
    return prev[n];
}`,
    python: `class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        n = len(text2)
        prev = [0] * (n + 1)
        for a in text1:
            cur = [0] * (n + 1)
            for j in range(1, n + 1):
                if a == text2[j - 1]:
                    cur[j] = prev[j - 1] + 1
                else:
                    cur[j] = prev[j] if prev[j] > cur[j - 1] else cur[j - 1]
            prev = cur
        return prev[n]`,
  },
};
