/**
 * https://adventofcode.com/2024
 * Disclaimer: Looks ugly, there may be duplication and not optimized, but it works.
 */

function extractCoordinates(data: string): number[][][] {
  const regex =
    /Button A: X\+(\d+), Y\+(\d+)\s+Button B: X\+(\d+), Y\+(\d+)\s+Prize: X=(\d+), Y=(\d+)/g;
  const result: number[][][] = [];
  let match;

  while ((match = regex.exec(data)) !== null) {
    const buttonA = [parseInt(match[1]), parseInt(match[2])];
    const buttonB = [parseInt(match[3]), parseInt(match[4])];
    const prize = [parseInt(match[5]), parseInt(match[6])];
    result.push([buttonA, buttonB, prize]);
  }
  return result;
}

async function main() {
  try {
    const __dirname = new URL(".", import.meta.url).pathname;
    // const data = await Deno.readTextFile(__dirname + "/small-input.txt");
    const data = await Deno.readTextFile(__dirname + "/input.txt");

    solvePart1(data);
    solvePart2(data);
  } catch (error) {
    console.error(error);
  }
}

function solveEquation(coordinates: number[][]) {
  const [buttonA, buttonB, prize] = coordinates;

  const determinant: number = buttonA[0] * buttonB[1] - buttonA[1] * buttonB[0];

  if (determinant === 0) {
    return null;
  }

  const x: number = (prize[0] * buttonB[1] - prize[1] * buttonB[0]) /
    determinant;
  const y: number = (buttonA[0] * prize[1] - buttonA[1] * prize[0]) /
    determinant;

  return [x, y];
}

function solvePart1(data: string) {
  const problems = extractCoordinates(data);

  let totalCost = 0;

  const COST_OF_A = 3;
  const COST_OF_B = 1;

  for (const prob of problems) {
    const [x, y] = solveEquation(prob);

    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      // console.log("No solution found");
      continue;
    }

    totalCost += COST_OF_A * Math.abs(x) + COST_OF_B * Math.abs(y);
  }

  console.log("Part 1:", totalCost);
}

function solvePart2(data: string) {
  const problems = extractCoordinates(data);
  const fixedProblems = problems.map((prob) => {
    return [prob[0], prob[1], [
      prob[2][0] + 10000000000000,
      prob[2][1] + 10000000000000,
    ]];
  });

  let totalCost = 0;

  const COST_OF_A = 3;
  const COST_OF_B = 1;

  for (const prob of fixedProblems) {
    const [x, y] = solveEquation(prob);

    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      // console.log("No solution found");
      continue;
    }

    totalCost += COST_OF_A * Math.abs(x) + COST_OF_B * Math.abs(y);
  }

  console.log("Part 2:", totalCost);
}

main();
