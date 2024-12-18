/**
 * https://adventofcode.com/2024
 * Disclaimer: Looks ugly, there may be duplication and not optimized, but it works.
 */

async function main() {
  try {
    const __dirname = new URL(".", import.meta.url).pathname;
    // const data = await Deno.readTextFile(__dirname + "/small-input.txt");
    const data = await Deno.readTextFile(__dirname + "/input.txt");

    const coords = data.split("\n").map((line) => line.split(",").map(Number));
    const GRID_SIZE = 71; // 71 for the big input

    const grid = new Array(GRID_SIZE).fill(null).map(() => new Array(GRID_SIZE).fill("."));

    solvePart1(coords, grid);
    solvePart2(coords, grid);
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
  return x >= 0 && x < grid[0].length && y >= 0 && y < grid.length;
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
      if (isSafe(grid, nx, ny) && !visited.has([nx, ny].toString()) && grid[nx][ny] !== '#') {
        queue.push([[nx, ny], steps + 1]);
        visited.add([nx, ny].toString());
      }
    }
  }

  return -1;

}


function solvePart1(coords: number[][], grid: string[][]) {

  const numberOfBytes = 1024;
  for (let i = 0; i < numberOfBytes; i++) {
    const [x, y] = coords[i];
    grid[y][x] = '#';
  }


  const start: [number, number] = [0, 0];
  const end: [number, number] = [70, 70];
  const steps = bfs(grid, start, end);

  console.log("Part 1:", steps);

}

function solvePart2(coords: number[][], grid: string[][]) {

  // assumption that the grid has already been mutated
  // after the first 1024 bytes
  for (let i = 1024; i < coords.length; i++) {
    const [x, y] = coords[i];
    grid[y][x] = '#';

    const steps = bfs(grid, [0, 0], [70, 70]);
    if (steps === -1) {
      console.log("Part 2:", [x, y].toString(), steps);
      break;
    }

  }

  // console.log("Part 2:", data);
}

main();
