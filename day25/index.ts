/**
 * https://adventofcode.com/2024
 * Disclaimer: Looks ugly, there may be duplication and not optimized, but it works.
 */

async function main() {
  try {
    const __dirname = new URL(".", import.meta.url).pathname;
    // const data = await Deno.readTextFile(__dirname + "/small-input.txt");
    const data = await Deno.readTextFile(__dirname + "/input.txt");

    const blocks = getBlocks(data)

    solvePart1(blocks.map(b => transpose(b)));
    // solvePart2(data);
  } catch (error) {
    console.error(error);
  }
}

function transpose(matrix: any[][]): any[][] {
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

function getBlocks(data: string) {
  const lines = data.split('\n').map(x => x.split(''))

  return lines.filter(l => l.length > 0).reduce<string[][][]>((acc, curr, index) => {
    if (index % 7 === 0) {
      acc.push([curr])
    } else {
      acc[acc.length - 1].push(curr)
    }
    return acc
  }, [])
}

function getHeights(block: string[][]) {
  // if (block[0][0] === '#') {
  //   return block.map(row => row.filter(r => r === '#').length - 1)
  // }
  return block.map(row => row.filter(r => r === '#').length - 1)
}

function solvePart1(blocks: string[][][]) {
  const locks = []
  const keys = []

  for (const block of blocks) {
    if (block[0][0] === '#') {
      locks.push(getHeights(block))
    } else {
      keys.push(getHeights(block))
    }
  }

  const overlaps = []
  const fits = []

  for (const l of locks) {
    for (const k of keys) {
      let overlap = false
      for (let i = 0; i < k.length; i += 1) {
        if (l[i] + k[i] > 5) overlap = true
      }
      overlap ? overlaps.push([l, k]) : fits.push([l, k])
    }
  }

  console.log("Part 1:", fits.length);
}

function solvePart2(data: string) {
  // console.log("Part 2:", data);
}

main();
