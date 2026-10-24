import { ints } from "../gen.js";

export default {
  slug: "koko-eating-bananas",
  description: `Koko has \`n\` piles of bananas; pile \`i\` has \`piles[i]\` bananas. The guards will be back in \`h\` hours.

Koko picks an eating speed of \`k\` bananas per hour. Each hour she chooses one pile and eats \`k\` bananas from it. If the pile has fewer than \`k\` bananas, she eats all of them and does not eat any more during that hour.

Return the **smallest integer \`k\`** that lets her finish every pile within \`h\` hours.`,
  examples: [
    { input: { piles: [3, 6, 7, 11], h: 8 }, explanation: "At speed 4 she needs 1 + 2 + 2 + 3 = 8 hours. Speed 3 would need 10." },
    { input: { piles: [30, 11, 23, 4, 20], h: 5 }, explanation: "With 5 piles and 5 hours she must clear the largest pile in one hour, so k = 30." },
    { input: { piles: [30, 11, 23, 4, 20], h: 6 }, explanation: "Speed 23 needs 2 + 1 + 1 + 1 + 1 = 6 hours." },
  ],
  constraints: ["1 <= piles.length <= 10^4", "piles.length <= h <= 10^9", "1 <= piles[i] <= 10^9"],
  harness: { fn: "minEatingSpeed", params: { piles: "int[]", h: "int" }, returns: "int" },
  tests: [
    { piles: [1], h: 1 },
    { piles: [1000000000], h: 2 },
    { piles: [1000000000], h: 1000000000 },
    { piles: [1, 1, 1, 1], h: 4 },
    { piles: [2, 2], h: 3 },
    { piles: [312884470], h: 312884469 },
    { piles: [5, 10, 15], h: 30 },
    { piles: [9, 9, 9], h: 4 },
    { piles: [7, 3, 9, 1], h: 7 },
    { piles: [332484035, 524908576, 855865114, 632922376, 222257295, 690155293, 112677673, 679580077, 337406589, 290818316, 877337160, 901728858, 679284947, 688210097, 692137887, 718203285, 629455728, 941802184], h: 823855818 },
    { piles: [100, 1], h: 2 },
    { piles: [4, 4, 4, 4, 4], h: 10 },
    { piles: ints(10000, 1, 1000000000, 1), h: 1000000000 },
    { piles: ints(10000, 1, 1000000000, 2), h: 10000 },
    { piles: ints(10000, 1, 1000, 3), h: 123456 },
  ],
  answer: {
    approach: [
      "If Koko can finish at speed k, she can also finish at any faster speed. So binary search on k.",
      "The answer lies in [1, max(piles)]. At speed max(piles), every pile takes one hour.",
      "For a candidate k, the hours needed are the sum of ceil(pile / k). If that is <= h, k works, so try smaller. Otherwise try larger.",
      "The smallest working k is the answer.",
    ],
    time: "O(n log M), where M is the largest pile",
    space: "O(1)",
    javascript: `function minEatingSpeed(piles, h) {
    let lo = 1, hi = Math.max(...piles);
    while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        let hours = 0;
        for (const p of piles) hours += Math.ceil(p / mid);
        if (hours <= h) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
    python: `class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        lo, hi = 1, max(piles)
        while lo < hi:
            mid = (lo + hi) // 2
            hours = sum((p + mid - 1) // mid for p in piles)
            if hours <= h:
                hi = mid
            else:
                lo = mid + 1
        return lo`,
  },
};
