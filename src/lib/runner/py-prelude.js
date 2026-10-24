// Python harness. Loaded once into Pyodide in the browser, and written to a temp
// file for the Node validator, so both judge code identically.
// Entry point: _arena_run(user_code, harness_json, cases_json) -> JSON string.

export const PY_PRELUDE = String.raw`
import sys, io, json, time, traceback
from typing import List, Optional, Dict, Tuple, Set
import collections, heapq, math, bisect, itertools, functools, string, re
from collections import *
from functools import lru_cache, cache, reduce
from heapq import heappush, heappop, heapify, heappushpop, heapreplace, nlargest, nsmallest
from bisect import bisect_left, bisect_right, insort
from math import inf

sys.setrecursionlimit(6000)


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

    def __repr__(self):
        return "ListNode(%r)" % (self.val,)


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

    def __repr__(self):
        return "TreeNode(%r)" % (self.val,)


class _ArenaRandomNode:
    def __init__(self, x=0, next=None, random=None):
        self.val = int(x)
        self.next = next
        self.random = random


class _ArenaGraphNode:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []


_ARENA_NODE_LIMIT = 200000
_ARENA_STDOUT_LIMIT = 20000


def _arena_array_to_list(arr):
    dummy = ListNode(0)
    cur = dummy
    for v in arr or []:
        cur.next = ListNode(v)
        cur = cur.next
    return dummy.next


def _arena_list_to_array(head):
    out = []
    while head is not None:
        if len(out) >= _ARENA_NODE_LIMIT:
            raise RuntimeError("Returned list is too long or contains a cycle")
        out.append(head.val)
        head = head.next
    return out


def _arena_array_to_tree(arr):
    if not arr or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    queue = [root]
    head = 0
    i = 1
    while head < len(queue) and i < len(arr):
        node = queue[head]
        head += 1
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root


def _arena_tree_to_array(root):
    if root is None:
        return []
    out = []
    queue = [root]
    head = 0
    while head < len(queue):
        if len(queue) > _ARENA_NODE_LIMIT * 2:
            raise RuntimeError("Returned tree is too large or contains a cycle")
        node = queue[head]
        head += 1
        if node is None:
            out.append(None)
            continue
        out.append(node.val)
        queue.append(node.left)
        queue.append(node.right)
    while out and out[-1] is None:
        out.pop()
    return out


def _arena_find(root, val):
    stack = [root] if root else []
    while stack:
        node = stack.pop()
        if node.val == val:
            return node
        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)
    return None


def _arena_to_arg(t, v):
    if t == "ListNode":
        return _arena_array_to_list(v)
    if t == "ListNode[]":
        return [_arena_array_to_list(x) for x in (v or [])]
    if t == "TreeNode":
        return _arena_array_to_tree(v)
    return v


def _arena_from_ret(t, v):
    if t == "void":
        return None
    if t == "ListNode":
        return _arena_list_to_array(v)
    if t == "TreeNode":
        return _arena_tree_to_array(v)
    return v


def _arena_clean(x):
    if isinstance(x, bool) or x is None or isinstance(x, (int, str)):
        return x
    if isinstance(x, float):
        if x != x or x in (float("inf"), float("-inf")):
            return None
        return x
    if isinstance(x, (list, tuple, deque)):
        return [_arena_clean(v) for v in x]
    if isinstance(x, (set, frozenset)):
        items = [_arena_clean(v) for v in x]
        try:
            items.sort()
        except TypeError:
            pass
        return items
    if isinstance(x, dict):
        return {str(k): _arena_clean(v) for k, v in x.items()}
    if isinstance(x, ListNode):
        return _arena_list_to_array(x)
    if isinstance(x, TreeNode):
        return _arena_tree_to_array(x)
    return repr(x)


def _arena_cycle_list(values, pos):
    nodes = [ListNode(v) for v in values]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    if 0 <= pos < len(nodes):
        nodes[-1].next = nodes[pos]
    return nodes


def _arena_intersection(inp):
    iv, la, lb, sa, sb = inp["intersectVal"], inp["listA"], inp["listB"], inp["skipA"], inp["skipB"]
    a = [ListNode(v) for v in la]
    for i in range(len(a) - 1):
        a[i].next = a[i + 1]
    own = [ListNode(v) for v in (lb if iv == 0 else lb[:sb])]
    for i in range(len(own) - 1):
        own[i].next = own[i + 1]
    if iv != 0 and own:
        own[-1].next = a[sa]
    head_b = own[0] if own else (a[sa] if iv != 0 else None)
    return (a[0] if a else None), head_b


def _arena_random_list(pairs):
    nodes = [_ArenaRandomNode(p[0]) for p in pairs]
    for i, n in enumerate(nodes):
        n.next = nodes[i + 1] if i + 1 < len(nodes) else None
        r = pairs[i][1]
        n.random = None if r is None else nodes[r]
    return nodes


def _arena_serialize_random(head, original):
    orig = set(id(n) for n in original)
    index = {}
    order = []
    cur = head
    while cur is not None:
        if len(order) > _ARENA_NODE_LIMIT:
            raise RuntimeError("Returned list is too long or contains a cycle")
        if id(cur) in orig:
            return "Invalid: the copy shares nodes with the original list"
        index[id(cur)] = len(order)
        order.append(cur)
        cur = cur.next
    out = []
    for n in order:
        r = n.random
        if r is None:
            out.append([n.val, None])
        elif id(r) in orig:
            out.append([n.val, "original node"])
        else:
            out.append([n.val, index.get(id(r), "?")])
    return out


def _arena_graph(adj):
    nodes = [_ArenaGraphNode(i + 1) for i in range(len(adj))]
    for i, nbrs in enumerate(adj):
        nodes[i].neighbors = [nodes[v - 1] for v in nbrs]
    return nodes


def _arena_serialize_graph(start, original):
    if start is None:
        return []
    orig = set(id(n) for n in original)
    seen = {start.val: start}
    queue = [start]
    i = 0
    while i < len(queue):
        node = queue[i]
        i += 1
        if id(node) in orig:
            return "Invalid: the clone shares nodes with the original graph"
        for nb in node.neighbors or []:
            if nb.val not in seen:
                seen[nb.val] = nb
                queue.append(nb)
            elif seen[nb.val] is not nb:
                return "Invalid: two different nodes have the same value"
    n = max(seen.keys())
    return [[x.val for x in seen[v].neighbors] if v in seen else [] for v in range(1, n + 1)]


def _arena_solution(ns):
    if "Solution" not in ns:
        raise NameError("class Solution is not defined")
    return ns["Solution"]()


def _arena_method(ns, name):
    sol = _arena_solution(ns)
    if not hasattr(sol, name):
        raise AttributeError("Solution has no method '%s'" % name)
    return getattr(sol, name)


def _arena_case(ns, h, inp):
    t = h["type"]
    ad = h.get("adapter")

    if t == "design":
        name = h["className"]
        if name not in ns:
            raise NameError("class %s is not defined" % name)
        ops, args = inp["ops"], inp["args"]
        obj = ns[name](*(args[0] or []))
        out = [None]
        for op, a in zip(ops[1:], args[1:]):
            out.append(getattr(obj, op)(*(a or [])))
        return out

    if ad == "codec":
        if "Codec" not in ns:
            raise NameError("class Codec is not defined")
        ser, deser = ns["Codec"](), ns["Codec"]()
        data = ser.serialize(_arena_array_to_tree(inp["root"]))
        if not isinstance(data, str):
            raise TypeError("serialize must return a string")
        return _arena_tree_to_array(deser.deserialize(data))

    if ad == "firstBadVersion":
        bad = inp["bad"]
        ns["isBadVersion"] = lambda v: v >= bad
        return _arena_method(ns, "firstBadVersion")(inp["n"])

    fn = _arena_method(ns, h["functionName"])

    if ad == "listCycle":
        nodes = _arena_cycle_list(inp["head"], inp["pos"])
        return fn(nodes[0] if nodes else None)
    if ad == "listCycleIndex":
        nodes = _arena_cycle_list(inp["head"], inp["pos"])
        r = fn(nodes[0] if nodes else None)
        if r is None:
            return -1
        for i, n in enumerate(nodes):
            if n is r:
                return i
        return "Invalid: returned node is not in the list"
    if ad == "intersection":
        a, b = _arena_intersection(inp)
        r = fn(a, b)
        return r.val if r is not None else None
    if ad == "randomList":
        nodes = _arena_random_list(inp["head"])
        return _arena_serialize_random(fn(nodes[0] if nodes else None), nodes)
    if ad == "cloneGraph":
        nodes = _arena_graph(inp["adjList"])
        return _arena_serialize_graph(fn(nodes[0] if nodes else None), nodes)
    if ad == "lca":
        root = _arena_array_to_tree(inp["root"])
        r = fn(root, _arena_find(root, inp["p"]), _arena_find(root, inp["q"]))
        return r.val if r is not None else None
    if ad == "distanceK":
        root = _arena_array_to_tree(inp["root"])
        return fn(root, _arena_find(root, inp["target"]), inp["k"])

    params = h["params"]
    args = [_arena_to_arg(p["type"], inp.get(p["name"])) for p in params]
    ret = fn(*args)

    if ad == "firstK":
        k = ret
        if not isinstance(k, int) or k < 0 or k > len(args[0]):
            return "Invalid k: %r" % (k,)
        return list(args[0][:k])
    if t == "inplace":
        idx = next(i for i, p in enumerate(params) if p["name"] == h["inplaceParam"])
        return _arena_from_ret(params[idx]["type"], args[idx])
    return _arena_from_ret(h.get("returns"), ret)


def _arena_error(e):
    frames = [f for f in traceback.extract_tb(e.__traceback__) if f.filename == "solution.py"]
    line = frames[-1].lineno if frames else None
    msg = "%s: %s" % (type(e).__name__, e)
    if isinstance(e, RecursionError):
        msg = "RecursionError: maximum recursion depth exceeded"
    return msg, line


def _arena_namespace(h):
    ns = {k: v for k, v in _ARENA_BASE.items()}
    ns["__name__"] = "__main__"
    if h.get("adapter") == "cloneGraph":
        ns["Node"] = _ArenaGraphNode
    elif h.get("adapter") == "randomList":
        ns["Node"] = _ArenaRandomNode
    return ns


def _arena_run(user_code, harness_json, cases_json, stop_on_error=False):
    h = json.loads(harness_json)
    cases = json.loads(cases_json)
    try:
        code = compile(user_code, "solution.py", "exec")
    except SyntaxError as e:
        return json.dumps({"compileError": {"message": "%s: %s" % (type(e).__name__, e.msg), "line": e.lineno}, "results": []})

    results = []
    for inp in cases:
        ns = _arena_namespace(h)
        buf = io.StringIO()
        old = sys.stdout
        sys.stdout = buf
        t0 = time.perf_counter()
        try:
            exec(code, ns)
            out = _arena_clean(_arena_case(ns, h, inp))
            ms = (time.perf_counter() - t0) * 1000
            sys.stdout = old
            results.append({"ok": True, "output": out, "stdout": buf.getvalue()[:_ARENA_STDOUT_LIMIT], "ms": ms})
        except BaseException as e:
            ms = (time.perf_counter() - t0) * 1000
            sys.stdout = old
            if isinstance(e, KeyboardInterrupt):
                raise
            msg, line = _arena_error(e)
            results.append({"ok": False, "error": msg, "line": line, "stdout": buf.getvalue()[:_ARENA_STDOUT_LIMIT], "ms": ms})
            if stop_on_error:
                break
        finally:
            sys.stdout = old
    return json.dumps({"results": results})


_ARENA_BASE = {k: v for k, v in globals().items() if not k.startswith("_arena") and not k.startswith("_ARENA") and not k.startswith("_Arena")}
`;

// Small entry point used by the Node validator: reads one JSON job from stdin.
export const PY_CLI = String.raw`
if __name__ == "__main__":
    _job = json.loads(sys.stdin.read())
    sys.stdout.write(_arena_run(_job["code"], json.dumps(_job["harness"]), json.dumps(_job["cases"]), _job.get("stopOnError", False)))
`;
