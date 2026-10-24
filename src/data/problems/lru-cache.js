import { rng, randInt } from "../gen.js";

function randomOps(capacity, count, keySpace, seed) {
  const r = rng(seed);
  const ops = ["LRUCache"];
  const args = [[capacity]];
  for (let i = 0; i < count; i++) {
    if (r() < 0.5) {
      ops.push("put");
      args.push([randInt(r, 0, keySpace), randInt(r, 0, 100000)]);
    } else {
      ops.push("get");
      args.push([randInt(r, 0, keySpace)]);
    }
  }
  return { ops, args };
}

export default {
  slug: "lru-cache",
  description: `Design a data structure for a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:

- \`LRUCache(capacity)\` creates a cache that holds at most \`capacity\` key-value pairs.
- \`get(key)\` returns the value for \`key\` if it exists, otherwise \`-1\`. Reading a key counts as using it.
- \`put(key, value)\` inserts or updates the key. If adding it makes the cache exceed its capacity, **evict the least recently used key** first.

Both \`get\` and \`put\` must run in **O(1)** average time.

**How the input works:** \`ops\` lists the calls and \`args\` their arguments. The output lists each call's return value (\`null\` for constructor and \`put\`).`,
  examples: [
    {
      input: { ops: ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"], args: [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]] },
      explanation: "get(1) makes 1 recent, so put(3) evicts 2. Then put(4) evicts 1 (now the least recent).",
    },
    {
      input: { ops: ["LRUCache", "put", "get", "put", "get", "get"], args: [[1], [2, 1], [2], [3, 2], [2], [3]] },
      explanation: "With capacity 1, putting key 3 evicts key 2.",
    },
    {
      input: { ops: ["LRUCache", "put", "put", "put", "get"], args: [[2], [1, 1], [1, 5], [2, 2], [1]] },
      explanation: "Updating key 1 replaces its value; nothing is evicted.",
    },
  ],
  constraints: ["1 <= capacity <= 3000", "0 <= key <= 10^4", "0 <= value <= 10^5", "At most 2 * 10^5 calls to get and put."],
  harness: { type: "design", className: "LRUCache" },
  starter: {
    javascript: `class LRUCache {
    /**
     * @param {number} capacity
     */
    constructor(capacity) {

    }

    /**
     * @param {number} key
     * @return {number}
     */
    get(key) {

    }

    /**
     * @param {number} key
     * @param {number} value
     * @return {void}
     */
    put(key, value) {

    }
}`,
    python: `class LRUCache:

    def __init__(self, capacity: int):


    def get(self, key: int) -> int:


    def put(self, key: int, value: int) -> None:
        `,
  },
  tests: [
    { ops: ["LRUCache", "get"], args: [[1], [1]] },
    { ops: ["LRUCache", "put", "get"], args: [[1], [1, 1], [1]] },
    { ops: ["LRUCache", "put", "put", "get", "get"], args: [[1], [1, 1], [2, 2], [1], [2]] },
    { ops: ["LRUCache", "put", "put", "put", "get", "get", "get"], args: [[2], [1, 1], [2, 2], [3, 3], [1], [2], [3]] },
    { ops: ["LRUCache", "put", "put", "get", "put", "get", "get"], args: [[2], [2, 1], [1, 1], [2], [4, 1], [1], [2]] },
    { ops: ["LRUCache", "put", "put", "put", "put", "get", "get"], args: [[2], [2, 1], [1, 1], [2, 3], [4, 1], [1], [2]] },
    { ops: ["LRUCache", "get", "put", "get", "put", "put", "get", "get"], args: [[2], [2], [2, 6], [1], [1, 5], [1, 2], [1], [2]] },
    { ops: ["LRUCache", "put", "put", "put", "put", "put", "get", "get", "get", "get", "get"], args: [[3], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [1], [2], [3], [4], [5]] },
    { ops: ["LRUCache", "put", "put", "get", "get", "put", "get", "get"], args: [[2], [0, 0], [1, 1], [0], [0], [2, 2], [1], [0]] },
    { ops: ["LRUCache", "put", "put", "put", "get", "put", "get", "put", "get", "get", "get", "get"], args: [[3], [1, 1], [2, 2], [3, 3], [2], [4, 4], [1], [5, 5], [3], [2], [4], [5]] },
    { ops: ["LRUCache", "put", "put", "put", "put", "get"], args: [[1], [1, 10], [1, 20], [2, 30], [1, 40], [2]] },
    { ops: ["LRUCache", "put", "get", "put", "get", "put", "get"], args: [[2], [10000, 100000], [10000], [0, 0], [0], [5, 5], [10000]] },
    randomOps(100, 50000, 300, 1),
    randomOps(3000, 100000, 10000, 2),
    randomOps(1, 20000, 5, 3),
  ],
  answer: {
    approach: [
      "Combine a hash map (key → node) with a doubly linked list ordered by recency: the most recently used at one end, the least recently used at the other.",
      "get: look up the node, move it to the 'recent' end, return its value.",
      "put: if the key exists, update the value and move it to the recent end. Otherwise add a new node at the recent end, and if size exceeds capacity, remove the node at the 'old' end and delete it from the map.",
      "In JavaScript a Map already remembers insertion order, so delete + set moves a key to the end. In Python, OrderedDict with move_to_end does the same.",
    ],
    time: "O(1) per operation",
    space: "O(capacity)",
    javascript: `class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.map = new Map();
    }
    get(key) {
        if (!this.map.has(key)) return -1;
        const value = this.map.get(key);
        this.map.delete(key);
        this.map.set(key, value);
        return value;
    }
    put(key, value) {
        this.map.delete(key);
        this.map.set(key, value);
        if (this.map.size > this.capacity) {
            this.map.delete(this.map.keys().next().value);
        }
    }
}`,
    python: `class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        self.cache[key] = value
        self.cache.move_to_end(key)
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)`,
  },
};
