import { rng, randInt } from "../gen.js";

function randomOps(count, seed) {
  const r = rng(seed);
  const ops = ["MyQueue"];
  const args = [[]];
  let size = 0;
  for (let i = 0; i < count; i++) {
    const roll = r();
    if (size === 0 || roll < 0.4) {
      ops.push("push");
      args.push([randInt(r, 1, 9)]);
      size++;
    } else if (roll < 0.65) {
      ops.push("pop");
      args.push([]);
      size--;
    } else if (roll < 0.85) {
      ops.push("peek");
      args.push([]);
    } else {
      ops.push("empty");
      args.push([]);
    }
  }
  return { ops, args };
}

export default {
  slug: "implement-queue-using-stacks",
  description: `Build a first-in-first-out (FIFO) **queue using only two stacks**.

Implement the \`MyQueue\` class:

- \`push(x)\` adds \`x\` to the back of the queue.
- \`pop()\` removes the element at the front of the queue and returns it.
- \`peek()\` returns the element at the front without removing it.
- \`empty()\` returns \`true\` if the queue is empty.

Only use standard stack operations: push to top, peek/pop from top, size and is-empty.

**How the input works:** \`ops\` lists the calls in order and \`args\` holds each call's arguments. The output lists each call's return value (\`null\` for calls that return nothing).`,
  examples: [
    {
      input: { ops: ["MyQueue", "push", "push", "peek", "pop", "empty"], args: [[], [1], [2], [], [], []] },
      explanation: "After pushing 1 and 2, the front is 1. pop returns 1, and the queue still holds 2, so empty is false.",
    },
    {
      input: { ops: ["MyQueue", "push", "pop", "empty"], args: [[], [5], [], []] },
      explanation: "Push then pop leaves the queue empty.",
    },
    {
      input: { ops: ["MyQueue", "push", "push", "push", "pop", "push", "pop", "pop", "pop"], args: [[], [1], [2], [3], [], [4], [], [], []] },
      explanation: "Elements always leave in the order they arrived: 1, 2, 3, 4.",
    },
  ],
  constraints: ["1 <= x <= 9", "At most 100 calls in the examples; tests go up to 2 * 10^4.", "pop and peek are only called on a non-empty queue."],
  followUp: "Can each operation run in amortized O(1) time?",
  harness: { type: "design", className: "MyQueue" },
  starter: {
    javascript: `class MyQueue {
    constructor() {

    }

    /**
     * @param {number} x
     * @return {void}
     */
    push(x) {

    }

    /**
     * @return {number}
     */
    pop() {

    }

    /**
     * @return {number}
     */
    peek() {

    }

    /**
     * @return {boolean}
     */
    empty() {

    }
}`,
    python: `class MyQueue:

    def __init__(self):


    def push(self, x: int) -> None:


    def pop(self) -> int:


    def peek(self) -> int:


    def empty(self) -> bool:
        `,
  },
  tests: [
    { ops: ["MyQueue", "empty"], args: [[], []] },
    { ops: ["MyQueue", "push", "peek"], args: [[], [9], []] },
    { ops: ["MyQueue", "push", "push", "pop", "pop", "empty"], args: [[], [1], [2], [], [], []] },
    { ops: ["MyQueue", "push", "push", "push", "peek", "pop", "peek"], args: [[], [3], [2], [1], [], [], []] },
    { ops: ["MyQueue", "push", "pop", "push", "pop", "push", "pop", "empty"], args: [[], [1], [], [2], [], [3], [], []] },
    { ops: ["MyQueue", "push", "push", "pop", "push", "push", "pop", "pop", "pop", "empty"], args: [[], [1], [2], [], [3], [4], [], [], [], []] },
    { ops: ["MyQueue", "push", "push", "push", "push", "pop", "pop", "pop", "pop"], args: [[], [4], [3], [2], [1], [], [], [], []] },
    { ops: ["MyQueue", "push", "peek", "push", "peek", "pop", "peek"], args: [[], [7], [], [8], [], [], []] },
    { ops: ["MyQueue", "push", "push", "empty", "pop", "empty", "pop", "empty"], args: [[], [5], [6], [], [], [], [], []] },
    { ops: ["MyQueue", "push", "push", "push", "pop", "push", "peek", "pop", "pop", "push", "pop"], args: [[], [1], [1], [2], [], [3], [], [], [], [9], []] },
    { ops: ["MyQueue", "push", "pop", "empty", "push", "push", "peek"], args: [[], [2], [], [], [4], [5], []] },
    { ops: ["MyQueue", "push", "push", "push", "push", "push", "pop", "pop", "push", "pop", "pop", "pop", "pop", "empty"], args: [[], [1], [2], [3], [4], [5], [], [], [6], [], [], [], [], []] },
    randomOps(20000, 1),
    randomOps(20000, 2),
  ],
  answer: {
    approach: [
      "Use an 'in' stack for pushes and an 'out' stack for pops and peeks.",
      "push(x) simply pushes onto 'in'.",
      "For pop or peek, if 'out' is empty, move every element from 'in' to 'out'. This reverses them, so the oldest element ends up on top of 'out'.",
      "Each element is moved at most once, so every operation is amortized O(1). empty() checks both stacks.",
    ],
    time: "Amortized O(1) per operation",
    space: "O(n)",
    javascript: `class MyQueue {
    constructor() {
        this.in = [];
        this.out = [];
    }
    push(x) {
        this.in.push(x);
    }
    move() {
        if (this.out.length === 0) {
            while (this.in.length) this.out.push(this.in.pop());
        }
    }
    pop() {
        this.move();
        return this.out.pop();
    }
    peek() {
        this.move();
        return this.out[this.out.length - 1];
    }
    empty() {
        return this.in.length === 0 && this.out.length === 0;
    }
}`,
    python: `class MyQueue:
    def __init__(self):
        self.inbox = []
        self.outbox = []

    def push(self, x: int) -> None:
        self.inbox.append(x)

    def _move(self):
        if not self.outbox:
            while self.inbox:
                self.outbox.append(self.inbox.pop())

    def pop(self) -> int:
        self._move()
        return self.outbox.pop()

    def peek(self) -> int:
        self._move()
        return self.outbox[-1]

    def empty(self) -> bool:
        return not self.inbox and not self.outbox`,
  },
};
