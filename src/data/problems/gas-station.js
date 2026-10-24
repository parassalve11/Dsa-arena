import { ints } from "../gen.js";

// Random stations, then the first station gets just enough extra gas that the
// total is exactly enough, which makes the answer unique.
function big(n, seed, solvable = true) {
  const gas = ints(n, 0, 10000, seed);
  const cost = ints(n, 0, 10000, seed + 1);
  const diff = cost.reduce((a, b) => a + b, 0) - gas.reduce((a, b) => a + b, 0);
  const k = Math.floor(n / 3);
  if (diff > 0) gas[k] += diff + (solvable ? 0 : -1);
  else cost[k] += -diff + (solvable ? 0 : 1);
  return { gas, cost };
}

export default {
  slug: "gas-station",
  description: `There are \`n\` gas stations on a **circular** route. Station \`i\` has \`gas[i]\` gas, and driving from station \`i\` to station \`i + 1\` costs \`cost[i]\` gas.

You have a car with an unlimited tank that starts **empty** at one of the stations.

Return the index of the starting station from which you can drive **once around the circuit** clockwise, or \`-1\` if it is impossible. If a solution exists, it is guaranteed to be **unique**.`,
  examples: [
    { input: { gas: [1, 2, 3, 4, 5], cost: [3, 4, 5, 1, 2] }, explanation: "Starting at station 3 you never run out: 4-1, +5-2, +1-3, +2-4, +3-5 keeps the tank at 0 or more." },
    { input: { gas: [2, 3, 4], cost: [3, 4, 3] }, explanation: "The total gas (9) is less than the total cost (10), so no start works." },
    { input: { gas: [5], cost: [4] }, explanation: "A single station with enough gas." },
  ],
  constraints: ["n == gas.length == cost.length", "1 <= n <= 10^5", "0 <= gas[i], cost[i] <= 10^4", "If a solution exists, it is unique."],
  harness: { fn: "canCompleteCircuit", params: { gas: "int[]", cost: "int[]" }, returns: "int" },
  tests: [
    { gas: [1], cost: [2] },
    { gas: [2], cost: [2] },
    { gas: [3, 1, 1], cost: [1, 2, 2] },
    { gas: [1, 2], cost: [2, 1] },
    { gas: [5, 1, 2, 3, 4], cost: [4, 4, 1, 5, 1] },
    { gas: [4, 5, 2, 6, 5, 3], cost: [3, 2, 7, 3, 2, 9] },
    { gas: [2, 0, 1, 2, 3, 4, 0], cost: [0, 1, 0, 0, 0, 0, 11] },
    { gas: [6, 1, 4, 3, 5], cost: [3, 8, 2, 4, 2] },
    { gas: [0, 0, 0, 10], cost: [1, 1, 1, 7] },
    { gas: [4, 0, 0], cost: [1, 1, 1] },
    { gas: [1, 1, 1], cost: [1, 2, 1] },
    { gas: [3, 3, 4], cost: [3, 4, 4] },
    big(100000, 1),
    big(100000, 2, false),
    big(99999, 3),
  ],
  answer: {
    approach: [
      "If the total gas is less than the total cost, no start can work: return -1. Otherwise a valid start exists.",
      "Drive from station 0, keeping a running tank = sum of (gas[i] - cost[i]) since the current candidate start.",
      "If the tank goes negative at station i, no station between the candidate and i can be the start either (they would arrive at i with even less gas). So set the candidate to i + 1 and reset the tank to 0.",
      "The candidate left at the end is the answer.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function canCompleteCircuit(gas, cost) {
    let total = 0, tank = 0, start = 0;
    for (let i = 0; i < gas.length; i++) {
        const d = gas[i] - cost[i];
        total += d;
        tank += d;
        if (tank < 0) {
            start = i + 1;
            tank = 0;
        }
    }
    return total < 0 ? -1 : start;
}`,
    python: `class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        if sum(gas) < sum(cost):
            return -1
        tank = start = 0
        for i in range(len(gas)):
            tank += gas[i] - cost[i]
            if tank < 0:
                start, tank = i + 1, 0
        return start`,
  },
};
