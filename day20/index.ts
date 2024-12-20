/**
 * https://adventofcode.com/2024
 * Disclaimer: Looks ugly, there may be duplication and not optimized, but it works.
 */

async function main() {
  try {
    const __dirname = new URL(".", import.meta.url).pathname;
    // const data = await Deno.readTextFile(__dirname + "/small-input.txt");
    const data = await Deno.readTextFile(__dirname + "/input.txt");
    const grid = data.split("\n").map((row) => row.split(""));

    // solvePart1(grid);
    solvePart2(grid);
  } catch (error) {
    console.error(error);
  }
}

const directions = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
];

function isSafe(grid: string[][], x: number, y: number) {
  return x >= 0 && x < grid[0].length && y >= 0 && y < grid.length && grid[x][y] !== '#';
}

function bfs(grid: string[][], start: [number, number], end: [number, number]) {
  const queue: [[number, number], number][] = [[start, 0]];
  const visited = new Set<string>();
  visited.add(start.toString());

  while (queue.length) {
    const [[x, y], steps] = queue.shift()!;
    if (x === end[0] && y === end[1]) {
      return steps;
    }

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (isSafe(grid, nx, ny) && !visited.has([nx, ny].toString())) {
        queue.push([[nx, ny], steps + 1]);
        visited.add([nx, ny].toString());
      }
    }
  }
}

function findChar(grid: string[][], char: string): [number, number] {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === char) {
        return [i, j];
      }
    }
  }

  return [-1, -1];
}

function findWallsToDestroy(grid: string[][]) {
  const walls: [number, number][] = []

  for (let i = 1; i < grid.length - 1; i += 1) {
    for (let j = 1; j < grid[0].length - 1; j += 1) {
      if (grid[i][j] === '#') {
        walls.push([i, j])
      }
    }
  }

  return walls;

}

function solvePart1(grid: string[][]) {

  const start = findChar(grid, 'S')
  const end = findChar(grid, 'E')

  // const steps = bfs(grid, start, end)
  const walls = findWallsToDestroy(grid)

  const stepsArray: number[] = []

  for (const wall of walls) {
    const [wx, wy] = wall
    const gridCopy = structuredClone(grid)
    gridCopy[wx][wy] = '.'

    stepsArray.push(bfs(gridCopy, start, end))
  }

  const maxSteps = Math.max(...stepsArray)
  const stepsSaved = stepsArray.map(s => maxSteps - s)

  // const result = stepsSaved.filter(s => s > 0).sort((a, b) => a - b).reduce<Record<string, number>>((acc, curr) => {
  //   if (acc[curr]) {
  //     acc[curr] += 1
  //   } else {
  //     acc[curr] = 1
  //   }
  //   return acc
  // }, {})

  const result = stepsSaved.filter(s => s > 99)

  console.log("Part 1:", result.length);
}

function solvePart2(grid: string[][]) {

  const maxWallsToDestroy = 20

  console.log("Part 2:", grid);
}

main();
