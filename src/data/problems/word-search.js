import { grid } from "../gen.js";

const letters = (m, n, alphabet, seed) => grid(m, n, (r) => alphabet[Math.floor(r() * alphabet.length)], seed);

const aBoard = Array.from({ length: 6 }, () => new Array(6).fill("A"));

export default {
  slug: "word-search",
  description: `Given an \`m x n\` grid of characters \`board\` and a string \`word\`, return \`true\` if \`word\` exists in the grid.

The word must be built from letters of **sequentially adjacent** cells, where adjacent means horizontally or vertically next to each other. The **same cell may not be used more than once** in a word.`,
  examples: [
    { input: { board: [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], word: "ABCCED" }, explanation: "Go A → B → C along the top, then down to C, E, D." },
    { input: { board: [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], word: "SEE" }, explanation: "S on the right, then down to E, then left to E." },
    { input: { board: [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], word: "ABCB" }, explanation: "The B would have to be reused, which is not allowed." },
  ],
  constraints: ["m == board.length, n == board[i].length", "1 <= m, n <= 6", "1 <= word.length <= 15", "board and word consist of English letters."],
  followUp: "Could you use search pruning to make it faster on larger boards?",
  harness: { fn: "exist", params: { board: "char[][]", word: "string" }, returns: "bool" },
  tests: [
    { board: [["a"]], word: "a" },
    { board: [["a"]], word: "b" },
    { board: [["a", "b"]], word: "ba" },
    { board: [["a", "b"], ["c", "d"]], word: "abdc" },
    { board: [["a", "b"], ["c", "d"]], word: "abcd" },
    { board: [["a", "a"]], word: "aaa" },
    { board: [["C", "A", "A"], ["A", "A", "A"], ["B", "C", "D"]], word: "AAB" },
    { board: [["A", "B", "C", "E"], ["S", "F", "E", "S"], ["A", "D", "E", "E"]], word: "ABCESEEEFS" },
    { board: [["a", "b"], ["c", "d"]], word: "acdb" },
    { board: [["o", "a", "a", "n"], ["e", "t", "a", "e"], ["i", "h", "k", "r"], ["i", "f", "l", "v"]], word: "oath" },
    { board: [["o", "a", "a", "n"], ["e", "t", "a", "e"], ["i", "h", "k", "r"], ["i", "f", "l", "v"]], word: "eat" },
    { board: [["o", "a", "a", "n"], ["e", "t", "a", "e"], ["i", "h", "k", "r"], ["i", "f", "l", "v"]], word: "rain" },
    { board: aBoard, word: "AAAAAAAAAB" },
    { board: aBoard, word: "AAAAAAAAAAAAAAA" },
    { board: letters(6, 6, "AB", 1), word: "ABABABABABABABA" },
    { board: letters(6, 6, "ABCDEF", 2), word: "ABCDEFABCDEF" },
  ],
  answer: {
    approach: [
      "Try every cell as a starting point and run a DFS that matches word one letter at a time.",
      "dfs(r, c, i): fail if out of bounds or board[r][c] != word[i]. Succeed if i is the last index.",
      "Temporarily mark the cell (for example replace it with '#') so it is not reused, explore the four neighbours with i + 1, then restore it.",
      "Pruning ideas: return false early if the board doesn't have enough of some letter, and search from whichever end of the word is rarer.",
    ],
    time: "O(m · n · 3^L), where L is the word length",
    space: "O(L) for the recursion",
    javascript: `function exist(board, word) {
    const m = board.length, n = board[0].length;
    const dfs = (r, c, i) => {
        if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[i]) return false;
        if (i === word.length - 1) return true;
        const saved = board[r][c];
        board[r][c] = "#";
        const found = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
        board[r][c] = saved;
        return found;
    };
    for (let r = 0; r < m; r++)
        for (let c = 0; c < n; c++)
            if (dfs(r, c, 0)) return true;
    return false;
}`,
    python: `class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        m, n = len(board), len(board[0])
        have = Counter(ch for row in board for ch in row)
        if any(have[ch] < k for ch, k in Counter(word).items()):
            return False
        if have[word[0]] > have[word[-1]]:
            word = word[::-1]

        def dfs(r, c, i):
            if r < 0 or r >= m or c < 0 or c >= n or board[r][c] != word[i]:
                return False
            if i == len(word) - 1:
                return True
            saved, board[r][c] = board[r][c], '#'
            found = dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1) or dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1)
            board[r][c] = saved
            return found

        return any(dfs(r, c, 0) for r in range(m) for c in range(n))`,
  },
};
