/**
 * https://adventofcode.com/2024
 * Disclaimer: Looks ugly, there may be duplication and not optimized, but it works.
 */

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

function solvePart1(data: string) {
  console.log("Part 1:");
}

function solvePart2(data: string) {
  console.log("Part 2:");
}

main();
