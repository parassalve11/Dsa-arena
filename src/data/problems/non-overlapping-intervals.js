import { rng, randInt } from "../gen.js";

function big(n, maxLen, seed) {
  const r = rng(seed);
  return {
    intervals: Array.from({ length: n }, () => {
      const a = randInt(r, -50000, 50000);
      return [a, a + randInt(r, 1, maxLen)];
    }),
  };
}

export default {
  slug: "non-overlapping-intervals",
  description: `Given an array of \`intervals\` where \`intervals[i] = [start, end]\`, return the **minimum number of intervals you must remove** so that the rest do not overlap.

Intervals that only touch at a point, like \`[1,2]\` and \`[2,3]\`, do **not** overlap.`,
  examples: [
    { input: { intervals: [[1, 2], [2, 3], [3, 4], [1, 3]] }, explanation: "Remove [1,3] and the rest don't overlap." },
    { input: { intervals: [[1, 2], [1, 2], [1, 2]] }, explanation: "Keep one copy and remove the other two." },
    { input: { intervals: [[1, 2], [2, 3]] }, explanation: "They only touch, so nothing needs removing." },
  ],
  constraints: ["1 <= intervals.length <= 10^5", "-5 * 10^4 <= start < end <= 5 * 10^4"],
  harness: { fn: "eraseOverlapIntervals", params: { intervals: "int[][]" }, returns: "int" },
  tests: [
    { intervals: [[0, 1]] },
    { intervals: [[1, 100], [11, 22], [1, 11], [2, 12]] },
    { intervals: [[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]] },
    { intervals: [[-52, 31], [-73, -26], [82, 97], [-65, -11], [-62, -49], [95, 99], [58, 95], [-31, 49], [66, 98], [-63, 2], [30, 47], [-40, -26]] },
    { intervals: [[1, 5], [2, 3], [3, 4]] },
    { intervals: [[1, 2], [3, 4], [5, 6]] },
    { intervals: [[-50000, 50000], [0, 1], [1, 2]] },
    { intervals: [[1, 3], [1, 3], [2, 4], [3, 5]] },
    { intervals: [[5, 6], [1, 2], [3, 4], [2, 3]] },
    { intervals: [[1, 10], [2, 9], [3, 8], [4, 7]] },
    { intervals: [[0, 5], [5, 10], [3, 7]] },
    { intervals: [[2, 3], [2, 3], [2, 4], [3, 4]] },
    big(100000, 100, 1),
    big(100000, 5000, 2),
  ],
  answer: {
    approach: [
      "Greedy: to keep as many intervals as possible, always keep the one that ends earliest. It leaves the most room for the rest.",
      "Sort the intervals by their end.",
      "Walk through them, remembering the end of the last kept interval. If the next one starts at or after that end, keep it and update the end. Otherwise it overlaps: count it as removed.",
      "Return the number removed.",
    ],
    time: "O(n log n)",
    space: "O(1) besides sorting",
    javascript: `function eraseOverlapIntervals(intervals) {
    intervals.sort((a, b) => a[1] - b[1]);
    let end = -Infinity, removed = 0;
    for (const [s, e] of intervals) {
        if (s >= end) end = e;
        else removed++;
    }
    return removed;
}`,
    python: `class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        intervals.sort(key=lambda x: x[1])
        end = float('-inf')
        removed = 0
        for s, e in intervals:
            if s >= end:
                end = e
            else:
                removed += 1
        return removed`,
  },
};
