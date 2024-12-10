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

function solvePart1(data: string) {
  console.log("Part 1:", data);
}

function solvePart2(data: string) {
  console.log("Part 2: ");
}

main();
