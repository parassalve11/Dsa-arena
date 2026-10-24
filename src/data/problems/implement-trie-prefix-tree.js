import { rng, randInt, str } from "../gen.js";

function randomOps(count, seed) {
  const r = rng(seed);
  const words = Array.from({ length: 300 }, (_, i) => str(randInt(r, 1, 8), "abcde", seed * 1000 + i));
  const ops = ["Trie"];
  const args = [[]];
  for (let i = 0; i < count; i++) {
    const w = words[randInt(r, 0, words.length - 1)];
    const roll = r();
    if (roll < 0.4) {
      ops.push("insert");
      args.push([w]);
    } else if (roll < 0.7) {
      ops.push("search");
      args.push([w]);
    } else {
      ops.push("startsWith");
      args.push([w.slice(0, randInt(r, 1, w.length))]);
    }
  }
  return { ops, args };
}

export default {
  slug: "implement-trie-prefix-tree",
  description: `A **trie** (prefix tree) stores strings so that you can quickly look up words and prefixes. It is used for things like autocomplete and spell checking.

Implement the \`Trie\` class:

- \`Trie()\` creates an empty trie.
- \`insert(word)\` adds \`word\` to the trie.
- \`search(word)\` returns \`true\` if \`word\` was inserted before.
- \`startsWith(prefix)\` returns \`true\` if some inserted word starts with \`prefix\`.

**How the input works:** \`ops\` lists the calls and \`args\` their arguments. The output lists each call's return value (\`null\` for the constructor and \`insert\`).`,
  examples: [
    {
      input: { ops: ["Trie", "insert", "search", "search", "startsWith", "insert", "search"], args: [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]] },
      explanation: "\"app\" is only a prefix until it is inserted as a word itself.",
    },
    { input: { ops: ["Trie", "search", "startsWith"], args: [[], ["a"], ["a"]] }, explanation: "Nothing has been inserted yet." },
    {
      input: { ops: ["Trie", "insert", "insert", "startsWith", "search"], args: [[], ["car"], ["cart"], ["ca"], ["ca"]] },
      explanation: "\"ca\" is a prefix of both words but not a word.",
    },
  ],
  constraints: ["1 <= word.length, prefix.length <= 2000", "Words and prefixes are lowercase letters.", "At most 3 * 10^4 calls in total."],
  harness: { type: "design", className: "Trie" },
  starter: {
    javascript: `class Trie {
    constructor() {

    }

    /**
     * @param {string} word
     * @return {void}
     */
    insert(word) {

    }

    /**
     * @param {string} word
     * @return {boolean}
     */
    search(word) {

    }

    /**
     * @param {string} prefix
     * @return {boolean}
     */
    startsWith(prefix) {

    }
}`,
    python: `class Trie:

    def __init__(self):


    def insert(self, word: str) -> None:


    def search(self, word: str) -> bool:


    def startsWith(self, prefix: str) -> bool:
        `,
  },
  tests: [
    { ops: ["Trie", "insert", "search"], args: [[], ["a"], ["a"]] },
    { ops: ["Trie", "insert", "search", "startsWith"], args: [[], ["ab"], ["a"], ["a"]] },
    { ops: ["Trie", "insert", "insert", "search", "search"], args: [[], ["a"], ["a"], ["a"], ["aa"]] },
    { ops: ["Trie", "insert", "startsWith", "startsWith"], args: [[], ["hello"], ["hello"], ["helloo"]] },
    { ops: ["Trie", "insert", "insert", "insert", "search", "search", "search", "startsWith"], args: [[], ["to"], ["tea"], ["ted"], ["te"], ["tea"], ["ten"], ["te"]] },
    { ops: ["Trie", "insert", "search", "insert", "search"], args: [[], ["abc"], ["ab"], ["ab"], ["ab"]] },
    { ops: ["Trie", "startsWith", "insert", "startsWith"], args: [[], ["z"], ["zebra"], ["z"]] },
    { ops: ["Trie", "insert", "insert", "search", "search", "startsWith", "startsWith"], args: [[], ["inn"], ["in"], ["i"], ["in"], ["i"], ["inn"]] },
    { ops: ["Trie", "insert", "search", "startsWith"], args: [[], ["xyz"], ["xyy"], ["xy"]] },
    { ops: ["Trie", "insert", "insert", "insert", "search", "search", "search"], args: [[], ["b"], ["ba"], ["bat"], ["b"], ["ba"], ["bat"]] },
    { ops: ["Trie", "insert", "search", "search"], args: [[], ["leetcode"], ["leet"], ["leetcode"]] },
    { ops: ["Trie", "insert", "startsWith", "search"], args: [[], ["a".repeat(2000)], ["a".repeat(1999)], ["a".repeat(1999)]] },
    randomOps(30000, 1),
    randomOps(20000, 2),
  ],
  answer: {
    approach: [
      "Each node has a map (or 26-slot array) from a letter to a child node, plus a flag marking the end of a word.",
      "insert: walk from the root letter by letter, creating missing children, and mark the last node as the end of a word.",
      "search: walk the same way. If a letter is missing, return false. At the end, return the node's end-of-word flag.",
      "startsWith: the same walk, but return true as soon as the whole prefix is matched.",
    ],
    time: "O(L) per operation, where L is the word length",
    space: "O(total characters inserted)",
    javascript: `class Trie {
    constructor() {
        this.root = {};
    }
    insert(word) {
        let node = this.root;
        for (const c of word) node = node[c] || (node[c] = {});
        node.$ = true;
    }
    find(s) {
        let node = this.root;
        for (const c of s) {
            node = node[c];
            if (!node) return null;
        }
        return node;
    }
    search(word) {
        const node = this.find(word);
        return !!(node && node.$);
    }
    startsWith(prefix) {
        return this.find(prefix) !== null;
    }
}`,
    python: `class Trie:
    def __init__(self):
        self.root = {}

    def insert(self, word: str) -> None:
        node = self.root
        for c in word:
            node = node.setdefault(c, {})
        node['$'] = True

    def _find(self, s):
        node = self.root
        for c in s:
            if c not in node:
                return None
            node = node[c]
        return node

    def search(self, word: str) -> bool:
        node = self._find(word)
        return node is not None and '$' in node

    def startsWith(self, prefix: str) -> bool:
        return self._find(prefix) is not None`,
  },
};
