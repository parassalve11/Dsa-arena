import { grid, randInt } from "../gen.js";

const big = grid(50, 50, (r) => (r() < 0.65 ? 1 : randInt(r, 0, 3)), 1);

export default {
  slug: "flood-fill",
  description: `An image is given as an \`m x n\` grid of integers, where \`image[i][j]\` is a pixel's colour. You are also given a starting pixel \`(sr, sc)\` and a new \`color\`.

Perform a **flood fill** from the starting pixel: change it to \`color\`, then do the same for every pixel connected to it **up, down, left or right** that had the **same original colour**, spreading outwards.

Return the changed image.`,
  examples: [
    { input: { image: [[1, 1, 1], [1, 1, 0], [1, 0, 1]], sr: 1, sc: 1, color: 2 }, explanation: "All 1s connected to the centre become 2. The bottom-right 1 is only diagonally connected, so it stays." },
    { input: { image: [[0, 0, 0], [0, 0, 0]], sr: 0, sc: 0, color: 0 }, explanation: "The new colour equals the old one, so nothing changes." },
    { input: { image: [[0, 1], [1, 0]], sr: 0, sc: 1, color: 5 }, explanation: "Only the starting pixel has colour 1 among its neighbours." },
  ],
  constraints: ["m == image.length, n == image[i].length", "1 <= m, n <= 50", "0 <= image[i][j], color < 2^16", "0 <= sr < m, 0 <= sc < n"],
  harness: { fn: "floodFill", params: { image: "int[][]", sr: "int", sc: "int", color: "int" }, returns: "int[][]" },
  tests: [
    { image: [[0]], sr: 0, sc: 0, color: 2 },
    { image: [[7]], sr: 0, sc: 0, color: 7 },
    { image: [[1, 1], [1, 1]], sr: 1, sc: 1, color: 3 },
    { image: [[1, 2], [3, 4]], sr: 0, sc: 0, color: 9 },
    { image: [[1, 0, 1], [0, 1, 0], [1, 0, 1]], sr: 1, sc: 1, color: 2 },
    { image: [[0, 0, 0], [0, 1, 1]], sr: 1, sc: 1, color: 1 },
    { image: [[2, 2, 2, 2], [2, 0, 0, 2], [2, 0, 0, 2], [2, 2, 2, 2]], sr: 0, sc: 0, color: 5 },
    { image: [[2, 2, 2, 2], [2, 0, 0, 2], [2, 0, 0, 2], [2, 2, 2, 2]], sr: 2, sc: 2, color: 5 },
    { image: [[1, 1, 1, 1, 1]], sr: 0, sc: 4, color: 0 },
    { image: [[1], [1], [0], [1]], sr: 0, sc: 0, color: 8 },
    { image: [[65535, 0], [65535, 65535]], sr: 1, sc: 0, color: 1 },
    { image: [[3, 3, 3], [3, 2, 3], [3, 3, 3]], sr: 1, sc: 1, color: 3 },
    { image: big, sr: 0, sc: 0, color: 9 },
    { image: Array.from({ length: 50 }, () => new Array(50).fill(4)), sr: 25, sc: 25, color: 6 },
  ],
  answer: {
    approach: [
      "Remember the starting pixel's original colour. If it already equals the new colour, return the image unchanged (otherwise the fill would loop forever).",
      "Run a DFS or BFS from (sr, sc). Recolour each visited pixel.",
      "From each pixel, move to the four neighbours that are inside the grid and still have the original colour.",
      "Recolouring doubles as the 'visited' mark, so no extra set is needed.",
    ],
    time: "O(m · n)",
    space: "O(m · n) for the stack in the worst case",
    javascript: `function floodFill(image, sr, sc, color) {
    const old = image[sr][sc];
    if (old === color) return image;
    const stack = [[sr, sc]];
    image[sr][sc] = color;
    while (stack.length) {
        const [r, c] = stack.pop();
        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < image.length && nc >= 0 && nc < image[0].length && image[nr][nc] === old) {
                image[nr][nc] = color;
                stack.push([nr, nc]);
            }
        }
    }
    return image;
}`,
    python: `class Solution:
    def floodFill(self, image: List[List[int]], sr: int, sc: int, color: int) -> List[List[int]]:
        old = image[sr][sc]
        if old == color:
            return image
        m, n = len(image), len(image[0])
        stack = [(sr, sc)]
        image[sr][sc] = color
        while stack:
            r, c = stack.pop()
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < m and 0 <= nc < n and image[nr][nc] == old:
                    image[nr][nc] = color
                    stack.append((nr, nc))
        return image`,
  },
};
