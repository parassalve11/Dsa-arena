import { randomDag } from "./course-schedule.js";

export default {
  slug: "course-schedule-ii",
  description: `There are \`numCourses\` courses labelled \`0\` to \`numCourses - 1\`. \`prerequisites[i] = [a, b]\` means you must take course \`b\` **before** course \`a\`.

Return **an order** in which you can take all the courses. If there are several valid orders, **any of them** is accepted. If it is impossible to finish all courses, return an **empty array**.`,
  examples: [
    { input: { numCourses: 2, prerequisites: [[1, 0]] }, explanation: "Course 0 must come first: [0,1]." },
    { input: { numCourses: 4, prerequisites: [[1, 0], [2, 0], [3, 1], [3, 2]] }, explanation: "[0,1,2,3] and [0,2,1,3] are both valid." },
    { input: { numCourses: 1, prerequisites: [] }, explanation: "Just take course 0." },
  ],
  constraints: ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= numCourses * (numCourses - 1)", "0 <= a, b < numCourses, a != b", "All pairs are distinct."],
  harness: { fn: "findOrder", params: { numCourses: "int", prerequisites: "int[][]" }, returns: "int[]", validator: "courseScheduleII" },
  tests: [
    { numCourses: 2, prerequisites: [] },
    { numCourses: 2, prerequisites: [[0, 1]] },
    { numCourses: 2, prerequisites: [[0, 1], [1, 0]] },
    { numCourses: 3, prerequisites: [[0, 1], [0, 2], [1, 2]] },
    { numCourses: 3, prerequisites: [[1, 0], [2, 1], [0, 2]] },
    { numCourses: 5, prerequisites: [[1, 0], [2, 1], [3, 2], [4, 3]] },
    { numCourses: 6, prerequisites: [[5, 2], [5, 0], [4, 0], [4, 1], [2, 3], [3, 1]] },
    { numCourses: 4, prerequisites: [[1, 0], [2, 1], [3, 2], [2, 3]] },
    { numCourses: 3, prerequisites: [[2, 0], [2, 1]] },
    { numCourses: 7, prerequisites: [[1, 0], [3, 1], [4, 1], [5, 4], [6, 5], [6, 3]] },
    { numCourses: 4, prerequisites: [[3, 0], [0, 3]] },
    { numCourses: 5, prerequisites: [[0, 4], [1, 4], [2, 4], [3, 4]] },
    randomDag(2000, 6000, 4),
    randomDag(2000, 2000, 5, true),
    randomDag(1500, 1499, 6),
  ],
  answer: {
    approach: [
      "Same graph as Course Schedule: each prerequisite [a, b] is an edge b → a.",
      "Run Kahn's algorithm: start with all courses of in-degree 0, and each time you take a course, append it to the order and decrease the in-degree of the courses that depend on it.",
      "The order in which courses leave the queue is a valid topological order.",
      "If fewer than numCourses courses were taken, there is a cycle: return [].",
    ],
    time: "O(V + E)",
    space: "O(V + E)",
    javascript: `function findOrder(numCourses, prerequisites) {
    const adj = Array.from({ length: numCourses }, () => []);
    const indeg = new Array(numCourses).fill(0);
    for (const [a, b] of prerequisites) {
        adj[b].push(a);
        indeg[a]++;
    }
    const order = [];
    for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) order.push(i);
    for (let i = 0; i < order.length; i++) {
        for (const next of adj[order[i]]) {
            if (--indeg[next] === 0) order.push(next);
        }
    }
    return order.length === numCourses ? order : [];
}`,
    python: `class Solution:
    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        adj = [[] for _ in range(numCourses)]
        indeg = [0] * numCourses
        for a, b in prerequisites:
            adj[b].append(a)
            indeg[a] += 1
        order = [i for i in range(numCourses) if indeg[i] == 0]
        i = 0
        while i < len(order):
            for nxt in adj[order[i]]:
                indeg[nxt] -= 1
                if indeg[nxt] == 0:
                    order.append(nxt)
            i += 1
        return order if len(order) == numCourses else []`,
  },
};
