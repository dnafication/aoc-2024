/**
 * https://adventofcode.com/2024
 * Disclaimer: Looks ugly, there may be duplication and not optimized, but it works.
 */

import { parseArgs } from "jsr:@std/cli/parse-args";

async function main() {
  try {
    // const __dirname = new URL(".", import.meta.url).pathname;
    const args = parseArgs(Deno.args, {
      string: ["input"],
      alias: { i: "input" },
    });

    if (!args.input) {
      console.error("Input file is required. Use -i or --input");
      Deno.exit(1);
    }

    const data = await Deno.readTextFile(args.input);

    solvePart1(data);
    solvePart2(data);
  } catch (error) {
    console.error(error);
  }
}

type Point = [number, number];

function solvePart1(data: string) {
  const grid = data.split("\n").map((row) => row.split("").map(Number));
  const trailHeads = [];
  const rows = grid.length;
  const cols = grid[0].length;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 0) {
        trailHeads.push([i, j]);
      }
    }
  }

  const isValid = (point: Point) =>
    point[0] >= 0 && point[0] < rows && point[1] >= 0 && point[1] < cols;

  function getReachablePeaks(trailHead: Point) {
    let peaks: string[] = [];

    function getReachablePeak(from: Point) {
      if (grid[from[0]][from[1]] === 9) {
        if (!peaks.includes(from.toString())) {
          peaks.push(from.toString());
          return 1;
        }
        return 0;
      }

      const right: Point = [from[0], from[1] + 1];
      const down: Point = [from[0] + 1, from[1]];
      const left: Point = [from[0], from[1] - 1];
      const up: Point = [from[0] - 1, from[1]];

      if (
        isValid(right) &&
        grid[right[0]][right[1]] - grid[from[0]][from[1]] === 1
      ) {
        getReachablePeak(right);
      }

      if (
        isValid(down) && grid[down[0]][down[1]] - grid[from[0]][from[1]] === 1
      ) {
        getReachablePeak(down);
      }

      if (
        isValid(left) && grid[left[0]][left[1]] - grid[from[0]][from[1]] === 1
      ) {
        getReachablePeak(left);
      }

      if (isValid(up) && grid[up[0]][up[1]] - grid[from[0]][from[1]] === 1) {
        getReachablePeak(up);
      }
    }

    getReachablePeak(trailHead);
    return peaks.length;
  }

  const score = trailHeads.reduce((acc, trailHead) => {
    const peaks = getReachablePeaks(trailHead);
    return acc + peaks;
  }, 0);

  console.log("Part 1: ", score);
}

function solvePart2(data: string) {
  const grid = data.split("\n").map((row) => row.split("").map(Number));
  const trailHeads = [];
  const rows = grid.length;
  const cols = grid[0].length;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 0) {
        trailHeads.push([i, j]);
      }
    }
  }

  const isValid = (point: Point) =>
    point[0] >= 0 && point[0] < rows && point[1] >= 0 && point[1] < cols;

  function getReachablePeaks(trailHead: Point) {
    let peaks: string[] = [];

    function getReachablePeak(from: Point) {
      if (grid[from[0]][from[1]] === 9) {
        peaks.push(from.toString());
      }

      const right: Point = [from[0], from[1] + 1];
      const down: Point = [from[0] + 1, from[1]];
      const left: Point = [from[0], from[1] - 1];
      const up: Point = [from[0] - 1, from[1]];

      if (
        isValid(right) &&
        grid[right[0]][right[1]] - grid[from[0]][from[1]] === 1
      ) {
        getReachablePeak(right);
      }

      if (
        isValid(down) && grid[down[0]][down[1]] - grid[from[0]][from[1]] === 1
      ) {
        getReachablePeak(down);
      }

      if (
        isValid(left) && grid[left[0]][left[1]] - grid[from[0]][from[1]] === 1
      ) {
        getReachablePeak(left);
      }

      if (isValid(up) && grid[up[0]][up[1]] - grid[from[0]][from[1]] === 1) {
        getReachablePeak(up);
      }
    }

    getReachablePeak(trailHead);
    return peaks.length;
  }

  const score = trailHeads.reduce((acc, trailHead) => {
    const peaks = getReachablePeaks(trailHead);
    return acc + peaks;
  }, 0);

  console.log("Part 2: ", score);
}

main();
