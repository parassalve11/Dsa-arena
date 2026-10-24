import { ints } from "../gen.js";

export default {
  slug: "daily-temperatures",
  description: `Given an array \`temperatures\` of daily temperatures, return an array \`answer\` where \`answer[i]\` is the **number of days you must wait** after day \`i\` to get a **warmer** temperature.

If no future day is warmer, \`answer[i]\` is \`0\`.`,
  examples: [
    { input: { temperatures: [73, 74, 75, 71, 69, 72, 76, 73] }, explanation: "Day 0 (73) waits 1 day for 74. Day 2 (75) waits 4 days for 76. Day 6 (76) and day 7 never see a warmer day." },
    { input: { temperatures: [30, 40, 50, 60] }, explanation: "Every day is followed immediately by a warmer one, except the last." },
    { input: { temperatures: [30, 60, 90] }, explanation: "Result: [1,1,0]." },
  ],
  constraints: ["1 <= temperatures.length <= 10^5", "30 <= temperatures[i] <= 100"],
  harness: { fn: "dailyTemperatures", params: { temperatures: "int[]" }, returns: "int[]" },
  tests: [
    { temperatures: [50] },
    { temperatures: [50, 50] },
    { temperatures: [100, 30] },
    { temperatures: [30, 100] },
    { temperatures: [90, 80, 70, 60] },
    { temperatures: [55, 38, 53, 81, 61, 93, 97, 32, 43, 78] },
    { temperatures: [34, 80, 80, 34, 34, 80, 80, 80, 80, 34] },
    { temperatures: [89, 62, 70, 58, 47, 47, 46, 76, 100, 70] },
    { temperatures: [30, 30, 30, 31] },
    { temperatures: [70, 71, 70, 71, 70, 71] },
    { temperatures: [40, 35, 32, 37, 50] },
    { temperatures: [100, 99, 98, 97, 96, 95, 101] },
    { temperatures: ints(100000, 30, 100, 1) },
    { temperatures: Array.from({ length: 100000 }, (_, i) => (i === 99999 ? 100 : 99 - (i % 2))) },
  ],
  answer: {
    approach: [
      "Keep a stack of indices of days that are still waiting for a warmer day. Their temperatures decrease from bottom to top.",
      "For each day i, while the day on top of the stack is colder than today, today is its answer: set answer[top] = i - top and pop.",
      "Then push i onto the stack.",
      "Days left on the stack at the end never get a warmer day, so they keep 0.",
    ],
    time: "O(n)",
    space: "O(n)",
    javascript: `function dailyTemperatures(temperatures) {
    const ans = new Array(temperatures.length).fill(0);
    const stack = [];
    for (let i = 0; i < temperatures.length; i++) {
        while (stack.length && temperatures[stack[stack.length - 1]] < temperatures[i]) {
            const j = stack.pop();
            ans[j] = i - j;
        }
        stack.push(i);
    }
    return ans;
}`,
    python: `class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        ans = [0] * len(temperatures)
        stack = []
        for i, t in enumerate(temperatures):
            while stack and temperatures[stack[-1]] < t:
                j = stack.pop()
                ans[j] = i - j
            stack.append(i)
        return ans`,
  },
};
