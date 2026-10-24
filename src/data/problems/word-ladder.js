import { rng, randInt } from "../gen.js";

// A long chain of words where each step changes one letter, plus noise words.
function bigLadder(steps, noise, seed) {
  const r = rng(seed);
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let w = "aaaaa".split("");
  const chain = [w.join("")];
  const used = new Set(chain);
  while (chain.length <= steps) {
    const next = w.slice();
    const i = randInt(r, 0, 4);
    next[i] = letters[randInt(r, 0, 25)];
    const s = next.join("");
    if (used.has(s)) continue;
    used.add(s);
    chain.push(s);
    w = next;
  }
  const words = new Set(chain.slice(1));
  while (words.size < chain.length - 1 + noise) {
    words.add(Array.from({ length: 5 }, () => letters[randInt(r, 0, 25)]).join(""));
  }
  return { beginWord: chain[0], endWord: chain[chain.length - 1], wordList: [...words] };
}

export default {
  slug: "word-ladder",
  description: `A **transformation sequence** from \`beginWord\` to \`endWord\` is a list of words \`beginWord → s1 → s2 → … → sk\` where:

- each neighbouring pair of words differs by **exactly one letter**,
- every \`si\` is in \`wordList\` (\`beginWord\` does not need to be), and
- \`sk == endWord\`.

Return the **number of words** in the **shortest** such sequence, or \`0\` if none exists.`,
  examples: [
    { input: { beginWord: "hit", endWord: "cog", wordList: ["hot", "dot", "dog", "lot", "log", "cog"] }, explanation: "hit → hot → dot → dog → cog has 5 words." },
    { input: { beginWord: "hit", endWord: "cog", wordList: ["hot", "dot", "dog", "lot", "log"] }, explanation: "cog is not in the word list, so no sequence exists." },
    { input: { beginWord: "a", endWord: "c", wordList: ["a", "b", "c"] }, explanation: "a → c directly: 2 words." },
  ],
  constraints: ["1 <= beginWord.length <= 10", "endWord.length == beginWord.length", "1 <= wordList.length <= 5000", "All words are lowercase and the same length.", "beginWord != endWord", "All words in wordList are unique."],
  harness: { fn: "ladderLength", params: { beginWord: "string", endWord: "string", wordList: "string[]" }, returns: "int" },
  tests: [
    { beginWord: "ab", endWord: "ac", wordList: ["ac"] },
    { beginWord: "ab", endWord: "cd", wordList: ["cd"] },
    { beginWord: "ab", endWord: "cd", wordList: ["ad", "cd"] },
    { beginWord: "hot", endWord: "dog", wordList: ["hot", "dog"] },
    { beginWord: "hot", endWord: "dog", wordList: ["hot", "dog", "dot"] },
    { beginWord: "lost", endWord: "cost", wordList: ["most", "fist", "lost", "cost", "fish"] },
    { beginWord: "lost", endWord: "miss", wordList: ["most", "mist", "miss", "lost", "fist", "fish"] },
    { beginWord: "talk", endWord: "tail", wordList: ["talk", "tons", "fall", "tail", "gale", "hall", "negs"] },
    { beginWord: "hit", endWord: "cog", wordList: ["hot", "cog", "dot", "dog", "hit", "lot", "log"] },
    { beginWord: "red", endWord: "tax", wordList: ["ted", "tex", "red", "tax", "tad", "den", "rex", "pee"] },
    { beginWord: "qa", endWord: "sq", wordList: ["si", "go", "se", "cm", "so", "ph", "mt", "db", "mb", "sb", "kr", "ln", "tm", "le", "av", "sm", "ar", "ci", "ca", "br", "ti", "ba", "to", "ra", "fa", "yo", "ow", "sn", "ya", "cr", "po", "fe", "ho", "ma", "re", "or", "rn", "au", "ur", "rh", "sr", "tc", "lt", "lo", "as", "fr", "nb", "yb", "if", "pb", "ge", "th", "pm", "rb", "sh", "co", "ga", "li", "ha", "hz", "no", "bi", "di", "hi", "qa", "pi", "os", "uh", "wm", "an", "me", "mo", "na", "la", "st", "er", "sc", "ne", "mn", "mi", "am", "ex", "pt", "io", "be", "fm", "ta", "tb", "ni", "mr", "pa", "he", "lr", "sq", "ye"] },
    { beginWord: "cat", endWord: "dog", wordList: ["cot", "cog", "dog", "bat", "cut"] },
    bigLadder(200, 3000, 1),
    bigLadder(50, 4900, 2),
  ],
  answer: {
    approach: [
      "Think of each word as a node, with an edge between words that differ by one letter. You want the shortest path, so use BFS.",
      "Put the word list in a set. Start the BFS from beginWord at length 1.",
      "For each word in the queue, try changing each position to each of the 26 letters. Any result in the set is a neighbour: remove it from the set (so it's visited once) and queue it with length + 1.",
      "Return the length when you reach endWord, or 0 if the queue empties.",
    ],
    time: "O(N · L · 26), where N is the number of words and L their length",
    space: "O(N · L)",
    javascript: `function ladderLength(beginWord, endWord, wordList) {
    const words = new Set(wordList);
    if (!words.has(endWord)) return 0;
    let level = [beginWord], steps = 1;
    words.delete(beginWord);
    while (level.length) {
        const next = [];
        for (const w of level) {
            if (w === endWord) return steps;
            for (let i = 0; i < w.length; i++) {
                for (let c = 97; c <= 122; c++) {
                    const cand = w.slice(0, i) + String.fromCharCode(c) + w.slice(i + 1);
                    if (words.has(cand)) {
                        words.delete(cand);
                        next.push(cand);
                    }
                }
            }
        }
        level = next;
        steps++;
    }
    return 0;
}`,
    python: `class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        words = set(wordList)
        if endWord not in words:
            return 0
        words.discard(beginWord)
        queue = deque([(beginWord, 1)])
        letters = 'abcdefghijklmnopqrstuvwxyz'
        while queue:
            w, steps = queue.popleft()
            if w == endWord:
                return steps
            for i in range(len(w)):
                for c in letters:
                    cand = w[:i] + c + w[i + 1:]
                    if cand in words:
                        words.remove(cand)
                        queue.append((cand, steps + 1))
        return 0`,
  },
};
