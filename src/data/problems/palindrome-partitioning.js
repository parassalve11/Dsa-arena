export default {
  slug: "palindrome-partitioning",
  description: `Given a string \`s\`, split it into pieces so that **every piece is a palindrome**. Return **all possible** such splits.

Each split is a list of substrings that, joined together, give back \`s\`. Return the splits in **any order** (the pieces inside a split stay in left-to-right order).`,
  examples: [
    { input: { s: "aab" }, explanation: "[\"a\",\"a\",\"b\"] and [\"aa\",\"b\"]." },
    { input: { s: "a" }, explanation: "Only one split." },
    { input: { s: "aba" }, explanation: "[\"a\",\"b\",\"a\"] and [\"aba\"]." },
  ],
  constraints: ["1 <= s.length <= 16", "s contains only lowercase English letters."],
  harness: { fn: "partition", params: { s: "string" }, returns: "string[][]", compare: "unordered" },
  tests: [
    { s: "b" },
    { s: "ab" },
    { s: "aa" },
    { s: "abc" },
    { s: "aaa" },
    { s: "abba" },
    { s: "racecar" },
    { s: "efe" },
    { s: "cdd" },
    { s: "abacaba" },
    { s: "noonabbad" },
    { s: "xyzzyx" },
    { s: "aaaaaaaaaaaaaaaa" },
    { s: "ababababababababa".slice(0, 16) },
  ],
  answer: {
    approach: [
      "Backtrack over the cut positions: from index start, try every end index where s[start..end] is a palindrome.",
      "For each palindromic piece, add it to the current split and recurse from end + 1.",
      "When start reaches the end of the string, record a copy of the split.",
      "Precomputing a table isPal[i][j] with DP avoids rechecking the same substrings.",
    ],
    time: "O(n · 2^n)",
    space: "O(n²) for the palindrome table",
    javascript: `function partition(s) {
    const n = s.length;
    const isPal = Array.from({ length: n }, () => new Array(n).fill(false));
    for (let i = n - 1; i >= 0; i--)
        for (let j = i; j < n; j++)
            isPal[i][j] = s[i] === s[j] && (j - i < 2 || isPal[i + 1][j - 1]);
    const out = [], cur = [];
    const backtrack = (start) => {
        if (start === n) {
            out.push(cur.slice());
            return;
        }
        for (let end = start; end < n; end++) {
            if (!isPal[start][end]) continue;
            cur.push(s.slice(start, end + 1));
            backtrack(end + 1);
            cur.pop();
        }
    };
    backtrack(0);
    return out;
}`,
    python: `class Solution:
    def partition(self, s: str) -> List[List[str]]:
        out = []

        def backtrack(start, cur):
            if start == len(s):
                out.append(cur[:])
                return
            for end in range(start + 1, len(s) + 1):
                piece = s[start:end]
                if piece == piece[::-1]:
                    cur.append(piece)
                    backtrack(end, cur)
                    cur.pop()

        backtrack(0, [])
        return out`,
  },
};
