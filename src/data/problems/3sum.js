import { ints } from "../gen.js";

export default {
  slug: "3sum",
  description: `Given an integer array \`nums\`, return **all the unique triplets** \`[nums[i], nums[j], nums[k]]\` with \`i\`, \`j\`, \`k\` all different and \`nums[i] + nums[j] + nums[k] == 0\`.

The answer must not contain duplicate triplets. The order of the triplets, and of the numbers inside each triplet, does not matter.`,
  examples: [
    { input: { nums: [-1, 0, 1, 2, -1, -4] }, explanation: "The two distinct triplets that sum to zero are [-1,-1,2] and [-1,0,1]." },
    { input: { nums: [0, 1, 1] }, explanation: "No triplet sums to zero." },
    { input: { nums: [0, 0, 0] }, explanation: "The only triplet is [0,0,0]." },
  ],
  constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
  harness: { fn: "threeSum", params: { nums: "int[]" }, returns: "int[][]", compare: "unorderedNested" },
  tests: [
    { nums: [1, 2, 3] },
    { nums: [0, 0, 0, 0] },
    { nums: [-1, 0, 1] },
    { nums: [-2, 0, 1, 1, 2] },
    { nums: [3, 0, -2, -1, 1, 2] },
    { nums: [-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6] },
    { nums: [1, -1, -1, 0] },
    { nums: [-100000, 50000, 50000] },
    { nums: [-1, -1, -1, 2, 2, 2] },
    { nums: [5, -5, 0, 5, -5] },
    { nums: [-2, -3, 0, 0, -2] },
    { nums: [34, 55, 79, 28, 46, 33, 2, 48, 31, -3, 84, 71, 52, -3, 93, 15, 21, -43, 57, -6, 86, 56, 94, 74, 83, -14, 28, -66, 46, -49, 62, -11, 43, 65, 77, 12, 47, 61, 26, 1, 13, 29, 55, -82, 76, 26, 15, -29, 36, -29, 10, -70, 69, 17, 49] },
    { nums: ints(3000, -100000, 100000, 1) },
    { nums: ints(3000, -50, 50, 2) },
  ],
  answer: {
    approach: [
      "Sort the array. Equal values are now next to each other, which makes skipping duplicates easy.",
      "Fix the first number nums[i] (skip it if it equals nums[i - 1]). You now need two numbers after i that sum to -nums[i].",
      "Use two pointers l = i + 1 and r = end. If the sum is too small move l right, if too big move r left.",
      "On a match, record the triplet, then move both pointers past any repeated values so the same triplet is not added twice.",
    ],
    time: "O(n²)",
    space: "O(1) besides the output (sorting may use O(log n))",
    javascript: `function threeSum(nums) {
    nums.sort((a, b) => a - b);
    const out = [];
    for (let i = 0; i < nums.length - 2; i++) {
        if (nums[i] > 0) break;
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        let l = i + 1, r = nums.length - 1;
        while (l < r) {
            const sum = nums[i] + nums[l] + nums[r];
            if (sum < 0) l++;
            else if (sum > 0) r--;
            else {
                out.push([nums[i], nums[l], nums[r]]);
                while (l < r && nums[l] === nums[l + 1]) l++;
                while (l < r && nums[r] === nums[r - 1]) r--;
                l++; r--;
            }
        }
    }
    return out;
}`,
    python: `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        out = []
        n = len(nums)
        for i in range(n - 2):
            if nums[i] > 0:
                break
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            l, r = i + 1, n - 1
            while l < r:
                s = nums[i] + nums[l] + nums[r]
                if s < 0:
                    l += 1
                elif s > 0:
                    r -= 1
                else:
                    out.append([nums[i], nums[l], nums[r]])
                    while l < r and nums[l] == nums[l + 1]:
                        l += 1
                    while l < r and nums[r] == nums[r - 1]:
                        r -= 1
                    l += 1
                    r -= 1
        return out`,
  },
};
