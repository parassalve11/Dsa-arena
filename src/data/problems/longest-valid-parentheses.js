import { str } from "../gen.js";

export default {
  slug: "longest-valid-parentheses",
  description: `Given a string containing only \`'('\` and \`')'\`, return the length of the **longest valid (well-formed) parentheses substring**.`,
  examples: [
    { input: { s: "(()" }, explanation: "The longest valid substring is \"()\"." },
    { input: { s: ")()())" }, explanation: "The longest valid substring is \"()()\"." },
    { input: { s: "" }, explanation: "An empty string has no valid substring." },
  ],
  constraints: ["0 <= s.length <= 3 * 10^4", "s[i] is '(' or ')'."],
  harness: { fn: "longestValidParentheses", params: { s: "string" }, returns: "int" },
  tests: [
    { s: "(" },
    { s: ")" },
    { s: "()" },
    { s: ")(" },
    { s: "(())" },
    { s: "()(()" },
    { s: "()(())" },
    { s: "(()())" },
    { s: "())((())" },
    { s: ")()())()()(" },
    { s: "((((((" },
    { s: "(()(((()" },
    { s: str(30000, "()", 1) },
    { s: "(".repeat(15000) + ")".repeat(15000) },
    { s: "()".repeat(7000) + ")" + "()".repeat(8000) },
  ],
  answer: {
    approach: [
      "Use a stack of indices, with -1 at the bottom as a marker for 'the position before the current valid run'.",
      "On '(', push its index.",
      "On ')', pop. If the stack is now empty, this ')' can't be matched: push its index as the new marker. Otherwise the valid run ends here and starts after the index on top: length = i - stack.top.",
      "The largest length seen is the answer. (An O(1)-space version scans left-to-right and right-to-left counting brackets.)",
    ],
    time: "O(n)",
    space: "O(n)",
    javascript: `function longestValidParentheses(s) {
    const stack = [-1];
    let best = 0;
    for (let i = 0; i < s.length; i++) {
        if (s[i] === "(") stack.push(i);
        else {
            stack.pop();
            if (stack.length === 0) stack.push(i);
            else best = Math.max(best, i - stack[stack.length - 1]);
        }
    }
    return best;
}`,
    python: `class Solution:
    def longestValidParentheses(self, s: str) -> int:
        stack = [-1]
        best = 0
        for i, c in enumerate(s):
            if c == '(':
                stack.append(i)
            else:
                stack.pop()
                if not stack:
                    stack.append(i)
                else:
                    best = max(best, i - stack[-1])
        return best`,
  },
};
