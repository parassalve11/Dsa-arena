import { rng } from "../gen.js";

function balanced(pairs, seed) {
  const r = rng(seed);
  const open = "([{";
  const close = { "(": ")", "[": "]", "{": "}" };
  let s = "";
  const stack = [];
  let opened = 0;
  while (opened < pairs || stack.length) {
    if (opened < pairs && (stack.length === 0 || r() < 0.55)) {
      const c = open[Math.floor(r() * 3)];
      stack.push(c);
      s += c;
      opened++;
    } else {
      s += close[stack.pop()];
    }
  }
  return s;
}

const big = balanced(5000, 3);

export default {
  slug: "valid-parentheses",
  description: `You get a string \`s\` made only of the bracket characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\` and \`]\`.

Decide whether the brackets are **properly balanced**. That means:

- every opening bracket is closed by a bracket of the **same type**,
- brackets are closed in the **right order** (the most recently opened one closes first), and
- every closing bracket has a matching opening bracket before it.

Return \`true\` if the string is balanced, otherwise \`false\`.`,
  examples: [
    { input: { s: "()" }, explanation: "One pair, opened and closed correctly." },
    { input: { s: "()[]{}" }, explanation: "Three separate pairs, each one is closed correctly." },
    { input: { s: "(]" }, explanation: "The '(' is closed by a ']', which is the wrong type." },
    { input: { s: "([)]" }, explanation: "The '[' is still open when ')' arrives, so the order is wrong." },
  ],
  constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
  harness: { fn: "isValid", params: { s: "string" }, returns: "bool" },
  tests: [
    { s: "{[]}" },
    { s: "(" },
    { s: ")" },
    { s: "((" },
    { s: "))((" },
    { s: "[" },
    { s: "]]" },
    { s: "(((((((((())))))))))" },
    { s: "{[()()]}[]" },
    { s: "{[(])}" },
    { s: "(){}}{" },
    { s: "([]){" },
    { s: "[({})](){}[[]]" },
    { s: big },
    { s: big + "(" },
    { s: big.slice(0, -1) + "]" },
  ],
  answer: {
    approach: [
      "Use a stack to remember the opening brackets that are still waiting to be closed.",
      "Push every opening bracket.",
      "On a closing bracket, the stack top must be its matching opener. If the stack is empty or the top doesn't match, the string is invalid. Otherwise pop it.",
      "At the end the stack must be empty, because any leftover opener was never closed.",
    ],
    time: "O(n)",
    space: "O(n)",
    javascript: `function isValid(s) {
    const match = { ')': '(', ']': '[', '}': '{' };
    const stack = [];
    for (const c of s) {
        if (c in match) {
            if (stack.pop() !== match[c]) return false;
        } else {
            stack.push(c);
        }
    }
    return stack.length === 0;
}`,
    python: `class Solution:
    def isValid(self, s: str) -> bool:
        match = {')': '(', ']': '[', '}': '{'}
        stack = []
        for c in s:
            if c in match:
                if not stack or stack.pop() != match[c]:
                    return False
            else:
                stack.append(c)
        return not stack`,
  },
};
