import { ints } from "../gen.js";

export default {
  slug: "asteroid-collision",
  description: `You are given an array \`asteroids\` of integers representing asteroids in a row.

For each asteroid, the absolute value is its **size** and the sign is its **direction**: positive moves right, negative moves left. All asteroids move at the same speed.

When two asteroids meet, the **smaller one explodes**. If they are the same size, **both** explode. Two asteroids moving in the same direction never meet.

Return the state of the asteroids after all collisions.`,
  examples: [
    { input: { asteroids: [5, 10, -5] }, explanation: "10 and -5 collide and 10 survives. 5 and 10 never meet." },
    { input: { asteroids: [8, -8] }, explanation: "Same size, so both explode." },
    { input: { asteroids: [10, 2, -5] }, explanation: "2 and -5 collide, leaving -5. Then 10 and -5 collide, leaving 10." },
  ],
  constraints: ["2 <= asteroids.length <= 10^4", "-1000 <= asteroids[i] <= 1000", "asteroids[i] != 0"],
  harness: { fn: "asteroidCollision", params: { asteroids: "int[]" }, returns: "int[]" },
  tests: [
    { asteroids: [-2, -1, 1, 2] },
    { asteroids: [-2, 2] },
    { asteroids: [1, -1, 1, -1] },
    { asteroids: [1, -2, -2, -2] },
    { asteroids: [-2, -2, 1, -2] },
    { asteroids: [5, 5, 5, -6] },
    { asteroids: [1, 2, 3, -3] },
    { asteroids: [10, -1, -2, -3, -10] },
    { asteroids: [-1000, 1000] },
    { asteroids: [3, 5, -6, 2, -1, 4] },
    { asteroids: [1, 1, 1, 1] },
    { asteroids: [7, -3, 9, -9, 4, -8] },
    { asteroids: ints(10000, -1000, 1000, 1).map((x) => x || 1) },
    { asteroids: [...new Array(5000).fill(1), -1000, ...new Array(4999).fill(-1)] },
  ],
  answer: {
    approach: [
      "Process asteroids left to right with a stack of survivors.",
      "A collision only happens when the stack top moves right (positive) and the new asteroid moves left (negative).",
      "While that is the case, compare sizes: if the top is smaller, pop it and keep going; if equal, pop it and the new one also dies; if the top is bigger, the new one dies.",
      "If the new asteroid survives all collisions, push it.",
    ],
    time: "O(n)",
    space: "O(n)",
    javascript: `function asteroidCollision(asteroids) {
    const stack = [];
    for (const a of asteroids) {
        let alive = true;
        while (alive && a < 0 && stack.length && stack[stack.length - 1] > 0) {
            const top = stack[stack.length - 1];
            if (top < -a) stack.pop();
            else {
                if (top === -a) stack.pop();
                alive = false;
            }
        }
        if (alive) stack.push(a);
    }
    return stack;
}`,
    python: `class Solution:
    def asteroidCollision(self, asteroids: List[int]) -> List[int]:
        stack = []
        for a in asteroids:
            alive = True
            while alive and a < 0 and stack and stack[-1] > 0:
                top = stack[-1]
                if top < -a:
                    stack.pop()
                else:
                    if top == -a:
                        stack.pop()
                    alive = False
            if alive:
                stack.append(a)
        return stack`,
  },
};
