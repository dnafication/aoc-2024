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

function solvePart1(data: string[][]) {



  console.log("Part 1:", data);
}

function solvePart2(data: string[][]) {
  // console.log("Part 2:", data);
}

main();
