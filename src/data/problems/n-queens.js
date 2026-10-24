export default {
  slug: "n-queens",
  description: `The **n-queens** puzzle asks you to place \`n\` queens on an \`n x n\` chessboard so that **no two queens attack each other**: no two share a row, a column or a diagonal.

Given \`n\`, return **all distinct solutions**. Each solution is a board written as \`n\` strings, where \`'Q'\` is a queen and \`'.'\` is an empty square. Return the solutions in **any order**.`,
  examples: [
    { input: { n: 4 }, explanation: "There are exactly two ways to place 4 queens." },
    { input: { n: 1 }, explanation: "One queen on a 1x1 board." },
    { input: { n: 2 }, explanation: "Two queens on a 2x2 board always attack each other, so there are no solutions." },
  ],
  constraints: ["1 <= n <= 9"],
  harness: { fn: "solveNQueens", params: { n: "int" }, returns: "string[][]", compare: "unordered" },
  tests: [
    { n: 3 },
    { n: 5 },
    { n: 6 },
    { n: 7 },
    { n: 8 },
    { n: 9 },
    { n: 1 },
    { n: 2 },
    { n: 4 },
    { n: 5 },
    { n: 6 },
    { n: 9 },
  ],
  answer: {
    approach: [
      "Place one queen per row, row by row, with backtracking.",
      "Keep three sets of attacked lines: columns, '\\' diagonals (row - col is constant) and '/' diagonals (row + col is constant).",
      "In row r, try each column c that is not attacked. Place the queen, mark its column and diagonals, recurse to row r + 1, then unmark.",
      "When all n rows have a queen, convert the column positions into board strings and record them.",
    ],
    time: "O(n!)",
    space: "O(n)",
    javascript: `function solveNQueens(n) {
    const out = [], cols = new Set(), d1 = new Set(), d2 = new Set(), pos = [];
    const backtrack = (r) => {
        if (r === n) {
            out.push(pos.map((c) => ".".repeat(c) + "Q" + ".".repeat(n - c - 1)));
            return;
        }
        for (let c = 0; c < n; c++) {
            if (cols.has(c) || d1.has(r - c) || d2.has(r + c)) continue;
            cols.add(c); d1.add(r - c); d2.add(r + c); pos.push(c);
            backtrack(r + 1);
            cols.delete(c); d1.delete(r - c); d2.delete(r + c); pos.pop();
        }
    };
    backtrack(0);
    return out;
}`,
    python: `class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        out, pos = [], []
        cols, d1, d2 = set(), set(), set()

        def backtrack(r):
            if r == n:
                out.append(['.' * c + 'Q' + '.' * (n - c - 1) for c in pos])
                return
            for c in range(n):
                if c in cols or (r - c) in d1 or (r + c) in d2:
                    continue
                cols.add(c); d1.add(r - c); d2.add(r + c); pos.append(c)
                backtrack(r + 1)
                cols.remove(c); d1.remove(r - c); d2.remove(r + c); pos.pop()

        backtrack(0)
        return out`,
  },
};
