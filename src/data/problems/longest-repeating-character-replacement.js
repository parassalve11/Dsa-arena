import { str } from "../gen.js";

export default {
  slug: "longest-repeating-character-replacement",
  description: `You are given a string \`s\` of uppercase English letters and an integer \`k\`.

You may pick any character of the string and change it to any other uppercase letter. You can do this **at most \`k\` times**.

Return the length of the longest substring that contains only **one repeated letter** after making those changes.`,
  examples: [
    { input: { s: "ABAB", k: 2 }, explanation: "Change both A's to B (or both B's to A) to get \"BBBB\"." },
    { input: { s: "AABABBA", k: 1 }, explanation: "Change the A at index 3 to B to get \"AABBBBA\", which contains \"BBBB\"." },
    { input: { s: "AAAA", k: 0 }, explanation: "No changes needed: the whole string is already one letter." },
  ],
  constraints: ["1 <= s.length <= 10^5", "s consists of only uppercase English letters.", "0 <= k <= s.length"],
  harness: { fn: "characterReplacement", params: { s: "string", k: "int" }, returns: "int" },
  tests: [
    { s: "A", k: 0 },
    { s: "A", k: 1 },
    { s: "AB", k: 0 },
    { s: "ABC", k: 3 },
    { s: "ABBB", k: 2 },
    { s: "AAAB", k: 0 },
    { s: "ABCDE", k: 1 },
    { s: "BAAAB", k: 2 },
    { s: "ABAA", k: 0 },
    { s: "KRSCDCSONAJNHLBMDQGIFCPEKPOHQIHLTDIQGEKLRLCQNBOHNDQGHJPNDQPERNFSSSRDEQLFPCCCARFMDLHADJADAGNNSBNCJQOF", k: 4 },
    { s: "AABBBCCCCDDDDD", k: 3 },
    { s: "ZYXWVUTSRQ", k: 10 },
    { s: str(100000, "ABCDE", 1), k: 500 },
    { s: str(100000, "AB", 2), k: 0 },
  ],
  answer: {
    approach: [
      "Use a sliding window and count the letters inside it.",
      "A window is fixable if (window length) - (count of its most frequent letter) <= k: everything else can be changed.",
      "Grow the window to the right. If it becomes unfixable, shrink it from the left by one.",
      "maxCount never needs to decrease: the answer only improves when a window has a larger maxCount, so the window size only ever grows to the best length.",
    ],
    time: "O(n)",
    space: "O(1), 26 counters",
    javascript: `function characterReplacement(s, k) {
    const count = new Array(26).fill(0);
    let left = 0, maxCount = 0;
    for (let right = 0; right < s.length; right++) {
        maxCount = Math.max(maxCount, ++count[s.charCodeAt(right) - 65]);
        if (right - left + 1 - maxCount > k) {
            count[s.charCodeAt(left) - 65]--;
            left++;
        }
    }
    return s.length - left;
}`,
    python: `class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        count = [0] * 26
        left = max_count = 0
        for right, c in enumerate(s):
            count[ord(c) - 65] += 1
            max_count = max(max_count, count[ord(c) - 65])
            if right - left + 1 - max_count > k:
                count[ord(s[left]) - 65] -= 1
                left += 1
        return len(s) - left`,
  },
};
