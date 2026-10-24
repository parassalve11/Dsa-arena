export default {
  slug: "combination-sum",
  description: `Given an array of **distinct** integers \`candidates\` and a \`target\`, return all **unique combinations** of candidates that add up to \`target\`.

You may use the **same number as many times as you like**. Two combinations are different if the count of at least one number differs. Return the combinations in **any order**.`,
  examples: [
    { input: { candidates: [2, 3, 6, 7], target: 7 }, explanation: "2 + 2 + 3 = 7 and 7 = 7." },
    { input: { candidates: [2, 3, 5], target: 8 }, explanation: "[2,2,2,2], [2,3,3] and [3,5]." },
    { input: { candidates: [2], target: 1 }, explanation: "No combination reaches 1." },
  ],
  constraints: ["1 <= candidates.length <= 30", "2 <= candidates[i] <= 40", "All candidates are distinct.", "1 <= target <= 40"],
  harness: { fn: "combinationSum", params: { candidates: "int[]", target: "int" }, returns: "int[][]", compare: "unorderedNested" },
  tests: [
    { candidates: [2], target: 2 },
    { candidates: [2], target: 3 },
    { candidates: [3], target: 9 },
    { candidates: [7, 3, 2], target: 18 },
    { candidates: [8, 7, 4, 3], target: 11 },
    { candidates: [2, 4, 6, 8], target: 8 },
    { candidates: [5, 10, 15], target: 30 },
    { candidates: [10, 1, 2, 7, 6, 5], target: 8 },
    { candidates: [40], target: 40 },
    { candidates: [39, 40], target: 1 },
    { candidates: [3, 5, 7], target: 16 },
    { candidates: [2, 3, 5, 7, 11], target: 20 },
    { candidates: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], target: 30 },
    { candidates: Array.from({ length: 30 }, (_, i) => i + 2), target: 40 },
  ],
  answer: {
    approach: [
      "Sort the candidates and backtrack, choosing numbers in non-decreasing order so each combination is generated only once.",
      "The helper takes a start index and the remaining target. For each i from start, add candidates[i] and recurse with the same i (it can be reused) and remaining - candidates[i].",
      "When remaining hits 0, record the combination.",
      "Because the list is sorted, stop the loop as soon as a candidate is larger than the remaining target.",
    ],
    time: "Exponential in target / min(candidates)",
    space: "O(target / min(candidates)) for the recursion",
    javascript: `function combinationSum(candidates, target) {
    candidates = candidates.slice().sort((a, b) => a - b);
    const out = [], cur = [];
    const backtrack = (start, remain) => {
        if (remain === 0) {
            out.push(cur.slice());
            return;
        }
        for (let i = start; i < candidates.length && candidates[i] <= remain; i++) {
            cur.push(candidates[i]);
            backtrack(i, remain - candidates[i]);
            cur.pop();
        }
    };
    backtrack(0, target);
    return out;
}`,
    python: `class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        candidates = sorted(candidates)
        out = []

        def backtrack(start, remain, cur):
            if remain == 0:
                out.append(cur[:])
                return
            for i in range(start, len(candidates)):
                if candidates[i] > remain:
                    break
                cur.append(candidates[i])
                backtrack(i, remain - candidates[i], cur)
                cur.pop()

        backtrack(0, target, [])
        return out`,
  },
};
