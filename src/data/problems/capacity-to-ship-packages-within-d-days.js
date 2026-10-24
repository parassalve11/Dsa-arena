import { ints } from "../gen.js";

export default {
  slug: "capacity-to-ship-packages-within-d-days",
  description: `A conveyor belt has packages that must be shipped from one port to another within \`days\` days.

The \`i\`-th package weighs \`weights[i]\`. Each day, the ship is loaded with packages **in the order they appear** on the belt, and the total load may not exceed the ship's **capacity**.

Return the **smallest capacity** that lets all packages be shipped within \`days\` days.`,
  examples: [
    { input: { weights: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], days: 5 }, explanation: "Capacity 15 works: [1..5], [6,7], [8], [9], [10]. Capacity 14 does not." },
    { input: { weights: [3, 2, 2, 4, 1, 4], days: 3 }, explanation: "Capacity 6: [3,2], [2,4], [1,4]." },
    { input: { weights: [1, 2, 3, 1, 1], days: 4 }, explanation: "Capacity 3: [1], [2], [3], [1,1]." },
  ],
  constraints: ["1 <= days <= weights.length <= 5 * 10^4", "1 <= weights[i] <= 500"],
  harness: { fn: "shipWithinDays", params: { weights: "int[]", days: "int" }, returns: "int" },
  tests: [
    { weights: [5], days: 1 },
    { weights: [1, 1], days: 1 },
    { weights: [1, 1], days: 2 },
    { weights: [10, 50, 100, 100, 50, 100, 100, 100], days: 5 },
    { weights: [500, 500, 500], days: 3 },
    { weights: [500, 500, 500], days: 1 },
    { weights: [1, 2, 3, 4, 5], days: 5 },
    { weights: [1, 2, 3, 4, 5], days: 1 },
    { weights: [7, 2, 5, 10, 8], days: 2 },
    { weights: [3, 3, 3, 3, 3, 3], days: 2 },
    { weights: [9, 1, 1, 1, 1, 9], days: 3 },
    { weights: [2, 3, 1, 4, 2, 5, 3, 3], days: 4 },
    { weights: ints(50000, 1, 500, 1), days: 1 },
    { weights: ints(50000, 1, 500, 2), days: 777 },
    { weights: ints(50000, 1, 500, 3), days: 50000 },
  ],
  answer: {
    approach: [
      "If a capacity works, any bigger capacity also works, so binary search on the capacity.",
      "The capacity must be at least max(weights) (the heaviest package must fit) and at most sum(weights) (everything in one day).",
      "For a candidate capacity, simulate greedily: keep loading the current day until the next package would overflow, then start a new day. Count the days.",
      "If the count is <= days, try a smaller capacity, otherwise a larger one.",
    ],
    time: "O(n log S), where S is the total weight",
    space: "O(1)",
    javascript: `function shipWithinDays(weights, days) {
    let lo = Math.max(...weights), hi = weights.reduce((a, b) => a + b, 0);
    const daysNeeded = (cap) => {
        let d = 1, load = 0;
        for (const w of weights) {
            if (load + w > cap) { d++; load = 0; }
            load += w;
        }
        return d;
    };
    while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (daysNeeded(mid) <= days) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
    python: `class Solution:
    def shipWithinDays(self, weights: List[int], days: int) -> int:
        def days_needed(cap):
            d, load = 1, 0
            for w in weights:
                if load + w > cap:
                    d += 1
                    load = 0
                load += w
            return d

        lo, hi = max(weights), sum(weights)
        while lo < hi:
            mid = (lo + hi) // 2
            if days_needed(mid) <= days:
                hi = mid
            else:
                lo = mid + 1
        return lo`,
  },
};
