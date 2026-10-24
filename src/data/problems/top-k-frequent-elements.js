import { shuffle } from "../gen.js";

// Value i appears (i + 1) times, so every frequency is different and the
// top-k answer is unique.
function big(distinct, k, seed) {
  const nums = [];
  for (let i = 0; i < distinct; i++) for (let c = 0; c <= i; c++) nums.push(i * 7 - 1000);
  return { nums: shuffle(nums, seed), k };
}

export default {
  slug: "top-k-frequent-elements",
  description: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` **most frequent** elements. You may return them in any order.

The input guarantees the answer is unique.`,
  examples: [
    { input: { nums: [1, 1, 1, 2, 2, 3], k: 2 }, explanation: "1 appears three times and 2 appears twice." },
    { input: { nums: [1], k: 1 }, explanation: "Only one element." },
    { input: { nums: [4, 4, 5, 5, 5, 6], k: 1 }, explanation: "5 is the most frequent." },
  ],
  constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4", "1 <= k <= number of distinct elements", "The answer is unique."],
  followUp: "Your algorithm should be better than O(n log n).",
  harness: { fn: "topKFrequent", params: { nums: "int[]", k: "int" }, returns: "int[]", compare: "unordered" },
  tests: [
    { nums: [1, 2], k: 2 },
    { nums: [-1, -1], k: 1 },
    { nums: [3, 0, 1, 0], k: 1 },
    { nums: [5, 3, 1, 1, 1, 3, 73, 1], k: 2 },
    { nums: [1, 2, 3, 4], k: 4 },
    { nums: [4, 1, -1, 2, -1, 2, 3], k: 2 },
    { nums: [7, 7, 7, 8, 8, 9], k: 3 },
    { nums: [0, 0, 0, 0], k: 1 },
    { nums: [2, 2, 3, 3, 3, 4, 4, 4, 4], k: 2 },
    { nums: [10000, -10000, 10000], k: 1 },
    { nums: [6, 6, 6, 5, 5, 4], k: 2 },
    { nums: [1, 1, 2, 2, 2, 3, 3, 3, 3, 9], k: 3 },
    big(440, 25, 1),
    big(300, 300, 2),
  ],
  answer: {
    approach: [
      "Count how often each value appears with a hash map.",
      "Bucket sort by frequency: make buckets[f] = list of values that appear f times (f is at most n).",
      "Walk the buckets from the highest frequency down, collecting values until you have k of them.",
      "A min-heap of size k also works in O(n log k).",
    ],
    time: "O(n)",
    space: "O(n)",
    javascript: `function topKFrequent(nums, k) {
    const count = new Map();
    for (const x of nums) count.set(x, (count.get(x) || 0) + 1);
    const buckets = Array.from({ length: nums.length + 1 }, () => []);
    for (const [x, c] of count) buckets[c].push(x);
    const out = [];
    for (let f = nums.length; f > 0 && out.length < k; f--) {
        for (const x of buckets[f]) {
            out.push(x);
            if (out.length === k) break;
        }
    }
    return out;
}`,
    python: `class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        count = Counter(nums)
        buckets = [[] for _ in range(len(nums) + 1)]
        for x, c in count.items():
            buckets[c].append(x)
        out = []
        for f in range(len(nums), 0, -1):
            for x in buckets[f]:
                out.append(x)
                if len(out) == k:
                    return out
        return out`,
  },
};
