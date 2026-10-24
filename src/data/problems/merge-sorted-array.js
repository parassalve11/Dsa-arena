import { sortedInts } from "../gen.js";

function big(m, n, seed) {
  const a = sortedInts(m, -1e9, 1e9, seed);
  const b = sortedInts(n, -1e9, 1e9, seed + 100);
  return { nums1: [...a, ...new Array(n).fill(0)], m, nums2: b, n };
}

export default {
  slug: "merge-sorted-array",
  description: `You get two arrays sorted in non-decreasing order, \`nums1\` and \`nums2\`, and two integers \`m\` and \`n\`: the number of real elements in each.

\`nums1\` has length \`m + n\`. Its first \`m\` slots hold real values and the last \`n\` slots are \`0\` placeholders to make room.

Merge \`nums2\` into \`nums1\` **in place** so that \`nums1\` becomes one sorted array. Do not return anything.`,
  examples: [
    { input: { nums1: [1, 2, 3, 0, 0, 0], m: 3, nums2: [2, 5, 6], n: 3 }, explanation: "Merging [1,2,3] and [2,5,6] gives [1,2,2,3,5,6]." },
    { input: { nums1: [1], m: 1, nums2: [], n: 0 }, explanation: "There is nothing to merge." },
    { input: { nums1: [0], m: 0, nums2: [1], n: 1 }, explanation: "nums1 has no real values, so the result is just nums2." },
  ],
  constraints: ["nums1.length == m + n", "nums2.length == n", "0 <= m, n <= 200", "1 <= m + n <= 200", "-10^9 <= nums1[i], nums2[j] <= 10^9"],
  followUp: "Can you do it in O(m + n) time without extra space?",
  harness: { fn: "merge", params: { nums1: "int[]", m: "int", nums2: "int[]", n: "int" }, inplace: "nums1" },
  tests: [
    { nums1: [2, 0], m: 1, nums2: [1], n: 1 },
    { nums1: [4, 5, 6, 0, 0, 0], m: 3, nums2: [1, 2, 3], n: 3 },
    { nums1: [1, 2, 3, 0, 0, 0], m: 3, nums2: [4, 5, 6], n: 3 },
    { nums1: [1, 1, 1, 0, 0], m: 3, nums2: [1, 1], n: 2 },
    { nums1: [-5, 0, 7, 0, 0, 0, 0], m: 3, nums2: [-6, -5, 3, 10], n: 4 },
    { nums1: [0, 0, 0], m: 0, nums2: [-1, 0, 1], n: 3 },
    { nums1: [1, 3, 5, 7, 0, 0, 0, 0], m: 4, nums2: [2, 4, 6, 8], n: 4 },
    { nums1: [2, 2, 0, 0], m: 2, nums2: [1, 3], n: 2 },
    { nums1: [-1000000000, 1000000000, 0], m: 2, nums2: [0], n: 1 },
    { nums1: [5, 0], m: 1, nums2: [5], n: 1 },
    { nums1: [1, 2, 4, 5, 6, 0], m: 5, nums2: [3], n: 1 },
    { nums1: [10, 20, 30, 0, 0, 0, 0, 0], m: 3, nums2: [1, 2, 3, 4, 5], n: 5 },
    big(100, 100, 1),
    big(150, 50, 2),
  ],
  answer: {
    approach: [
      "Fill nums1 from the back, because the empty slots are at the end.",
      "Use three pointers: i at the last real element of nums1, j at the last element of nums2, and k at the last slot of nums1.",
      "Put the larger of nums1[i] and nums2[j] at position k, then move that pointer and k left.",
      "When nums2 is used up you are done. Whatever is left in nums1 is already in place.",
    ],
    time: "O(m + n)",
    space: "O(1)",
    javascript: `function merge(nums1, m, nums2, n) {
    let i = m - 1, j = n - 1, k = m + n - 1;
    while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
        else nums1[k--] = nums2[j--];
    }
}`,
    python: `class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        i, j, k = m - 1, n - 1, m + n - 1
        while j >= 0:
            if i >= 0 and nums1[i] > nums2[j]:
                nums1[k] = nums1[i]
                i -= 1
            else:
                nums1[k] = nums2[j]
                j -= 1
            k -= 1`,
  },
};
