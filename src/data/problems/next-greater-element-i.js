import { distinctInts, shuffle } from "../gen.js";

const nums2 = distinctInts(1000, 0, 10000, 3);
const nums1 = shuffle(nums2, 4).slice(0, 600);

export default {
  slug: "next-greater-element-i",
  description: `The **next greater element** of a value \`x\` in an array is the first element to the **right** of \`x\` that is **larger** than \`x\`.

You are given two arrays of distinct integers, \`nums1\` and \`nums2\`, where every value of \`nums1\` also appears in \`nums2\`.

For each \`nums1[i]\`, find where it sits in \`nums2\` and return the next greater element there, or \`-1\` if there is none. Return the answers as an array.`,
  examples: [
    { input: { nums1: [4, 1, 2], nums2: [1, 3, 4, 2] }, explanation: "4 has nothing larger to its right (-1). 1 is followed by 3. 2 is the last element (-1)." },
    { input: { nums1: [2, 4], nums2: [1, 2, 3, 4] }, explanation: "2 is followed by 3. 4 is last, so -1." },
    { input: { nums1: [1], nums2: [1] }, explanation: "Nothing comes after 1." },
  ],
  constraints: ["1 <= nums1.length <= nums2.length <= 1000", "0 <= nums1[i], nums2[i] <= 10^4", "All values in nums1 and in nums2 are unique.", "Every value of nums1 appears in nums2."],
  followUp: "Can you find an O(nums1.length + nums2.length) solution?",
  harness: { fn: "nextGreaterElement", params: { nums1: "int[]", nums2: "int[]" }, returns: "int[]" },
  tests: [
    { nums1: [1], nums2: [1, 2] },
    { nums1: [2], nums2: [1, 2] },
    { nums1: [3, 1], nums2: [1, 2, 3] },
    { nums1: [5, 4, 3], nums2: [5, 4, 3, 2, 1] },
    { nums1: [1, 2, 3], nums2: [1, 2, 3, 4] },
    { nums1: [1, 3, 5, 2, 4], nums2: [6, 5, 4, 3, 2, 1, 7] },
    { nums1: [2, 1], nums2: [2, 0, 1, 5] },
    { nums1: [0], nums2: [10000, 0] },
    { nums1: [4, 2], nums2: [3, 4, 1, 2, 5] },
    { nums1: [137, 59, 92], nums2: [59, 137, 92, 200] },
    { nums1: [8, 6, 9], nums2: [9, 8, 7, 6, 10] },
    { nums1: [1, 7, 3], nums2: [3, 1, 2, 7, 4] },
    { nums1, nums2 },
    { nums1: nums2.slice().reverse(), nums2: nums2.slice().sort((a, b) => a - b) },
  ],
  answer: {
    approach: [
      "Compute the next greater element for every value of nums2 once, using a monotonic stack.",
      "Scan nums2 from left to right. While the stack top is smaller than the current number, the current number is that top's next greater element: record it in a map and pop.",
      "Push the current number. Anything left on the stack at the end has no next greater element.",
      "Answer each nums1 value with a map lookup (default -1).",
    ],
    time: "O(n + m)",
    space: "O(m)",
    javascript: `function nextGreaterElement(nums1, nums2) {
    const next = new Map();
    const stack = [];
    for (const x of nums2) {
        while (stack.length && stack[stack.length - 1] < x) next.set(stack.pop(), x);
        stack.push(x);
    }
    return nums1.map((x) => (next.has(x) ? next.get(x) : -1));
}`,
    python: `class Solution:
    def nextGreaterElement(self, nums1: List[int], nums2: List[int]) -> List[int]:
        nxt = {}
        stack = []
        for x in nums2:
            while stack and stack[-1] < x:
                nxt[stack.pop()] = x
            stack.append(x)
        return [nxt.get(x, -1) for x in nums1]`,
  },
};
