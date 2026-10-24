import { sortedInts } from "../gen.js";

export default {
  slug: "median-of-two-sorted-arrays",
  description: `Given two sorted arrays \`nums1\` and \`nums2\` of sizes \`m\` and \`n\`, return the **median** of the two arrays combined.

The median is the middle value of the merged sorted list. If the merged list has an even length, it is the average of the two middle values.

The overall run time should be **O(log(m + n))**. Answers within 10^-5 of the expected value are accepted.`,
  examples: [
    { input: { nums1: [1, 3], nums2: [2] }, explanation: "Merged: [1,2,3]. The median is 2." },
    { input: { nums1: [1, 2], nums2: [3, 4] }, explanation: "Merged: [1,2,3,4]. The median is (2 + 3) / 2 = 2.5." },
    { input: { nums1: [], nums2: [7] }, explanation: "Only one value, so it is the median." },
  ],
  constraints: ["nums1.length == m, nums2.length == n", "0 <= m, n <= 1000", "1 <= m + n <= 2000", "-10^6 <= nums1[i], nums2[i] <= 10^6"],
  harness: { fn: "findMedianSortedArrays", params: { nums1: "int[]", nums2: "int[]" }, returns: "float", compare: "float" },
  tests: [
    { nums1: [1], nums2: [] },
    { nums1: [], nums2: [2, 3] },
    { nums1: [0, 0], nums2: [0, 0] },
    { nums1: [1, 2, 3], nums2: [4, 5, 6] },
    { nums1: [4, 5, 6], nums2: [1, 2, 3] },
    { nums1: [1, 3, 5, 7], nums2: [2, 4, 6] },
    { nums1: [1], nums2: [2, 3, 4, 5, 6] },
    { nums1: [-1000000, 1000000], nums2: [0] },
    { nums1: [1, 1, 1], nums2: [1, 1, 1] },
    { nums1: [2], nums2: [1, 3, 4] },
    { nums1: [-5, -3, -1], nums2: [-4, -2] },
    { nums1: [100], nums2: [101] },
    { nums1: sortedInts(1000, -1000000, 1000000, 1), nums2: sortedInts(1000, -1000000, 1000000, 2) },
    { nums1: sortedInts(999, -1000000, 1000000, 3), nums2: sortedInts(1000, -1000000, 1000000, 4) },
    { nums1: [], nums2: sortedInts(1000, -1000000, 1000000, 5) },
  ],
  answer: {
    approach: [
      "Binary search on the shorter array for a cut point i, and put a matching cut j = (m + n + 1) / 2 - i in the other array, so the left side always holds half of all elements.",
      "The cut is correct when every value on the left is <= every value on the right: nums1[i-1] <= nums2[j] and nums2[j-1] <= nums1[i]. Missing neighbours count as -∞ / +∞.",
      "If nums1[i-1] is too big, move the cut left. If nums2[j-1] is too big, move it right.",
      "At the correct cut, the median is max(left side) for an odd total, or the average of max(left) and min(right) for an even total.",
    ],
    time: "O(log(min(m, n)))",
    space: "O(1)",
    javascript: `function findMedianSortedArrays(nums1, nums2) {
    if (nums1.length > nums2.length) [nums1, nums2] = [nums2, nums1];
    const m = nums1.length, n = nums2.length, half = (m + n + 1) >> 1;
    let lo = 0, hi = m;
    while (lo <= hi) {
        const i = (lo + hi) >> 1, j = half - i;
        const aLeft = i > 0 ? nums1[i - 1] : -Infinity;
        const aRight = i < m ? nums1[i] : Infinity;
        const bLeft = j > 0 ? nums2[j - 1] : -Infinity;
        const bRight = j < n ? nums2[j] : Infinity;
        if (aLeft <= bRight && bLeft <= aRight) {
            if ((m + n) % 2) return Math.max(aLeft, bLeft);
            return (Math.max(aLeft, bLeft) + Math.min(aRight, bRight)) / 2;
        }
        if (aLeft > bRight) hi = i - 1;
        else lo = i + 1;
    }
    return 0;
}`,
    python: `class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
        m, n = len(nums1), len(nums2)
        half = (m + n + 1) // 2
        lo, hi = 0, m
        while lo <= hi:
            i = (lo + hi) // 2
            j = half - i
            a_left = nums1[i - 1] if i > 0 else float('-inf')
            a_right = nums1[i] if i < m else float('inf')
            b_left = nums2[j - 1] if j > 0 else float('-inf')
            b_right = nums2[j] if j < n else float('inf')
            if a_left <= b_right and b_left <= a_right:
                if (m + n) % 2:
                    return float(max(a_left, b_left))
                return (max(a_left, b_left) + min(a_right, b_right)) / 2
            if a_left > b_right:
                hi = i - 1
            else:
                lo = i + 1
        return 0.0`,
  },
};
