import { str } from "../gen.js";

const half = str(100000, "abcXYZ019 ,.:", 3);
const pal = half + [...half].reverse().join("");

export default {
  slug: "valid-palindrome",
  description: `A phrase is a **palindrome** if, after turning all uppercase letters into lowercase and **removing every character that is not a letter or a digit**, it reads the same forwards and backwards.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
  examples: [
    { input: { s: "A man, a plan, a canal: Panama" }, explanation: "After cleaning it becomes \"amanaplanacanalpanama\", which reads the same both ways." },
    { input: { s: "race a car" }, explanation: "After cleaning it becomes \"raceacar\", which is not a palindrome." },
    { input: { s: " " }, explanation: "After cleaning the string is empty, and an empty string is a palindrome." },
  ],
  constraints: ["1 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters."],
  harness: { fn: "isPalindrome", params: { s: "string" }, returns: "bool" },
  tests: [
    { s: "a" },
    { s: "ab" },
    { s: "aa" },
    { s: ".," },
    { s: "0P" },
    { s: "a." },
    { s: "No 'x' in Nixon" },
    { s: "Was it a car or a cat I saw?" },
    { s: "12321" },
    { s: "1a2" },
    { s: "ab_a" },
    { s: "Madam, in Eden, I'm Adam" },
    { s: "!!!a!!!b!!!" },
    { s: pal },
    { s: pal.slice(0, 100000) + "q" + pal.slice(100001) },
  ],
  answer: {
    approach: [
      "Use two pointers, one at each end of the string.",
      "Move each pointer inwards past any character that is not a letter or digit.",
      "Compare the two characters case-insensitively. If they differ, it is not a palindrome.",
      "Move both pointers inwards and repeat until they meet.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function isPalindrome(s) {
    const ok = (c) => /[a-z0-9]/i.test(c);
    let l = 0, r = s.length - 1;
    while (l < r) {
        while (l < r && !ok(s[l])) l++;
        while (l < r && !ok(s[r])) r--;
        if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
        l++; r--;
    }
    return true;
}`,
    python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        l, r = 0, len(s) - 1
        while l < r:
            while l < r and not s[l].isalnum():
                l += 1
            while l < r and not s[r].isalnum():
                r -= 1
            if s[l].lower() != s[r].lower():
                return False
            l += 1
            r -= 1
        return True`,
  },
};
