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

    // solvePart1(data);
    solvePart2(data);

  } catch (error) {
    console.error(error);
  }
}

function expandData(data: string): string[] {
  const expandedData = [];
  let fileId = 0;
  let fileMarker = true;

  for (const char of data) {
    const block = new Array(parseInt(char)).fill(
      fileMarker ? fileId.toString() : ".",
    );
    if (fileMarker) {
      fileId += 1;
    }
    expandedData.push(...block);
    fileMarker = !fileMarker;
  }

  return expandedData;
}

/**
 * Move file blocks from end to the leftmost free space
 * @param params
 */
function moveFileBlocks(list: string[]) {
  for (let i = 0; i < list.length; i++) {
    if (list[i] === ".") {
      let lastBlock = list.pop();
      while (list.length && lastBlock === ".") {
        lastBlock = list.pop();
      }

      if (lastBlock !== undefined) {
        list[i] = lastBlock;
      }
    }
  }

  return list;
}

function solvePart1(data: string) {
  const expandedData = expandData(data);
  const orderedData = moveFileBlocks(expandedData);

  let answer = 0;
  for (let i = 0; i < orderedData.length; i++) {
    answer += parseInt(orderedData[i]) * i;
  }
  console.log(`Part 1: ${answer}`);
}

function solvePart2(data: string) {
  const expandedData = []

  let fileId = 0;
  let fileMarker = true;
  for (const char of data) {
    const block = new Array(parseInt(char)).fill(
      fileMarker ? fileId.toString() : ".",
    );
    if (fileMarker) {
      fileId += 1;
    }
    if (block.length > 0) expandedData.push(block);
    fileMarker = !fileMarker;
  }

  console.log(expandedData);

  // for (let i = expandedData.length - 1; i >= 1; i -= 1) {
  //   const curr = expandedData[i];

  // }


}

main();
