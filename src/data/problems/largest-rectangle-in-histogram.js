import { ints, range } from "../gen.js";

export default {
  slug: "largest-rectangle-in-histogram",
  description: `Given an array \`heights\` where each value is the height of a bar of width 1 in a histogram, return the **area of the largest rectangle** that fits entirely inside the histogram.`,
  examples: [
    { input: { heights: [2, 1, 5, 6, 2, 3] }, explanation: "The bars of height 5 and 6 form a rectangle of height 5 and width 2: area 10." },
    { input: { heights: [2, 4] }, explanation: "The single bar of height 4 gives area 4 (a height-2 rectangle across both bars also gives 4)." },
    { input: { heights: [1, 1, 1, 1] }, explanation: "One rectangle of height 1 across all four bars: area 4." },
  ],
  constraints: ["1 <= heights.length <= 10^5", "0 <= heights[i] <= 10^4"],
  harness: { fn: "largestRectangleArea", params: { heights: "int[]" }, returns: "int" },
  tests: [
    { heights: [0] },
    { heights: [7] },
    { heights: [0, 0] },
    { heights: [2, 1, 2] },
    { heights: [5, 4, 1, 2] },
    { heights: [1, 2, 3, 4, 5] },
    { heights: [5, 4, 3, 2, 1] },
    { heights: [4, 2, 0, 3, 2, 5] },
    { heights: [6, 2, 5, 4, 5, 1, 6] },
    { heights: [3, 6, 5, 7, 4, 8, 1, 0] },
    { heights: [10000, 10000] },
    { heights: [2, 1, 4, 5, 1, 3, 3] },
    { heights: ints(100000, 0, 10000, 1) },
    { heights: range(100000).map((i) => Math.floor(i / 10)) },
    { heights: new Array(100000).fill(10000) },
  ],
  answer: {
    approach: [
      "For each bar, the best rectangle using that bar's full height stretches left and right until it hits a shorter bar.",
      "Keep a stack of indices with increasing heights.",
      "When the current bar is shorter than the stack top, the top bar's rectangle ends here: pop it, and its width runs from the new stack top + 1 to the current index - 1.",
      "Add a 0-height bar at the end so every bar is popped and measured.",
    ],
    time: "O(n)",
    space: "O(n)",
    javascript: `function largestRectangleArea(heights) {
    const stack = [];
    let best = 0;
    for (let i = 0; i <= heights.length; i++) {
        const h = i === heights.length ? 0 : heights[i];
        while (stack.length && heights[stack[stack.length - 1]] > h) {
            const height = heights[stack.pop()];
            const left = stack.length ? stack[stack.length - 1] + 1 : 0;
            best = Math.max(best, height * (i - left));
        }
        stack.push(i);
    }
    return best;
}`,
    python: `class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        stack = []
        best = 0
        for i in range(len(heights) + 1):
            h = 0 if i == len(heights) else heights[i]
            while stack and heights[stack[-1]] > h:
                height = heights[stack.pop()]
                left = stack[-1] + 1 if stack else 0
                best = max(best, height * (i - left))
            stack.append(i)
        return best`,
  },
};
