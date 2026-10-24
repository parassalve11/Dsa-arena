import { grid, rng, randInt, str } from "../gen.js";

function bigCase(seed) {
  const r = rng(seed);
  const board = grid(12, 12, (rr) => "abcde"[Math.floor(rr() * 5)], seed);
  const words = new Set();
  // Words traced along real paths on the board, so many of them exist.
  while (words.size < 600) {
    let i = randInt(r, 0, 11);
    let j = randInt(r, 0, 11);
    const seen = new Set([i * 12 + j]);
    let w = board[i][j];
    const len = randInt(r, 2, 8);
    for (let step = 1; step < len; step++) {
      const moves = [[1, 0], [-1, 0], [0, 1], [0, -1]]
        .map(([a, b]) => [i + a, j + b])
        .filter(([a, b]) => a >= 0 && a < 12 && b >= 0 && b < 12 && !seen.has(a * 12 + b));
      if (!moves.length) break;
      [i, j] = moves[randInt(r, 0, moves.length - 1)];
      seen.add(i * 12 + j);
      w += board[i][j];
    }
    words.add(w);
  }
  for (let k = 0; words.size < 1000; k++) words.add(str(randInt(r, 3, 10), "abcde", seed * 7919 + k));
  return { board, words: [...words] };
}

export default {
  slug: "word-search-ii",
  description: `Given an \`m x n\` \`board\` of letters and a list of \`words\`, return **all the words that can be found on the board**.

A word is formed from letters of **sequentially adjacent** cells (horizontally or vertically). The **same cell may not be used twice** in one word.

Return the found words in **any order**, each word once.`,
  examples: [
    {
      input: { board: [["o", "a", "a", "n"], ["e", "t", "a", "e"], ["i", "h", "k", "r"], ["i", "f", "l", "v"]], words: ["oath", "pea", "eat", "rain"] },
      explanation: "\"oath\" and \"eat\" can be traced on the board.",
    },
    { input: { board: [["a", "b"], ["c", "d"]], words: ["abcb"] }, explanation: "\"abcb\" would need the b cell twice." },
    { input: { board: [["a"]], words: ["a", "b"] }, explanation: "Only \"a\" is on the board." },
  ],
  constraints: ["m == board.length, n == board[i].length", "1 <= m, n <= 12", "1 <= words.length <= 3 * 10^4", "1 <= words[i].length <= 10", "All words are unique and lowercase."],
  harness: { fn: "findWords", params: { board: "char[][]", words: "string[]" }, returns: "string[]", compare: "unordered" },
  tests: [
    { board: [["a", "b"]], words: ["ab", "ba", "a", "b", "aa"] },
    { board: [["a", "a"]], words: ["aaa"] },
    { board: [["a", "b"], ["c", "d"]], words: ["ab", "cb", "ad", "bd", "ac", "ca", "da", "bc", "db", "adcb", "dabc", "abb", "acb"] },
    { board: [["o", "a", "b", "n"], ["o", "t", "a", "e"], ["a", "h", "k", "r"], ["a", "f", "l", "v"]], words: ["oa", "oaa"] },
    { board: [["a", "b", "c"], ["a", "e", "d"], ["a", "f", "g"]], words: ["abcdefg", "gfedcbaaa", "eaabcdgfa", "befa", "dgc", "ade"] },
    { board: [["x"]], words: ["x", "xx", "y"] },
    { board: [["a", "b", "e"], ["b", "c", "d"]], words: ["abcdeb", "abcb", "ebcb"] },
    { board: [["s", "e", "e", "n", "e", "w"], ["t", "m", "r", "i", "v", "a"], ["o", "b", "s", "i", "b", "d"], ["w", "m", "y", "s", "e", "n"], ["l", "t", "s", "n", "s", "a"], ["i", "e", "z", "l", "g", "n"]], words: ["seen", "ivy", "misty", "browse", "visa", "new", "news", "stem"] },
    { board: [["a", "a", "a"], ["a", "a", "a"], ["a", "a", "a"]], words: ["aaaaaaaaa", "aaaaaaaaaa", "a", "aa"] },
    { board: [["c", "a", "t"], ["d", "o", "g"]], words: ["cat", "dog", "cod", "tag", "act", "god", "cog"] },
    { board: [["b"], ["a"], ["b"], ["b"], ["a"]], words: ["baa", "abba", "baab", "aba"] },
    { board: [["z", "y"], ["x", "w"]], words: ["zyxw", "zywx", "zxwy", "wx"] },
    bigCase(1),
    bigCase(2),
  ],
  answer: {
    approach: [
      "Put all the words into a trie, so one DFS can check many words at once.",
      "Start a DFS from every cell, walking down the trie along with the board. If the current letter has no trie child, stop: no word continues this way.",
      "When you reach a trie node that ends a word, add the word to the result and clear the mark so it isn't added twice.",
      "Mark cells as visited during the DFS (and restore them after). Pruning trie nodes that have no words left keeps later searches fast.",
    ],
    time: "O(m · n · 4 · 3^(L-1)) in the worst case, where L is the longest word",
    space: "O(total characters in words)",
    javascript: `function findWords(board, words) {
    const root = {};
    for (const w of words) {
        let node = root;
        for (const c of w) node = node[c] || (node[c] = {});
        node.word = w;
    }
    const m = board.length, n = board[0].length, out = [];
    const dfs = (r, c, parent) => {
        const ch = board[r][c];
        const node = parent[ch];
        if (!node) return;
        if (node.word) {
            out.push(node.word);
            node.word = null;
        }
        board[r][c] = "#";
        if (r > 0) dfs(r - 1, c, node);
        if (r < m - 1) dfs(r + 1, c, node);
        if (c > 0) dfs(r, c - 1, node);
        if (c < n - 1) dfs(r, c + 1, node);
        board[r][c] = ch;
    };
    for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) dfs(r, c, root);
    return out;
}`,
    python: `class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        root = {}
        for w in words:
            node = root
            for c in w:
                node = node.setdefault(c, {})
            node['$'] = w
        m, n = len(board), len(board[0])
        out = []

        def dfs(r, c, parent):
            ch = board[r][c]
            node = parent.get(ch)
            if node is None:
                return
            word = node.pop('$', None)
            if word:
                out.append(word)
            board[r][c] = '#'
            for nr, nc in ((r - 1, c), (r + 1, c), (r, c - 1), (r, c + 1)):
                if 0 <= nr < m and 0 <= nc < n and board[nr][nc] != '#':
                    dfs(nr, nc, node)
            board[r][c] = ch
            if not node:
                parent.pop(ch)

        for r in range(m):
            for c in range(n):
                dfs(r, c, root)
        return out`,
  },
};
