export default {
  slug: "regular-expression-matching",
  description: `Implement regular expression matching between an input string \`s\` and a pattern \`p\`, supporting two special characters:

- \`'.'\` matches **any single character**.
- \`'*'\` matches **zero or more** of the character right before it.

The match must cover the **entire** string \`s\`, not just part of it.`,
  examples: [
    { input: { s: "aa", p: "a" }, explanation: "\"a\" matches only one character, not the whole string." },
    { input: { s: "aa", p: "a*" }, explanation: "'*' repeats 'a' twice." },
    { input: { s: "ab", p: ".*" }, explanation: "\".*\" means any character, any number of times." },
  ],
  constraints: ["1 <= s.length <= 20", "1 <= p.length <= 20", "s has only lowercase letters.", "p has only lowercase letters, '.' and '*'.", "Every '*' has a valid character before it."],
  harness: { fn: "isMatch", params: { s: "string", p: "string" }, returns: "bool" },
  tests: [
    { s: "a", p: "a" },
    { s: "a", p: "." },
    { s: "a", p: "b" },
    { s: "aab", p: "c*a*b" },
    { s: "mississippi", p: "mis*is*p*." },
    { s: "mississippi", p: "mis*is*ip*." },
    { s: "ab", p: ".*c" },
    { s: "aaa", p: "a*a" },
    { s: "aaa", p: "ab*a*c*a" },
    { s: "a", p: "ab*" },
    { s: "bbbba", p: ".*a*a" },
    { s: "abcd", p: "d*" },
    { s: "aaaaaaaaaaaaaaaaaaab", p: "a*a*a*a*a*a*a*a*a*b" },
    { s: "aaaaaaaaaaaaaaaaaaaa", p: "a*a*a*a*a*a*a*a*a*c" },
    { s: "abcdefghijklmnopqrst", p: ".*.*.*.*.*.*.*.*.*.*" },
  ],
  answer: {
    approach: [
      "Let dp[i][j] be true if s[i:] matches p[j:]. Fill it from the end backwards. dp[len(s)][len(p)] = true.",
      "first = (i < len(s)) and (p[j] == s[i] or p[j] == '.').",
      "If p[j + 1] is '*', either skip 'x*' entirely (dp[i][j + 2]) or, if first matches, use it once more and stay on the same pattern (dp[i + 1][j]).",
      "Otherwise dp[i][j] = first and dp[i + 1][j + 1]. The answer is dp[0][0]. Memoisation avoids the exponential blow-up of plain recursion.",
    ],
    time: "O(m · n)",
    space: "O(m · n)",
    javascript: `function isMatch(s, p) {
    const m = s.length, n = p.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
    dp[m][n] = true;
    for (let i = m; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            const first = i < m && (p[j] === s[i] || p[j] === ".");
            if (j + 1 < n && p[j + 1] === "*") {
                dp[i][j] = dp[i][j + 2] || (first && dp[i + 1][j]);
            } else {
                dp[i][j] = first && dp[i + 1][j + 1];
            }
        }
    }
    return dp[0][0];
}`,
    python: `class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        @lru_cache(maxsize=None)
        def dp(i, j):
            if j == len(p):
                return i == len(s)
            first = i < len(s) and p[j] in (s[i], '.')
            if j + 1 < len(p) and p[j + 1] == '*':
                return dp(i, j + 2) or (first and dp(i + 1, j))
            return first and dp(i + 1, j + 1)
        return dp(0, 0)`,
  },
};
