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

    solvePart1(grid);
    solvePart2(grid);
  } catch (error) {
    console.error(error);
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

type Direction = [number, number]
type Coordinate = [number, number]
type Cost = number

const directions: Direction[] = [
  [0, -1], // west
  [0, 1], // east
  [-1, 0], // north
  [1, 0], // south
];

function isValid(grid: string[][], x: number, y: number) {
  return x >= 0 && x < grid.length && y >= 0 && y < grid[0].length && grid[x][y] !== "#";
}

// function calculateTurnCost(prevDir: Direction, currDir: Direction) {
//   if (prevDir.toString() === currDir.toString()) return 0
//   if (Math.abs(prevDir[0] - currDir[0]) )

// }


function bfs(grid: string[][], start: [number, number], end: [number, number]) {
  const queue: [Coordinate, Cost, Direction, Coordinate[]][] = [[start, 0, [0, 1], [start]]];
  const visited = new Set<string>();
  visited.add(start.toString());

  const solutions: { cost: number, path: Coordinate[] }[] = [];

  while (queue.length) {
    const [[x, y], cost, prevDir, path] = queue.shift()!;
    if (x === end[0] && y === end[1]) {
      solutions.push({ cost, path });
      continue;
    }

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      const turnCost = prevDir && (prevDir[0] !== dx || prevDir[1] !== dy) ? 1000 : 0; // Adjusted turn cost
      const newCost = cost + turnCost + 1;

      if (isValid(grid, nx, ny) && !visited.has([nx, ny].toString())) {
        queue.push([[nx, ny], newCost, [dx, dy], [...path, [nx, ny]]]);
        if (!(nx === end[0] && ny === end[1])) {
          visited.add([nx, ny].toString());
        }
      }
    }
  }

  return solutions;
}

function solvePart1(grid: string[][]) {
  const start = findChar(grid, "S");
  const end = findChar(grid, "E");

  const solutions = bfs(grid, start, end)


  console.log("Part 1:", solutions);
}

function solvePart2(grid: string[][]) {
  // console.log("Part 2:", grid);
}

main();
