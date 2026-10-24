export default {
  slug: "word-break",
  description: `Given a string \`s\` and a dictionary of words \`wordDict\`, return \`true\` if \`s\` can be split into a sequence of **one or more dictionary words** placed back to back.

The same dictionary word may be used many times.`,
  examples: [
    { input: { s: "leetcode", wordDict: ["leet", "code"] }, explanation: "\"leet\" + \"code\"." },
    { input: { s: "applepenapple", wordDict: ["apple", "pen"] }, explanation: "\"apple\" + \"pen\" + \"apple\". Words can be reused." },
    { input: { s: "catsandog", wordDict: ["cats", "dog", "sand", "and", "cat"] }, explanation: "Every split leaves some piece that isn't a word." },
  ],
  constraints: ["1 <= s.length <= 300", "1 <= wordDict.length <= 1000", "1 <= wordDict[i].length <= 20", "All words are lowercase and unique."],
  harness: { fn: "wordBreak", params: { s: "string", wordDict: "string[]" }, returns: "bool" },
  tests: [
    { s: "a", wordDict: ["a"] },
    { s: "a", wordDict: ["b"] },
    { s: "ab", wordDict: ["a", "b"] },
    { s: "cars", wordDict: ["car", "ca", "rs"] },
    { s: "aaaaaaa", wordDict: ["aaaa", "aaa"] },
    { s: "goalspecial", wordDict: ["go", "goal", "goals", "special"] },
    { s: "bb", wordDict: ["a", "b", "bbb", "bbbb"] },
    { s: "catsanddog", wordDict: ["cat", "cats", "and", "sand", "dog"] },
    { s: "abcd", wordDict: ["a", "abc", "b", "cd"] },
    { s: "dogs", wordDict: ["dog", "s", "gs"] },
    { s: "pineapplepenapple", wordDict: ["apple", "pen", "applepen", "pine", "pineapple"] },
    { s: "aebbbbs", wordDict: ["a", "aeb", "ebbbb", "s", "eb"] },
    { s: "a".repeat(150) + "b", wordDict: ["a", "aa", "aaa", "aaaa", "aaaaa", "aaaaaa", "aaaaaaa", "aaaaaaaa", "aaaaaaaaa", "aaaaaaaaaa"] },
    { s: "a".repeat(300), wordDict: ["a", "aa", "aaa", "aaaa", "aaaaa", "aaaaaa", "aaaaaaa", "aaaaaaaa", "aaaaaaaaa", "aaaaaaaaaa"] },
  ],
  answer: {
    approach: [
      "Let dp[i] be true if the first i characters of s can be split into words. dp[0] = true (the empty prefix).",
      "For each i, look at every word w: if s ends with w at position i (s[i - len(w) .. i] == w) and dp[i - len(w)] is true, then dp[i] is true.",
      "The answer is dp[n].",
      "Plain recursion without memoisation is exponential on inputs like \"aaaa…ab\".",
    ],
    time: "O(n · W · L), where W is the number of words and L their length",
    space: "O(n)",
    javascript: `function wordBreak(s, wordDict) {
    const dp = new Array(s.length + 1).fill(false);
    dp[0] = true;
    for (let i = 1; i <= s.length; i++) {
        for (const w of wordDict) {
            if (w.length <= i && dp[i - w.length] && s.startsWith(w, i - w.length)) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[s.length];
}`,
    python: `class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        words = set(wordDict)
        lengths = {len(w) for w in words}
        dp = [True] + [False] * len(s)
        for i in range(1, len(s) + 1):
            dp[i] = any(L <= i and dp[i - L] and s[i - L:i] in words for L in lengths)
        return dp[len(s)]`,
  },
};
