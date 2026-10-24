import { distinctInts, rng } from "../gen.js";

// |x| values are distinct and y = 1, so every distance is different and the
// k closest points are unique.
function big(n, k, seed) {
  const r = rng(seed);
  return { points: distinctInts(n, 0, 10000, seed).map((x) => [r() < 0.5 ? -x : x, 1]), k };
}

export default {
  slug: "k-closest-points-to-origin",
  description: `Given an array of \`points\` where \`points[i] = [x, y]\` is a point on a plane, and an integer \`k\`, return the \`k\` points **closest to the origin** \`(0, 0)\`.

Distance is the usual Euclidean distance √(x² + y²). You may return the points in **any order**. The tests guarantee the answer is unique.`,
  examples: [
    { input: { points: [[1, 3], [-2, 2]], k: 1 }, explanation: "(1,3) has squared distance 10 and (-2,2) has 8, so (-2,2) is closest." },
    { input: { points: [[3, 3], [5, -1], [-2, 4]], k: 2 }, explanation: "Squared distances are 18, 26 and 20. The two smallest are (3,3) and (-2,4)." },
    { input: { points: [[0, 1], [1, 0]], k: 2 }, explanation: "Both points are returned." },
  ],
  constraints: ["1 <= k <= points.length <= 10^4", "-10^4 <= x, y <= 10^4"],
  harness: { fn: "kClosest", params: { points: "int[][]", k: "int" }, returns: "int[][]", compare: "unordered" },
  tests: [
    { points: [[0, 0]], k: 1 },
    { points: [[1, 1], [2, 2]], k: 1 },
    { points: [[2, 2], [1, 1]], k: 1 },
    { points: [[1, 0], [0, 2], [3, 0]], k: 2 },
    { points: [[-5, 4], [-6, -5], [4, 6]], k: 2 },
    { points: [[0, 1], [1, 0], [2, 0]], k: 2 },
    { points: [[10000, 10000], [-10000, -9999]], k: 1 },
    { points: [[1, 2], [2, 3], [3, 4], [4, 5]], k: 3 },
    { points: [[6, 10], [-3, 3], [-2, 5], [0, 2]], k: 3 },
    { points: [[1, 1], [1, 1], [3, 3]], k: 2 },
    { points: [[-1, -1], [5, 5], [-2, 0], [0, 3]], k: 1 },
    { points: [[9, 9], [8, 8], [7, 7], [6, 6], [5, 5]], k: 4 },
    big(10000, 100, 1),
    big(10000, 9999, 2),
  ],
  answer: {
    approach: [
      "Compare points by squared distance x² + y². Taking the square root is unnecessary and slower.",
      "Keep a max-heap of size k: push each point, and when the heap has more than k points, remove the farthest.",
      "The heap then holds the k closest points.",
      "Sorting all points by distance and taking the first k is simpler and O(n log n). Quickselect gives O(n) on average.",
    ],
    time: "O(n log k)",
    space: "O(k)",
    javascript: `function kClosest(points, k) {
    const d = ([x, y]) => x * x + y * y;
    return points.slice().sort((a, b) => d(a) - d(b)).slice(0, k);
}`,
    python: `class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        heap = []
        for x, y in points:
            heappush(heap, (-(x * x + y * y), x, y))
            if len(heap) > k:
                heappop(heap)
        return [[x, y] for _, x, y in heap]`,
  },
};
