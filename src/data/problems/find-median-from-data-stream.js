import { rng, randInt } from "../gen.js";

function randomOps(count, seed) {
  const r = rng(seed);
  const ops = ["MedianFinder", "addNum"];
  const args = [[], [randInt(r, -100000, 100000)]];
  for (let i = 0; i < count; i++) {
    if (r() < 0.6) {
      ops.push("addNum");
      args.push([randInt(r, -100000, 100000)]);
    } else {
      ops.push("findMedian");
      args.push([]);
    }
  }
  return { ops, args };
}

export default {
  slug: "find-median-from-data-stream",
  description: `The **median** is the middle value of a sorted list. If the list has an even number of values, it is the average of the two middle values.

Implement the \`MedianFinder\` class:

- \`MedianFinder()\` creates an empty object.
- \`addNum(num)\` adds the integer \`num\` from the data stream.
- \`findMedian()\` returns the median of all numbers added so far. Answers within 10^-5 of the true value are accepted.

**How the input works:** \`ops\` lists the calls and \`args\` their arguments. The output lists each call's return value (\`null\` for constructor and \`addNum\`).`,
  examples: [
    {
      input: { ops: ["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"], args: [[], [1], [2], [], [3], []] },
      explanation: "After 1 and 2 the median is 1.5. After adding 3 it is 2.",
    },
    {
      input: { ops: ["MedianFinder", "addNum", "findMedian"], args: [[], [-7], []] },
      explanation: "With one number, it is the median.",
    },
    {
      input: { ops: ["MedianFinder", "addNum", "addNum", "addNum", "addNum", "findMedian"], args: [[], [5], [15], [1], [3], []] },
      explanation: "Sorted: 1, 3, 5, 15. The median is (3 + 5) / 2 = 4.",
    },
  ],
  constraints: ["-10^5 <= num <= 10^5", "findMedian is only called after at least one addNum.", "At most 5 * 10^4 calls in total."],
  followUp: "If all numbers are in [0, 100], how would you optimise? What if 99% of them are?",
  harness: { type: "design", className: "MedianFinder", compare: "float" },
  starter: {
    javascript: `class MedianFinder {
    constructor() {

    }

    /**
     * @param {number} num
     * @return {void}
     */
    addNum(num) {

    }

    /**
     * @return {number}
     */
    findMedian() {

    }
}`,
    python: `class MedianFinder:

    def __init__(self):


    def addNum(self, num: int) -> None:


    def findMedian(self) -> float:
        `,
  },
  tests: [
    { ops: ["MedianFinder", "addNum", "findMedian"], args: [[], [0], []] },
    { ops: ["MedianFinder", "addNum", "addNum", "findMedian"], args: [[], [-1], [-2], []] },
    { ops: ["MedianFinder", "addNum", "addNum", "addNum", "findMedian"], args: [[], [3], [1], [2], []] },
    { ops: ["MedianFinder", "addNum", "findMedian", "addNum", "findMedian", "addNum", "findMedian", "addNum", "findMedian"], args: [[], [6], [], [10], [], [2], [], [6], []] },
    { ops: ["MedianFinder", "addNum", "addNum", "addNum", "addNum", "findMedian"], args: [[], [1], [1], [1], [1], []] },
    { ops: ["MedianFinder", "addNum", "addNum", "findMedian"], args: [[], [100000], [-100000], []] },
    { ops: ["MedianFinder", "addNum", "addNum", "addNum", "findMedian", "addNum", "findMedian"], args: [[], [10], [20], [30], [], [40], []] },
    { ops: ["MedianFinder", "addNum", "addNum", "addNum", "addNum", "addNum", "findMedian"], args: [[], [5], [4], [3], [2], [1], []] },
    { ops: ["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "addNum", "findMedian"], args: [[], [2], [3], [], [-5], [8], []] },
    { ops: ["MedianFinder", "addNum", "findMedian", "addNum", "findMedian"], args: [[], [7], [], [8], []] },
    { ops: ["MedianFinder", "addNum", "addNum", "addNum", "findMedian"], args: [[], [-1], [-1], [5], []] },
    { ops: ["MedianFinder", "addNum", "addNum", "addNum", "addNum", "findMedian", "findMedian"], args: [[], [12], [10], [13], [11], [], []] },
    randomOps(30000, 1),
    randomOps(50000, 2),
  ],
  answer: {
    approach: [
      "Keep two heaps: a max-heap 'low' for the smaller half of the numbers and a min-heap 'high' for the larger half.",
      "On addNum, push into low, then move low's largest into high. If high becomes bigger than low, move high's smallest back to low. This keeps every value in low <= every value in high, and low has the same size or one more.",
      "findMedian: if low is bigger, its top is the median. Otherwise the median is the average of the two tops.",
      "Each add is O(log n) and each findMedian is O(1).",
    ],
    time: "O(log n) per addNum, O(1) per findMedian",
    space: "O(n)",
    javascript: `class Heap {
    constructor(less) {
        this.a = [];
        this.less = less;
    }
    size() { return this.a.length; }
    top() { return this.a[0]; }
    push(x) {
        const a = this.a;
        a.push(x);
        let i = a.length - 1;
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (!this.less(a[i], a[p])) break;
            [a[i], a[p]] = [a[p], a[i]];
            i = p;
        }
    }
    pop() {
        const a = this.a, top = a[0], last = a.pop();
        if (a.length) {
            a[0] = last;
            let i = 0;
            while (true) {
                const l = 2 * i + 1, r = l + 1;
                let m = i;
                if (l < a.length && this.less(a[l], a[m])) m = l;
                if (r < a.length && this.less(a[r], a[m])) m = r;
                if (m === i) break;
                [a[i], a[m]] = [a[m], a[i]];
                i = m;
            }
        }
        return top;
    }
}

class MedianFinder {
    constructor() {
        this.low = new Heap((x, y) => x > y);
        this.high = new Heap((x, y) => x < y);
    }
    addNum(num) {
        this.low.push(num);
        this.high.push(this.low.pop());
        if (this.high.size() > this.low.size()) this.low.push(this.high.pop());
    }
    findMedian() {
        if (this.low.size() > this.high.size()) return this.low.top();
        return (this.low.top() + this.high.top()) / 2;
    }
}`,
    python: `class MedianFinder:
    def __init__(self):
        self.low = []   # max-heap (negated values)
        self.high = []  # min-heap

    def addNum(self, num: int) -> None:
        heappush(self.low, -num)
        heappush(self.high, -heappop(self.low))
        if len(self.high) > len(self.low):
            heappush(self.low, -heappop(self.high))

    def findMedian(self) -> float:
        if len(self.low) > len(self.high):
            return float(-self.low[0])
        return (-self.low[0] + self.high[0]) / 2`,
  },
};
