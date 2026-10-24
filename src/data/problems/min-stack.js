import { rng, randInt } from "../gen.js";

function randomOps(count, seed) {
  const r = rng(seed);
  const ops = ["MinStack"];
  const args = [[]];
  let size = 0;
  for (let i = 0; i < count; i++) {
    const roll = r();
    if (size === 0 || roll < 0.4) {
      ops.push("push");
      args.push([randInt(r, -1000000, 1000000)]);
      size++;
    } else if (roll < 0.6) {
      ops.push("pop");
      args.push([]);
      size--;
    } else if (roll < 0.8) {
      ops.push("top");
      args.push([]);
    } else {
      ops.push("getMin");
      args.push([]);
    }
  }
  return { ops, args };
}

export default {
  slug: "min-stack",
  description: `Design a stack that, besides the usual operations, can tell you its **smallest element in constant time**.

Implement the \`MinStack\` class:

- \`MinStack()\` creates an empty stack.
- \`push(val)\` puts \`val\` on top of the stack.
- \`pop()\` removes the top element.
- \`top()\` returns the top element.
- \`getMin()\` returns the smallest element currently in the stack.

**Every method must run in O(1) time.**

**How the input works:** \`ops\` lists the method calls in order and \`args\` holds the arguments for each call. The output lists what each call returned (\`null\` for calls that return nothing).`,
  examples: [
    {
      input: { ops: ["MinStack", "push", "push", "push", "getMin", "pop", "top", "getMin"], args: [[], [-2], [0], [-3], [], [], [], []] },
      explanation: "After pushing -2, 0, -3 the minimum is -3. Popping removes -3, so the top is 0 and the minimum goes back to -2.",
    },
    {
      input: { ops: ["MinStack", "push", "getMin", "top"], args: [[], [5], [], []] },
      explanation: "With one element, it is both the top and the minimum.",
    },
    {
      input: { ops: ["MinStack", "push", "push", "push", "getMin", "pop", "getMin"], args: [[], [2], [2], [1], [], [], []] },
      explanation: "Duplicates matter: after popping 1, the minimum is 2 again.",
    },
  ],
  constraints: [
    "-2^31 <= val <= 2^31 - 1",
    "pop, top and getMin are only called when the stack is non-empty.",
    "At most 3 * 10^4 calls will be made in total.",
  ],
  harness: { type: "design", className: "MinStack" },
  starter: {
    javascript: `class MinStack {
    constructor() {

    }

    /**
     * @param {number} val
     * @return {void}
     */
    push(val) {

    }

    /**
     * @return {void}
     */
    pop() {

    }

    /**
     * @return {number}
     */
    top() {

    }

    /**
     * @return {number}
     */
    getMin() {

    }
}`,
    python: `class MinStack:

    def __init__(self):


    def push(self, val: int) -> None:


    def pop(self) -> None:


    def top(self) -> int:


    def getMin(self) -> int:
        `,
  },
  tests: [
    { ops: ["MinStack", "push", "push", "getMin", "pop", "getMin"], args: [[], [1], [2], [], [], []] },
    { ops: ["MinStack", "push", "push", "getMin", "pop", "getMin"], args: [[], [2], [1], [], [], []] },
    { ops: ["MinStack", "push", "top", "pop", "push", "top", "getMin"], args: [[], [3], [], [], [4], [], []] },
    { ops: ["MinStack", "push", "push", "push", "pop", "pop", "getMin"], args: [[], [0], [1], [0], [], [], []] },
    { ops: ["MinStack", "push", "push", "push", "getMin", "pop", "getMin", "pop", "getMin"], args: [[], [-1], [-1], [-1], [], [], [], [], []] },
    { ops: ["MinStack", "push", "push", "getMin"], args: [[], [2147483647], [-2147483648], []] },
    { ops: ["MinStack", "push", "push", "push", "push", "getMin", "pop", "getMin", "pop", "getMin", "pop", "getMin"], args: [[], [5], [4], [3], [2], [], [], [], [], [], [], []] },
    { ops: ["MinStack", "push", "push", "push", "push", "getMin", "pop", "getMin", "top"], args: [[], [1], [2], [3], [4], [], [], [], []] },
    { ops: ["MinStack", "push", "getMin", "push", "getMin", "push", "getMin", "top"], args: [[], [10], [], [-10], [], [10], [], []] },
    { ops: ["MinStack", "push", "pop", "push", "getMin"], args: [[], [-5], [], [7], []] },
    { ops: ["MinStack", "push", "push", "pop", "push", "getMin", "top"], args: [[], [3], [1], [], [2], [], []] },
    { ops: ["MinStack", "push", "push", "push", "top", "pop", "getMin", "pop", "getMin", "pop", "push", "top", "getMin", "push", "top", "getMin", "pop", "getMin"], args: [[], [2147483646], [2147483646], [2147483647], [], [], [], [], [], [], [2147483647], [], [], [-2147483648], [], [], [], []] },
    randomOps(30000, 1),
    randomOps(30000, 2),
  ],
  answer: {
    approach: [
      "Keep a second piece of information next to every value: the minimum of the stack at the moment that value was pushed.",
      "On push(val), store the pair (val, min(val, currentMin)).",
      "pop() removes the top pair. The new top pair already knows the minimum below it, so nothing needs recomputing.",
      "top() returns the value part and getMin() returns the minimum part of the top pair. Both are O(1).",
    ],
    time: "O(1) for every operation",
    space: "O(n)",
    javascript: `class MinStack {
    constructor() {
        this.stack = [];
    }
    push(val) {
        const min = this.stack.length ? Math.min(val, this.getMin()) : val;
        this.stack.push([val, min]);
    }
    pop() {
        this.stack.pop();
    }
    top() {
        return this.stack[this.stack.length - 1][0];
    }
    getMin() {
        return this.stack[this.stack.length - 1][1];
    }
}`,
    python: `class MinStack:
    def __init__(self):
        self.stack = []

    def push(self, val: int) -> None:
        cur = min(val, self.stack[-1][1]) if self.stack else val
        self.stack.append((val, cur))

    def pop(self) -> None:
        self.stack.pop()

    def top(self) -> int:
        return self.stack[-1][0]

    def getMin(self) -> int:
        return self.stack[-1][1]`,
  },
};
