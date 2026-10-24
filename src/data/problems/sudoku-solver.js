import { rng, shuffle } from "../gen.js";

// A valid solved grid, then shuffled (digits relabelled, rows and columns
// swapped inside their bands), then some cells cleared. The validator accepts
// any correct completion, so the puzzles don't need a unique solution.
const BASE = Array.from({ length: 9 }, (_, r) => Array.from({ length: 9 }, (_, c) => ((r * 3 + Math.floor(r / 3) + c) % 9) + 1));

function puzzle(seed, holes) {
  const r = rng(seed);
  const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], seed);
  const bandOrder = (s) => shuffle([0, 1, 2], s).flatMap((b) => shuffle([0, 1, 2], s + b + 1).map((i) => b * 3 + i));
  const rows = bandOrder(seed + 10);
  const cols = bandOrder(seed + 20);
  const board = rows.map((ri) => cols.map((ci) => String(digits[BASE[ri][ci] - 1])));
  let cleared = 0;
  while (cleared < holes) {
    const i = Math.floor(r() * 9);
    const j = Math.floor(r() * 9);
    if (board[i][j] !== ".") {
      board[i][j] = ".";
      cleared++;
    }
  }
  return { board };
}

export default {
  slug: "sudoku-solver",
  description: `Write a program that solves a Sudoku puzzle by **filling the empty cells**, changing the board **in place**.

A solved Sudoku follows all of these rules:

1. Each digit \`1\`–\`9\` appears exactly once in every **row**.
2. Each digit \`1\`–\`9\` appears exactly once in every **column**.
3. Each digit \`1\`–\`9\` appears exactly once in each of the nine **3x3 boxes**.

Empty cells are written as \`'.'\`. Every puzzle has at least one solution; any correct completion that keeps the given digits is accepted.`,
  examples: [
    {
      input: {
        board: [
          ["5", "3", ".", ".", "7", ".", ".", ".", "."],
          ["6", ".", ".", "1", "9", "5", ".", ".", "."],
          [".", "9", "8", ".", ".", ".", ".", "6", "."],
          ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
          ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
          ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
          [".", "6", ".", ".", ".", ".", "2", "8", "."],
          [".", ".", ".", "4", "1", "9", ".", ".", "5"],
          [".", ".", ".", ".", "8", ".", ".", "7", "9"],
        ],
      },
      explanation: "The classic puzzle. It has exactly one solution.",
    },
    { input: puzzle(1, 30), explanation: "A shuffled puzzle with 30 empty cells." },
    { input: puzzle(2, 45), explanation: "A harder puzzle with 45 empty cells." },
  ],
  constraints: ["board.length == 9, board[i].length == 9", "board[i][j] is a digit 1-9 or '.'", "The puzzle has at least one solution."],
  harness: { fn: "solveSudoku", params: { board: "char[][]" }, inplace: "board", validator: "sudoku" },
  tests: [
    puzzle(3, 1),
    puzzle(4, 10),
    puzzle(5, 20),
    puzzle(6, 30),
    puzzle(7, 40),
    puzzle(8, 45),
    puzzle(9, 50),
    puzzle(10, 50),
    puzzle(11, 52),
    puzzle(12, 54),
    puzzle(13, 55),
    {
      board: [
        [".", ".", "9", "7", "4", "8", ".", ".", "."],
        ["7", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", "2", ".", "1", ".", "9", ".", ".", "."],
        [".", ".", "7", ".", ".", ".", "2", "4", "."],
        [".", "6", "4", ".", "1", ".", "5", "9", "."],
        [".", "9", "8", ".", ".", ".", "3", ".", "."],
        [".", ".", ".", "8", ".", "3", ".", "2", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "6"],
        [".", ".", ".", "2", "7", "5", "9", ".", "."],
      ],
    },
    puzzle(14, 50),
  ],
  answer: {
    approach: [
      "Track which digits are already used in each row, column and 3x3 box (box index = floor(r/3)·3 + floor(c/3)).",
      "Collect the empty cells, and backtrack over them in order.",
      "For each empty cell, try every digit that is not used in its row, column or box. Place it, mark it used, and recurse to the next empty cell.",
      "If no digit fits, undo and go back. When every empty cell is filled, the board is solved.",
    ],
    time: "Exponential in the worst case, but fast in practice thanks to the constraints",
    space: "O(81)",
    javascript: `function solveSudoku(board) {
    const rows = Array.from({ length: 9 }, () => new Set());
    const cols = Array.from({ length: 9 }, () => new Set());
    const boxes = Array.from({ length: 9 }, () => new Set());
    const empty = [];
    for (let r = 0; r < 9; r++)
        for (let c = 0; c < 9; c++) {
            const v = board[r][c];
            if (v === ".") empty.push([r, c]);
            else {
                rows[r].add(v); cols[c].add(v); boxes[Math.floor(r / 3) * 3 + Math.floor(c / 3)].add(v);
            }
        }
    const solve = (k) => {
        if (k === empty.length) return true;
        const [r, c] = empty[k];
        const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
        for (let d = 1; d <= 9; d++) {
            const v = String(d);
            if (rows[r].has(v) || cols[c].has(v) || boxes[b].has(v)) continue;
            board[r][c] = v;
            rows[r].add(v); cols[c].add(v); boxes[b].add(v);
            if (solve(k + 1)) return true;
            rows[r].delete(v); cols[c].delete(v); boxes[b].delete(v);
            board[r][c] = ".";
        }
        return false;
    };
    solve(0);
}`,
    python: `class Solution:
    def solveSudoku(self, board: List[List[str]]) -> None:
        rows = [set() for _ in range(9)]
        cols = [set() for _ in range(9)]
        boxes = [set() for _ in range(9)]
        empty = []
        for r in range(9):
            for c in range(9):
                v = board[r][c]
                if v == '.':
                    empty.append((r, c))
                else:
                    rows[r].add(v); cols[c].add(v); boxes[r // 3 * 3 + c // 3].add(v)

        def solve(k):
            if k == len(empty):
                return True
            r, c = empty[k]
            b = r // 3 * 3 + c // 3
            for v in '123456789':
                if v in rows[r] or v in cols[c] or v in boxes[b]:
                    continue
                board[r][c] = v
                rows[r].add(v); cols[c].add(v); boxes[b].add(v)
                if solve(k + 1):
                    return True
                rows[r].remove(v); cols[c].remove(v); boxes[b].remove(v)
                board[r][c] = '.'
            return False

        solve(0)`,
  },
};
