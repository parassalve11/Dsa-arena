export default {
  slug: "decode-string",
  description: `Given an encoded string, return its decoded form.

The encoding rule is \`k[encoded_string]\`: the part inside the brackets is repeated exactly \`k\` times. \`k\` is always a positive integer, and patterns can be **nested**.

The input is always valid: brackets are well-formed and there are no extra spaces. Digits only appear as repeat counts (you won't see input like \`3a\` or \`2[4]\`).`,
  examples: [
    { input: { s: "3[a]2[bc]" }, explanation: "\"aaa\" + \"bcbc\"." },
    { input: { s: "3[a2[c]]" }, explanation: "The inner part a2[c] is \"acc\", repeated 3 times." },
    { input: { s: "2[abc]3[cd]ef" }, explanation: "\"abcabc\" + \"cdcdcd\" + \"ef\"." },
  ],
  constraints: ["1 <= s.length <= 30", "s consists of lowercase letters, digits and square brackets.", "All integers in s are in the range [1, 300].", "The decoded output is at most 10^5 characters."],
  harness: { fn: "decodeString", params: { s: "string" }, returns: "string" },
  tests: [
    { s: "a" },
    { s: "abc" },
    { s: "1[a]" },
    { s: "10[a]" },
    { s: "2[2[b]]" },
    { s: "a2[b]c" },
    { s: "3[z]2[2[y]pq4[2[jk]e1[f]]]ef" },
    { s: "100[leetcode]" },
    { s: "2[ab3[c]]d" },
    { s: "4[a]x2[b2[c]]" },
    { s: "ab2[cd]" },
    { s: "1[1[1[x]]]" },
    { s: "300[a]" },
    { s: "20[ab10[cd5[e]]]" },
  ],
  answer: {
    approach: [
      "Scan the string and keep a stack of (string built so far, repeat count) for each open bracket.",
      "Digits build up the current number k (it may have several digits).",
      "On '[', push the current string and k, then start a fresh string and reset k.",
      "On ']', pop (prev, k) and set current = prev + current repeated k times. Letters are just appended to current.",
    ],
    time: "O(output length)",
    space: "O(output length)",
    javascript: `function decodeString(s) {
    const stack = [];
    let cur = "", k = 0;
    for (const c of s) {
        if (c >= "0" && c <= "9") k = k * 10 + Number(c);
        else if (c === "[") {
            stack.push([cur, k]);
            cur = "";
            k = 0;
        } else if (c === "]") {
            const [prev, times] = stack.pop();
            cur = prev + cur.repeat(times);
        } else cur += c;
    }
    return cur;
}`,
    python: `class Solution:
    def decodeString(self, s: str) -> str:
        stack = []
        cur, k = "", 0
        for c in s:
            if c.isdigit():
                k = k * 10 + int(c)
            elif c == '[':
                stack.append((cur, k))
                cur, k = "", 0
            elif c == ']':
                prev, times = stack.pop()
                cur = prev + cur * times
            else:
                cur += c
        return cur`,
  },
};
