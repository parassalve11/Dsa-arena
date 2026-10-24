import { ints, range, shuffle } from "../gen.js";

export default {
  slug: "longest-consecutive-sequence",
  description: `Given an unsorted array of integers \`nums\`, return the length of the **longest run of consecutive values** (like 4, 5, 6, 7) that can be formed from its elements. The values do not need to be next to each other in the array.

Your algorithm must run in **O(n)** time.`,
  examples: [
    { input: { nums: [100, 4, 200, 1, 3, 2] }, explanation: "The run 1, 2, 3, 4 has length 4." },
    { input: { nums: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1] }, explanation: "0 through 8 are all present, so the answer is 9." },
    { input: { nums: [1, 0, 1, 2] }, explanation: "Duplicates don't matter: 0, 1, 2 gives length 3." },
  ],
  constraints: ["0 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
  harness: { fn: "longestConsecutive", params: { nums: "int[]" }, returns: "int" },
  tests: [
    { nums: [] },
    { nums: [5] },
    { nums: [1, 1, 1] },
    { nums: [1, 3, 5] },
    { nums: [-1, 0, 1] },
    { nums: [10, 5, 12, 3, 55, 30, 4, 11, 2] },
    { nums: [9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6] },
    { nums: [-1000000000, 1000000000] },
    { nums: [2147483646, -2147483647, 0, 2, 2147483644, -2147483645, 2147483645] },
    { nums: [1, 2, 0, 1] },
    { nums: [7, 6, 5, 4, 3, 2, 1] },
    { nums: [0, -1, -2, 10, 11, 12, 13] },
    { nums: shuffle(range(100000, -50000), 3) },
    { nums: ints(100000, -1e9, 1e9, 4) },
    { nums: ints(100000, 0, 150000, 5) },
  ],
  answer: {
    approach: [
      "Put every number in a hash set for O(1) lookups.",
      "A number x starts a run only if x - 1 is not in the set.",
      "For each such start, count upwards (x + 1, x + 2, …) while the numbers exist.",
      "Each number is visited by at most one counting loop, so the total work is O(n).",
    ],
    time: "O(n)",
    space: "O(n)",
    javascript: `function longestConsecutive(nums) {
    const set = new Set(nums);
    let best = 0;
    for (const x of set) {
        if (set.has(x - 1)) continue;
        let len = 1;
        while (set.has(x + len)) len++;
        best = Math.max(best, len);
    }
    return best;
}`,
    python: `class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        s = set(nums)
        best = 0
        for x in s:
            if x - 1 not in s:
                length = 1
                while x + length in s:
                    length += 1
                best = max(best, length)
        return best`,
  },
};
