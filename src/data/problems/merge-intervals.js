import { rng, randInt } from "../gen.js";

function big(n, seed) {
  const r = rng(seed);
  return {
    intervals: Array.from({ length: n }, () => {
      const a = randInt(r, 0, 1000000);
      return [a, a + randInt(r, 0, 30)];
    }),
  };
}

export default {
  slug: "merge-intervals",
  description: `You are given an array of \`intervals\` where \`intervals[i] = [start, end]\`.

Merge every group of **overlapping** intervals and return the resulting non-overlapping intervals that cover exactly the same ranges. Two intervals that only touch (like \`[1,4]\` and \`[4,5]\`) also count as overlapping.

The output may be in any order.`,
  examples: [
    { input: { intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] }, explanation: "[1,3] and [2,6] overlap, so they merge into [1,6]." },
    { input: { intervals: [[1, 4], [4, 5]] }, explanation: "They touch at 4, so they merge into [1,5]." },
    { input: { intervals: [[4, 7], [1, 4]] }, explanation: "Input is not sorted. After sorting, [1,4] and [4,7] merge into [1,7]." },
  ],
  constraints: ["1 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= start <= end <= 10^4 (large tests go higher)"],
  harness: { fn: "merge", params: { intervals: "int[][]" }, returns: "int[][]", compare: "unordered" },
  tests: [
    { intervals: [[1, 1]] },
    { intervals: [[1, 4], [0, 4]] },
    { intervals: [[1, 4], [2, 3]] },
    { intervals: [[1, 4], [0, 0]] },
    { intervals: [[1, 4], [5, 6]] },
    { intervals: [[2, 3], [4, 5], [6, 7], [8, 9], [1, 10]] },
    { intervals: [[1, 3], [3, 5], [5, 7]] },
    { intervals: [[0, 0], [0, 0], [0, 0]] },
    { intervals: [[5, 10], [1, 2], [3, 4], [9, 12]] },
    { intervals: [[1, 10], [2, 3], [4, 5], [11, 12]] },
    { intervals: [[0, 10000], [10000, 10000]] },
    { intervals: [[6, 8], [1, 9], [2, 4], [4, 7]] },
    { intervals: [[1, 2], [3, 4], [5, 6]] },
    big(10000, 3),
    big(10000, 4),
  ],
  answer: {
    approach: [
      "Sort the intervals by their start value.",
      "Walk through them, keeping the last merged interval.",
      "If the next interval starts at or before the end of the last merged one, they overlap: extend the end to the larger of the two ends.",
      "Otherwise the next interval starts a new group, so push it to the result.",
    ],
    time: "O(n log n)",
    space: "O(n) for the output",
    javascript: `function merge(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    const out = [];
    for (const [s, e] of intervals) {
        const last = out[out.length - 1];
        if (last && s <= last[1]) last[1] = Math.max(last[1], e);
        else out.push([s, e]);
    }
    return out;
}`,
    python: `class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        intervals.sort(key=lambda x: x[0])
        out = []
        for s, e in intervals:
            if out and s <= out[-1][1]:
                out[-1][1] = max(out[-1][1], e)
            else:
                out.append([s, e])
        return out`,
  },
};
