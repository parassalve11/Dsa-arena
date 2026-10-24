export default {
  slug: "letter-combinations-of-a-phone-number",
  description: `Given a string of digits from \`2\` to \`9\`, return **all letter combinations** the number could represent, using the letters on a phone keypad:

| 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|
| abc | def | ghi | jkl | mno | pqrs | tuv | wxyz |

Return the combinations in **any order**. If \`digits\` is empty, return an empty list.`,
  examples: [
    { input: { digits: "23" }, explanation: "3 letters for 2 times 3 letters for 3: 9 combinations." },
    { input: { digits: "" }, explanation: "No digits, so no combinations." },
    { input: { digits: "2" }, explanation: "Just the three letters a, b, c." },
  ],
  constraints: ["0 <= digits.length <= 4", "digits[i] is a digit from '2' to '9'."],
  harness: { fn: "letterCombinations", params: { digits: "string" }, returns: "string[]", compare: "unordered" },
  tests: [
    { digits: "7" },
    { digits: "9" },
    { digits: "22" },
    { digits: "79" },
    { digits: "234" },
    { digits: "999" },
    { digits: "2345" },
    { digits: "7979" },
    { digits: "56" },
    { digits: "8" },
    { digits: "468" },
    { digits: "3333" },
  ],
  answer: {
    approach: [
      "Map each digit to its letters.",
      "Backtrack over the positions: at position i, try each letter for digits[i], append it to the current string, and move to i + 1.",
      "When the string has the same length as digits, record it.",
      "Handle the empty input separately: it returns [] rather than [\"\"].",
    ],
    time: "O(4^n · n)",
    space: "O(n) for the recursion",
    javascript: `function letterCombinations(digits) {
    if (!digits) return [];
    const map = { 2: "abc", 3: "def", 4: "ghi", 5: "jkl", 6: "mno", 7: "pqrs", 8: "tuv", 9: "wxyz" };
    const out = [];
    const backtrack = (i, cur) => {
        if (i === digits.length) {
            out.push(cur);
            return;
        }
        for (const c of map[digits[i]]) backtrack(i + 1, cur + c);
    };
    backtrack(0, "");
    return out;
}`,
    python: `class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        if not digits:
            return []
        keys = {'2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'}
        return [''.join(p) for p in itertools.product(*(keys[d] for d in digits))]`,
  },
};
