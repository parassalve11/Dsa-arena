export default {
  slug: "roman-to-integer",
  description: `Roman numerals use seven symbols:

| Symbol | I | V | X | L | C | D | M |
|---|---|---|---|---|---|---|---|
| Value | 1 | 5 | 10 | 50 | 100 | 500 | 1000 |

Symbols are usually written from largest to smallest, and their values are added: \`XII\` is 10 + 1 + 1 = 12.

Six special pairs use **subtraction** instead, where a smaller symbol comes before a larger one:
\`IV\` = 4, \`IX\` = 9, \`XL\` = 40, \`XC\` = 90, \`CD\` = 400, \`CM\` = 900.

Given a valid Roman numeral \`s\`, convert it to an integer.`,
  examples: [
    { input: { s: "III" }, explanation: "1 + 1 + 1 = 3." },
    { input: { s: "LVIII" }, explanation: "L = 50, V = 5, III = 3, total 58." },
    { input: { s: "MCMXCIV" }, explanation: "M = 1000, CM = 900, XC = 90, IV = 4, total 1994." },
  ],
  constraints: ["1 <= s.length <= 15", "s contains only I, V, X, L, C, D, M.", "s is a valid Roman numeral in the range [1, 3999]."],
  harness: { fn: "romanToInt", params: { s: "string" }, returns: "int" },
  tests: [
    { s: "I" },
    { s: "IV" },
    { s: "IX" },
    { s: "XL" },
    { s: "XC" },
    { s: "CD" },
    { s: "CM" },
    { s: "MMMCMXCIX" },
    { s: "XLII" },
    { s: "DCCCXC" },
    { s: "MMXXIV" },
    { s: "CDXLIV" },
    { s: "MDCLXVI" },
    { s: "LXXXVIII" },
  ],
  answer: {
    approach: [
      "Map each symbol to its value.",
      "Read the string left to right. If a symbol is smaller than the one right after it, it is part of a subtraction pair, so subtract it.",
      "Otherwise add it.",
      "For example in IV, I (1) is smaller than V (5), so the total is -1 + 5 = 4.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function romanToInt(s) {
    const v = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let total = 0;
    for (let i = 0; i < s.length; i++) {
        if (i + 1 < s.length && v[s[i]] < v[s[i + 1]]) total -= v[s[i]];
        else total += v[s[i]];
    }
    return total;
}`,
    python: `class Solution:
    def romanToInt(self, s: str) -> int:
        v = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
        total = 0
        for i, c in enumerate(s):
            if i + 1 < len(s) and v[c] < v[s[i + 1]]:
                total -= v[c]
            else:
                total += v[c]
        return total`,
  },
};
