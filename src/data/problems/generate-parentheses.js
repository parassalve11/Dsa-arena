export default {
  slug: "generate-parentheses",
  description: `Given \`n\` pairs of parentheses, return **all combinations of well-formed parentheses**.

Well-formed means every \`(\` has a matching \`)\` after it, and no \`)\` appears before its matching \`(\`. Return the strings in **any order**.`,
  examples: [
    { input: { n: 3 }, explanation: "The five strings are ((())), (()()), (())(), ()(()) and ()()()." },
    { input: { n: 1 }, explanation: "Only \"()\"." },
    { input: { n: 2 }, explanation: "\"(())\" and \"()()\"." },
  ],
  constraints: ["1 <= n <= 8"],
  harness: { fn: "generateParenthesis", params: { n: "int" }, returns: "string[]", compare: "unordered" },
  tests: [
    { n: 4 },
    { n: 5 },
    { n: 6 },
    { n: 7 },
    { n: 8 },
    { n: 1 },
    { n: 2 },
    { n: 3 },
    { n: 4 },
    { n: 5 },
    { n: 6 },
    { n: 8 },
  ],
  answer: {
    approach: [
      "Build the string one character at a time, keeping counts of open and close brackets used so far.",
      "You may add '(' while open < n.",
      "You may add ')' only while close < open, so the string never becomes invalid.",
      "When the string has length 2n, record it. Only valid strings are ever built, so no checking is needed.",
    ],
    time: "O(4^n / √n), the Catalan number of results",
    space: "O(n) for the recursion",
    javascript: `function generateParenthesis(n) {
    const out = [];
    const backtrack = (cur, open, close) => {
        if (cur.length === 2 * n) {
            out.push(cur);
            return;
        }
        if (open < n) backtrack(cur + "(", open + 1, close);
        if (close < open) backtrack(cur + ")", open, close + 1);
    };
    backtrack("", 0, 0);
    return out;
}`,
    python: `class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        out = []

        def backtrack(cur, open_, close):
            if len(cur) == 2 * n:
                out.append(cur)
                return
            if open_ < n:
                backtrack(cur + '(', open_ + 1, close)
            if close < open_:
                backtrack(cur + ')', open_, close + 1)

        backtrack('', 0, 0)
        return out`,
  },
};
