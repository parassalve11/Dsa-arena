import { ints } from "../gen.js";

export default {
  slug: "sliding-window-maximum",
  description: `You are given an integer array \`nums\` and a window size \`k\`. A window of size \`k\` starts at the left of the array and slides right one position at a time, until it reaches the end.

Return an array holding the **maximum value of each window**, in order.`,
  examples: [
    { input: { nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 }, explanation: "Windows: [1,3,-1]→3, [3,-1,-3]→3, [-1,-3,5]→5, [-3,5,3]→5, [5,3,6]→6, [3,6,7]→7." },
    { input: { nums: [1], k: 1 }, explanation: "One window with one element." },
    { input: { nums: [9, 8, 7, 6], k: 2 }, explanation: "Each window's max is its left element: [9,8,7]." },
  ],
  constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4", "1 <= k <= nums.length"],
  harness: { fn: "maxSlidingWindow", params: { nums: "int[]", k: "int" }, returns: "int[]" },
  tests: [
    { nums: [1, -1], k: 1 },
    { nums: [7, 2, 4], k: 2 },
    { nums: [1, 2, 3, 4, 5], k: 5 },
    { nums: [5, 4, 3, 2, 1], k: 3 },
    { nums: [1, 3, 1, 2, 0, 5], k: 3 },
    { nums: [4, 4, 4, 4], k: 2 },
    { nums: [-7, -8, 7, 5, 7, 1, 6, 0], k: 4 },
    { nums: [10000, -10000, 10000, -10000], k: 2 },
    { nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 1 },
    { nums: [2, 1, 3, 4, 6, 3, 8, 9, 10, 12, 56], k: 4 },
    { nums: [9, 10, 9, -7, -4, -8, 2, -6], k: 5 },
    { nums: [0, 0, 1, 0, 0], k: 3 },
    { nums: ints(100000, -10000, 10000, 1), k: 1000 },
    { nums: Array.from({ length: 100000 }, (_, i) => 10000 - (i % 20001)), k: 50000 },
  ],
  answer: {
    approach: [
      "Keep a deque of indices whose values are in decreasing order. The front is always the max of the current window.",
      "Before adding index i, pop from the back every index whose value is <= nums[i]. Those can never be a maximum again, because nums[i] is larger and stays longer.",
      "Pop the front if it has slid out of the window (index <= i - k).",
      "Once the first full window is reached, record nums[front] for every step.",
    ],
    time: "O(n): each index is pushed and popped once",
    space: "O(k)",
    javascript: `function maxSlidingWindow(nums, k) {
    const dq = [];
    let head = 0;
    const out = [];
    for (let i = 0; i < nums.length; i++) {
        while (dq.length > head && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
        dq.push(i);
        if (dq[head] <= i - k) head++;
        if (i >= k - 1) out.push(nums[dq[head]]);
    }
    return out;
}`,
    python: `class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        dq = deque()
        out = []
        for i, x in enumerate(nums):
            while dq and nums[dq[-1]] <= x:
                dq.pop()
            dq.append(i)
            if dq[0] <= i - k:
                dq.popleft()
            if i >= k - 1:
                out.append(nums[dq[0]])
        return out`,
  },
};
