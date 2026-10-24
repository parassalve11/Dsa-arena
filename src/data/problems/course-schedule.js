import { rng, randInt, range, shuffle } from "../gen.js";

// Random DAG: edges only go from a later course to an earlier one in a hidden
// order, so there is never a cycle. Adding one back edge creates a cycle.
export function randomDag(n, m, seed, withCycle = false) {
  const r = rng(seed);
  const order = shuffle(range(n), seed + 1);
  const edges = [];
  for (let i = 0; i < m; i++) {
    const a = randInt(r, 1, n - 1);
    const b = randInt(r, 0, a - 1);
    edges.push([order[a], order[b]]);
  }
  if (withCycle) {
    for (let i = 1; i < n; i++) edges.push([order[i], order[i - 1]]);
    edges.push([order[0], order[n - 1]]);
  }
  return { numCourses: n, prerequisites: edges };
}

export default {
  slug: "course-schedule",
  description: `There are \`numCourses\` courses labelled \`0\` to \`numCourses - 1\`. You are given \`prerequisites\` where \`prerequisites[i] = [a, b]\` means you must take course \`b\` **before** course \`a\`.

Return \`true\` if it is possible to finish all courses, or \`false\` otherwise.`,
  examples: [
    { input: { numCourses: 2, prerequisites: [[1, 0]] }, explanation: "Take course 0, then course 1." },
    { input: { numCourses: 2, prerequisites: [[1, 0], [0, 1]] }, explanation: "Each course needs the other first, which is impossible." },
    { input: { numCourses: 3, prerequisites: [] }, explanation: "No prerequisites at all." },
  ],
  constraints: ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000", "0 <= a, b < numCourses", "All pairs are unique."],
  harness: { fn: "canFinish", params: { numCourses: "int", prerequisites: "int[][]" }, returns: "bool" },
  tests: [
    { numCourses: 1, prerequisites: [] },
    { numCourses: 1, prerequisites: [[0, 0]] },
    { numCourses: 3, prerequisites: [[1, 0], [2, 1]] },
    { numCourses: 3, prerequisites: [[0, 1], [1, 2], [2, 0]] },
    { numCourses: 4, prerequisites: [[1, 0], [2, 0], [3, 1], [3, 2]] },
    { numCourses: 4, prerequisites: [[1, 0], [2, 1], [3, 2], [1, 3]] },
    { numCourses: 5, prerequisites: [[1, 4], [2, 4], [3, 1], [3, 2]] },
    { numCourses: 3, prerequisites: [[1, 0], [1, 2], [0, 1]] },
    { numCourses: 6, prerequisites: [[5, 4], [4, 3], [3, 2], [2, 1], [1, 0]] },
    { numCourses: 6, prerequisites: [[0, 1], [2, 3], [4, 5], [5, 4]] },
    { numCourses: 2, prerequisites: [[0, 1]] },
    { numCourses: 7, prerequisites: [[1, 0], [0, 3], [0, 2], [3, 2], [2, 5], [4, 5], [5, 6], [2, 4]] },
    randomDag(2000, 5000, 1),
    randomDag(2000, 3000, 2, true),
    randomDag(2000, 4999, 3),
  ],
  answer: {
    approach: [
      "Treat courses as nodes and each prerequisite [a, b] as an edge b → a. You can finish everything exactly when this graph has no cycle.",
      "Kahn's algorithm: count the incoming edges (in-degree) of each course and start a queue with every course whose in-degree is 0.",
      "Take a course from the queue and 'complete' it: lower the in-degree of the courses that depend on it, queueing any that drop to 0.",
      "If you complete all numCourses courses, return true. If some are never freed, they sit on a cycle: return false.",
    ],
    time: "O(V + E)",
    space: "O(V + E)",
    javascript: `function canFinish(numCourses, prerequisites) {
    const adj = Array.from({ length: numCourses }, () => []);
    const indeg = new Array(numCourses).fill(0);
    for (const [a, b] of prerequisites) {
        adj[b].push(a);
        indeg[a]++;
    }
    const queue = [];
    for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) queue.push(i);
    for (let i = 0; i < queue.length; i++) {
        for (const next of adj[queue[i]]) {
            if (--indeg[next] === 0) queue.push(next);
        }
    }
    return queue.length === numCourses;
}`,
    python: `class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        adj = [[] for _ in range(numCourses)]
        indeg = [0] * numCourses
        for a, b in prerequisites:
            adj[b].append(a)
            indeg[a] += 1
        queue = deque(i for i in range(numCourses) if indeg[i] == 0)
        done = 0
        while queue:
            c = queue.popleft()
            done += 1
            for nxt in adj[c]:
                indeg[nxt] -= 1
                if indeg[nxt] == 0:
                    queue.append(nxt)
        return done == numCourses`,
  },
};
