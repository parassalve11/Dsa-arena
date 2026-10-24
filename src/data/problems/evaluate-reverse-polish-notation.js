import { rng, randInt } from "../gen.js";

// Builds a long valid RPN expression that never divides by zero and whose
// intermediate values stay small.
function bigRpn(n, seed) {
  const r = rng(seed);
  const tokens = [String(randInt(r, 1, 9))];
  for (let i = 0; i < n; i++) {
    tokens.push(String(randInt(r, -50, 50)));
    tokens.push(["+", "-"][randInt(r, 0, 1)]);
    if (i % 7 === 0) tokens.push("3", "*", String(randInt(r, 5, 9) * (r() < 0.5 ? -1 : 1)), "/");
  }
  return { tokens };
}

export default {
  slug: "evaluate-reverse-polish-notation",
  description: `You are given an array of strings \`tokens\` that describes an arithmetic expression in **Reverse Polish Notation** (postfix), where each operator comes after its two operands.

Evaluate the expression and return its value as an integer.

- The operators are \`+\`, \`-\`, \`*\` and \`/\`.
- Each operand is an integer or the result of another expression.
- Division between two integers **truncates toward zero** (so \`-7 / 2 = -3\`).
- There is never a division by zero, and every intermediate result fits in a 32-bit integer.`,
  examples: [
    { input: { tokens: ["2", "1", "+", "3", "*"] }, explanation: "((2 + 1) * 3) = 9." },
    { input: { tokens: ["4", "13", "5", "/", "+"] }, explanation: "(4 + (13 / 5)) = 4 + 2 = 6." },
    { input: { tokens: ["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"] }, explanation: "This evaluates to 22. Note 6 / -132 truncates to 0." },
  ],
  constraints: ["1 <= tokens.length <= 10^4", "tokens[i] is an operator or an integer in the range [-200, 200] (tests may use larger operands)."],
  harness: { fn: "evalRPN", params: { tokens: "string[]" }, returns: "int" },
  tests: [
    { tokens: ["5"] },
    { tokens: ["-7"] },
    { tokens: ["3", "4", "+"] },
    { tokens: ["3", "4", "-"] },
    { tokens: ["-7", "2", "/"] },
    { tokens: ["7", "-2", "/"] },
    { tokens: ["0", "3", "/"] },
    { tokens: ["18", "3", "/", "4", "*"] },
    { tokens: ["4", "-2", "/", "2", "-3", "-", "-"] },
    { tokens: ["1", "2", "+", "3", "4", "+", "*"] },
    { tokens: ["100", "200", "+", "2", "/", "5", "*", "7", "+"] },
    { tokens: ["-200", "200", "*", "3", "/"] },
    bigRpn(3000, 1),
    bigRpn(3000, 2),
  ],
  answer: {
    approach: [
      "Scan the tokens with a stack of numbers.",
      "When you see a number, push it.",
      "When you see an operator, pop b (top) and then a, compute a op b, and push the result. Order matters for - and /.",
      "Truncate division toward zero: Math.trunc(a / b) in JavaScript, int(a / b) in Python (not a // b, which floors).",
    ],
    time: "O(n)",
    space: "O(n)",
    javascript: `function evalRPN(tokens) {
    const stack = [];
    for (const t of tokens) {
        if (t === "+" || t === "-" || t === "*" || t === "/") {
            const b = stack.pop(), a = stack.pop();
            if (t === "+") stack.push(a + b);
            else if (t === "-") stack.push(a - b);
            else if (t === "*") stack.push(a * b);
            else stack.push(Math.trunc(a / b));
        } else {
            stack.push(Number(t));
        }
    }
    return stack[0] + 0;
}`,
    python: `class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        stack = []
        for t in tokens:
            if t in ('+', '-', '*', '/'):
                b, a = stack.pop(), stack.pop()
                if t == '+':
                    stack.append(a + b)
                elif t == '-':
                    stack.append(a - b)
                elif t == '*':
                    stack.append(a * b)
                else:
                    stack.append(int(a / b))
            else:
                stack.append(int(t))
        return stack[0]`,
  },
};
