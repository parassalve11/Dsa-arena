import { str } from "../gen.js";

export default {
  slug: "task-scheduler",
  description: `You are given an array of CPU \`tasks\`, each labelled with a letter from A to Z, and a cooling time \`n\`.

The CPU completes one task per interval, or stays **idle**. Tasks can run in any order, but two tasks with the **same label** must be separated by at least \`n\` intervals.

Return the **minimum number of intervals** needed to finish all the tasks.`,
  examples: [
    { input: { tasks: ["A", "A", "A", "B", "B", "B"], n: 2 }, explanation: "A → B → idle → A → B → idle → A → B takes 8 intervals." },
    { input: { tasks: ["A", "C", "A", "B", "D", "B"], n: 1 }, explanation: "A → B → C → D → A → B needs no idling: 6 intervals." },
    { input: { tasks: ["A", "A", "A", "B", "B", "B"], n: 3 }, explanation: "A → B → idle → idle → A → B → idle → idle → A → B takes 10 intervals." },
  ],
  constraints: ["1 <= tasks.length <= 10^4", "tasks[i] is an uppercase English letter.", "0 <= n <= 100"],
  harness: { fn: "leastInterval", params: { tasks: "char[]", n: "int" }, returns: "int" },
  tests: [
    { tasks: ["A"], n: 5 },
    { tasks: ["A", "A"], n: 0 },
    { tasks: ["A", "A"], n: 3 },
    { tasks: ["A", "B"], n: 3 },
    { tasks: ["A", "A", "A", "A", "A", "A", "B", "C", "D", "E", "F", "G"], n: 2 },
    { tasks: ["A", "A", "A", "B", "B", "B", "C", "C", "C", "D", "D", "E"], n: 2 },
    { tasks: ["A", "B", "C", "D", "E", "F"], n: 100 },
    { tasks: ["A", "A", "A", "B", "B", "B"], n: 0 },
    { tasks: ["Z", "Z", "Z", "Z"], n: 1 },
    { tasks: ["A", "A", "B", "B", "C", "C", "D", "D"], n: 3 },
    { tasks: ["A", "B", "A", "B", "A", "C"], n: 2 },
    { tasks: ["A", "A", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"], n: 7 },
    { tasks: [...str(10000, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", 1)], n: 50 },
    { tasks: [...str(10000, "AAAAAAAAB", 2)], n: 100 },
    { tasks: [...str(10000, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", 3)], n: 0 },
  ],
  answer: {
    approach: [
      "The most frequent task decides the shape. Let maxCount be its count and tied be how many tasks share that count.",
      "Lay those tasks out as maxCount - 1 'frames' of length n + 1, followed by one last frame holding the tied tasks: (maxCount - 1) × (n + 1) + tied intervals.",
      "Other tasks fill the idle slots. If there are more tasks than slots, no idling is needed at all, and the answer is simply tasks.length.",
      "So the answer is max(tasks.length, (maxCount - 1) × (n + 1) + tied).",
    ],
    time: "O(N)",
    space: "O(1), 26 counters",
    javascript: `function leastInterval(tasks, n) {
    const count = new Array(26).fill(0);
    for (const t of tasks) count[t.charCodeAt(0) - 65]++;
    const maxCount = Math.max(...count);
    const tied = count.filter((c) => c === maxCount).length;
    return Math.max(tasks.length, (maxCount - 1) * (n + 1) + tied);
}`,
    python: `class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        count = Counter(tasks)
        max_count = max(count.values())
        tied = sum(1 for c in count.values() if c == max_count)
        return max(len(tasks), (max_count - 1) * (n + 1) + tied)`,
  },
};
