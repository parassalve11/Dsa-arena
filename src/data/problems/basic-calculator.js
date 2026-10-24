import { rng, randInt } from "../gen.js";

function bigExpr(n, seed) {
  const r = rng(seed);
  let s = "";
  let depth = 0;
  for (let i = 0; i < n; i++) {
    if (i > 0) s += r() < 0.5 ? " + " : " - ";
    if (r() < 0.2) {
      s += "(";
      depth++;
    }
    s += String(randInt(r, 0, 1000));
    if (depth > 0 && r() < 0.25) {
      s += ")";
      depth--;
    }
  }
  return { s: "-" + s + ")".repeat(depth) };
}

export default {
  slug: "basic-calculator",
  description: `Given a string \`s\` that holds a valid expression, evaluate it and return the result.

The expression can contain non-negative integers, \`+\`, \`-\`, parentheses \`(\` \`)\` and spaces.

- \`-\` can be used as a **unary minus**, like \`-2\` or \`-(2 + 3)\`. \`+\` is never unary.
- You may **not** use built-in evaluation such as \`eval()\`.
- Every intermediate value and the final answer fit in a 32-bit integer.`,
  examples: [
    { input: { s: "1 + 1" }, explanation: "1 + 1 = 2." },
    { input: { s: " 2-1 + 2 " }, explanation: "2 - 1 + 2 = 3. Spaces are ignored." },
    { input: { s: "(1+(4+5+2)-3)+(6+8)" }, explanation: "(1 + 11 - 3) + 14 = 23." },
  ],
  constraints: ["1 <= s.length <= 3 * 10^5", "s consists of digits, '+', '-', '(', ')' and ' '.", "s is a valid expression."],
  harness: { fn: "calculate", params: { s: "string" }, returns: "int" },
  tests: [
    { s: "0" },
    { s: "42" },
    { s: "-5" },
    { s: "- (3 + (4 + 5))" },
    { s: "1-(     -2)" },
    { s: "2147483647" },
    { s: "(7)-(0)+(4)" },
    { s: "10 - (2 - (3 - 4))" },
    { s: "-(-(-1))" },
    { s: "(((((1)))))" },
    { s: "1 - 1 - 1 - 1" },
    { s: "123 + 456 - (78 + 9)" },
    bigExpr(30000, 1),
    bigExpr(30000, 2),
  ],
  answer: {
    approach: [
      "Scan left to right keeping a running result, the current number and the current sign (+1 or -1).",
      "When a number ends, add sign × number to the result.",
      "On '(', push the current result and sign onto a stack, then start a fresh result for the inner expression.",
      "On ')', finish the inner result, then combine: result = pushedResult + pushedSign × innerResult. Unary minus works because '-' just sets sign = -1 before a number or '('.",
    ],
    time: "O(n)",
    space: "O(n) for nested parentheses",
    javascript: `function calculate(s) {
    const stack = [];
    let result = 0, num = 0, sign = 1;
    for (const c of s) {
        if (c >= "0" && c <= "9") num = num * 10 + Number(c);
        else if (c === "+" || c === "-") {
            result += sign * num;
            num = 0;
            sign = c === "+" ? 1 : -1;
        } else if (c === "(") {
            stack.push(result, sign);
            result = 0;
            sign = 1;
        } else if (c === ")") {
            result += sign * num;
            num = 0;
            const prevSign = stack.pop();
            result = stack.pop() + prevSign * result;
        }
    }
    return result + sign * num;
}`,
    python: `class Solution:
    def calculate(self, s: str) -> int:
        stack = []
        result, num, sign = 0, 0, 1
        for c in s:
            if c.isdigit():
                num = num * 10 + int(c)
            elif c in '+-':
                result += sign * num
                num = 0
                sign = 1 if c == '+' else -1
            elif c == '(':
                stack.append(result)
                stack.append(sign)
                result, sign = 0, 1
            elif c == ')':
                result += sign * num
                num = 0
                prev_sign = stack.pop()
                result = stack.pop() + prev_sign * result
        return result + sign * num`,
  },
};
