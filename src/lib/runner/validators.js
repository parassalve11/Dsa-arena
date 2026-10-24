// Custom judges for problems that accept more than one correct answer.
// Each one gets (input, output, expected) and returns true when output is accepted.

export const validators = {
  // Any valid topological order is accepted; [] only when no order exists.
  courseScheduleII(input, output, expected) {
    if (!Array.isArray(output)) return false;
    const n = input.numCourses;
    if (!expected || expected.length === 0) return output.length === 0;
    if (output.length !== n) return false;
    const pos = new Array(n).fill(-1);
    for (let i = 0; i < n; i++) {
      const c = output[i];
      if (!Number.isInteger(c) || c < 0 || c >= n || pos[c] !== -1) return false;
      pos[c] = i;
    }
    return input.prerequisites.every(([a, b]) => pos[b] < pos[a]);
  },

  // Any index that is a peak is accepted.
  peakElement(input, output) {
    const nums = input.nums;
    const i = output;
    if (!Number.isInteger(i) || i < 0 || i >= nums.length) return false;
    const left = i === 0 ? -Infinity : nums[i - 1];
    const right = i === nums.length - 1 ? -Infinity : nums[i + 1];
    return nums[i] > left && nums[i] > right;
  },

  // Any correctly completed board that keeps the original clues is accepted.
  sudoku(input, output) {
    if (!Array.isArray(output) || output.length !== 9) return false;
    const rows = Array.from({ length: 9 }, () => new Set());
    const cols = Array.from({ length: 9 }, () => new Set());
    const boxes = Array.from({ length: 9 }, () => new Set());
    for (let i = 0; i < 9; i++) {
      if (!Array.isArray(output[i]) || output[i].length !== 9) return false;
      for (let j = 0; j < 9; j++) {
        const v = output[i][j];
        if (typeof v !== "string" || !/^[1-9]$/.test(v)) return false;
        if (input.board[i][j] !== "." && input.board[i][j] !== v) return false;
        const b = Math.floor(i / 3) * 3 + Math.floor(j / 3);
        if (rows[i].has(v) || cols[j].has(v) || boxes[b].has(v)) return false;
        rows[i].add(v);
        cols[j].add(v);
        boxes[b].add(v);
      }
    }
    return true;
  },

  // Any palindromic substring of maximum length is accepted.
  longestPalindrome(input, output, expected) {
    if (typeof output !== "string") return false;
    if (output.length !== expected.length) return false;
    if (!input.s.includes(output)) return false;
    return output === [...output].reverse().join("");
  },
};
