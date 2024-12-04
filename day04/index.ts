/**
 * https://adventofcode.com/2024/day/4
 */

async function main() {
  try {
    const __dirname = new URL(".", import.meta.url).pathname;
    const data = await Deno.readTextFile(__dirname + "/input.txt");
    const grid: string[] = data.split("\n");

    const word = "XMAS";
    type Direction = [number, number];

    function findWord(
      grid: string[],
      word: string,
    ): [number, number, Direction][] {
      const foundPositions: Array<[number, number, Direction]> = [];
      const rows = grid.length;
      const cols = grid[0].length;

      const directions: Direction[] = [
        [1, 0], // right
        [-1, 0], // left
        [0, 1], // down
        [0, -1], // up
        [1, 1], // right-down
        [1, -1], // right-up
        [-1, -1], // left-up
        [-1, 1], // left-down
      ];

      /**
       * finds the word in a specific coordinate in the grid and returns true or false
       * @param x
       * @param y
       * @param direction
       */
      function search(
        x: number,
        y: number,
        direction: [number, number],
      ): boolean {
        for (let i = 0; i < word.length; i++) {
          const [dx, dy] = direction;
          const newX = x + i * dx;
          const newY = y + i * dy;
          if (
            newX < 0 || newX >= rows || newY < 0 || newY >= cols ||
            grid[newX][newY] !== word[i]
          ) {
            return false;
          }
        }
        return true;
      }

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          for (let direction of directions) {
            if (search(i, j, direction)) {
              foundPositions.push([i, j, direction]);
            }
          }
        }
      }

      return foundPositions;
    }

    console.log("Part 1:", findWord(grid, word).length);

    /**
     * Part 2 looks a bit more complicated.
     * We need to find 4 variation of the word MAS crossed with MAS. it can be one of the following:
     *
     * M.S
     * .A.
     * M.S
     *
     * M.M
     * .A.
     * S.S
     *
     * S.M
     * .A.
     * S.M
     *
     * S.S
     * .A.
     * M.M
     */

    const patterns = [
      [/M.+S/, /.+A.+/, /M.+S/],
      [/M.+M/, /.+A.+/, /S.+S/],
      [/S.+M/, /.+A.+/, /S.+M/],
      [/S.+S/, /.+A.+/, /M.+M/],
    ];

    function findWord2(
      grid: string[],
      patterns: RegExp[][],
    ): [number, number][] {
      const foundPositions: Array<[number, number]> = [];
      const rows = grid.length;
      const cols = grid[0].length;

      for (let i = 0; i < rows - 2; i++) {
        for (let j = 0; j < cols - 2; j++) {
          for (let pattern of patterns) {
            const [row1, row2, row3] = pattern;
            if (
              row1.test(grid[i].slice(j, j + 3)) &&
              row2.test(grid[i + 1].slice(j, j + 3)) &&
              row3.test(grid[i + 2].slice(j, j + 3))
            ) {
              foundPositions.push([i, j]);
            }
          }
        }
      }

      return foundPositions;
    }

    console.log("Part 2:", findWord2(grid, patterns).length);
  } catch (error) {
    console.error(error);
  }
}

main();
