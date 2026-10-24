import { ints } from "../gen.js";

export default {
  slug: "last-stone-weight",
  description: `You are given an array \`stones\` where \`stones[i]\` is the weight of the \`i\`-th stone.

Each turn, take the **two heaviest** stones and smash them together. Say their weights are \`x <= y\`:

- If \`x == y\`, both stones are destroyed.
- If \`x != y\`, the stone of weight \`x\` is destroyed and the other becomes \`y - x\`.

When at most one stone is left, return its weight, or \`0\` if no stones are left.`,
  examples: [
    { input: { stones: [2, 7, 4, 1, 8, 1] }, explanation: "8 and 7 → 1. Then 4 and 2 → 2. Then 2 and 1 → 1. Then 1 and 1 → 0. One stone of weight 1 is left." },
    { input: { stones: [1] }, explanation: "Only one stone, so nothing happens." },
    { input: { stones: [3, 3] }, explanation: "Both stones are destroyed, so the answer is 0." },
  ],
  constraints: ["1 <= stones.length <= 30 (tests go higher)", "1 <= stones[i] <= 1000"],
  harness: { fn: "lastStoneWeight", params: { stones: "int[]" }, returns: "int" },
  tests: [
    { stones: [5] },
    { stones: [1, 3] },
    { stones: [10, 4] },
    { stones: [2, 2, 2] },
    { stones: [1, 1, 1, 1] },
    { stones: [9, 3, 2, 10] },
    { stones: [1000, 1, 1000] },
    { stones: [7, 6, 7, 6, 9] },
    { stones: [31, 26, 33, 21, 40] },
    { stones: [3, 7, 2] },
    { stones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { stones: [8, 10, 4] },
    { stones: ints(10000, 1, 1000, 1) },
    { stones: ints(9999, 1, 1000, 2) },
  ],
  answer: {
    approach: [
      "Always needing the two largest values is exactly what a max-heap is for.",
      "Push every stone into a max-heap.",
      "While the heap has at least two stones, pop the two largest. If they differ, push back their difference.",
      "Return the remaining stone, or 0 if the heap is empty. (Python's heapq is a min-heap, so store negated weights.)",
    ],
    time: "O(n log n)",
    space: "O(n)",
    javascript: `function lastStoneWeight(stones) {
    // Small binary max-heap.
    const heap = [];
    const push = (x) => {
        heap.push(x);
        let i = heap.length - 1;
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (heap[p] >= heap[i]) break;
            [heap[p], heap[i]] = [heap[i], heap[p]];
            i = p;
        }
    };
    const pop = () => {
        const top = heap[0], last = heap.pop();
        if (heap.length) {
            heap[0] = last;
            let i = 0;
            while (true) {
                const l = 2 * i + 1, r = l + 1;
                let m = i;
                if (l < heap.length && heap[l] > heap[m]) m = l;
                if (r < heap.length && heap[r] > heap[m]) m = r;
                if (m === i) break;
                [heap[m], heap[i]] = [heap[i], heap[m]];
                i = m;
            }
        }
        return top;
    };
    for (const s of stones) push(s);
    while (heap.length > 1) {
        const y = pop(), x = pop();
        if (y !== x) push(y - x);
    }
    return heap.length ? heap[0] : 0;
}`,
    python: `class Solution:
    def lastStoneWeight(self, stones: List[int]) -> int:
        heap = [-s for s in stones]
        heapify(heap)
        while len(heap) > 1:
            y = -heappop(heap)
            x = -heappop(heap)
            if y != x:
                heappush(heap, -(y - x))
        return -heap[0] if heap else 0`,
  },
};
