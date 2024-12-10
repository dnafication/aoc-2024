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


/// 00...111...2...333.44.5555.6666.777.888899
/// 00992111777.44.333....5555.6666.....8888..

function solvePart2(data: string) {
  const diskMap = [];
  let fileMarker = true;
  for (let i = 0; i < data.length; i++) {
    if (fileMarker) {
      diskMap.push({
        files: new Array(parseInt(data[i])).fill(Math.floor(i / 2)),
        freeSpace: 0
      });
    } else {
      diskMap.push({
        files: [],
        freeSpace: parseInt(data[i])
      });
    }
    fileMarker = !fileMarker;
  }

  console.log("diskMap", diskMap);

  for (let i = diskMap.length - 1; i >= 0; i--) {
    if (diskMap[i].freeSpace > 0) {
      continue;
    }

    for (let j = 0; j < i; j++) {
      if (diskMap[j].freeSpace >= diskMap[i].files.length) {
        diskMap[j].files.push(...diskMap[i].files);
        diskMap[j].freeSpace -= diskMap[i].files.length;
        diskMap[i].freeSpace = diskMap[i].files.length;
        diskMap[i].files = [];
        break;
      }
    }
  }

  // reconstruct the disk
  const disk = [];
  for (let i = 0; i < diskMap.length; i++) {
    disk.push(...diskMap[i].files);
    if (diskMap[i].freeSpace > 0) {
      disk.push(...new Array(diskMap[i].freeSpace).fill("."));
    }
  }

  console.log("disk", disk);

  let answer = 0;
  for (let i = 0; i < disk.length; i++) {
    if (disk[i] === ".") {
      continue;
    }
    answer += disk[i] * i;
  }
  console.log(`Part 2: ${answer}`);


  // console.log("diskMap", diskMap);
}

// function solvePart2(data: string) {
//   const files = [];
//   const freeSpaces = [];
//   let fileMarker = true;
//   for (const char of data) {
//     if (fileMarker) {
//       files.push(parseInt(char));
//     } else {
//       freeSpaces.push(parseInt(char));
//     }
//     fileMarker = !fileMarker;
//   }

//   console.log(files, freeSpaces);

//   const blocksToMove: Record<string, Array<number>> = {};

//   for (let i = files.length - 1; i >= 0; i--) {
//     for (let j = 0; j < freeSpaces.length; j++) {
//       if (files[i] <= freeSpaces[j]) {
//         Array.isArray(blocksToMove[j])
//           ? blocksToMove[j].push(...new Array(files[i]).fill(i))
//           : blocksToMove[j] = [...new Array(files[i]).fill(i)];
//         freeSpaces[j] -= files[i];
//         freeSpaces[i - 1] = files[i];
//         files[i] = 0;
//         break;
//       }
//     }
//   }
//   console.log("f1", files);
//   console.log("fs", freeSpaces);
//   console.log("btm", blocksToMove);

//   const zipped = [];

//   for (let i = 0; i < files.length; i++) {
//     zipped.push(...new Array(files[i]).fill(i));
//     if (blocksToMove[i]) {
//       zipped.push(...blocksToMove[i]);
//     }
//     if (freeSpaces[i] > 0) {
//       zipped.push(...new Array(freeSpaces[i]).fill("."));
//     }
//   }

//   console.log("data", expandData(data).join(""));
//   console.log("zipped", zipped.join(""));
// }
/// 00...111...2...333.44.5555.6666.777.888899
/// 00992111777.44.333....5555.6666.....8888..

main();
