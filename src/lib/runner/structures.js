// Data structures and converters shared by the JS worker and the Node validator.
// Shapes follow LeetCode's JavaScript definitions so solutions transfer as-is.

const NODE_LIMIT = 200000;

export class ListNode {
  constructor(val, next) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

export class TreeNode {
  constructor(val, left, right) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

// Copy List with Random Pointer
export class RandomNode {
  constructor(val, next, random) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
    this.random = random === undefined ? null : random;
  }
}

// Clone Graph
export class GraphNode {
  constructor(val, neighbors) {
    this.val = val === undefined ? 0 : val;
    this.neighbors = neighbors === undefined ? [] : neighbors;
  }
}

export function arrayToList(arr) {
  const dummy = new ListNode(0);
  let cur = dummy;
  for (const v of arr || []) {
    cur.next = new ListNode(v);
    cur = cur.next;
  }
  return dummy.next;
}

export function listToArray(head) {
  const out = [];
  let cur = head;
  while (cur) {
    if (out.length >= NODE_LIMIT) throw new Error("Returned list is too long or contains a cycle");
    out.push(cur.val);
    cur = cur.next;
  }
  return out;
}

export function arrayToTree(arr) {
  if (!arr || arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let head = 0;
  let i = 1;
  while (head < queue.length && i < arr.length) {
    const node = queue[head++];
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i]);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

export function treeToArray(root) {
  if (!root) return [];
  const out = [];
  const queue = [root];
  for (let head = 0; head < queue.length; head++) {
    if (queue.length > NODE_LIMIT * 2) throw new Error("Returned tree is too large or contains a cycle");
    const node = queue[head];
    if (node === null || node === undefined) {
      out.push(null);
      continue;
    }
    out.push(node.val);
    queue.push(node.left ?? null, node.right ?? null);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

export function findTreeNode(root, val) {
  const stack = root ? [root] : [];
  while (stack.length) {
    const node = stack.pop();
    if (node.val === val) return node;
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  return null;
}

export function toArg(type, value) {
  if (type === "ListNode") return arrayToList(value);
  if (type === "ListNode[]") return (value || []).map(arrayToList);
  if (type === "TreeNode") return arrayToTree(value);
  return value;
}

export function fromRet(type, value) {
  if (type === "void") return null;
  if (type === "ListNode") return listToArray(value);
  if (type === "TreeNode") return treeToArray(value);
  return value === undefined ? null : value;
}
