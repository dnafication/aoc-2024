/**
 * https://adventofcode.com/2024
 * Disclaimer: Looks ugly, there may be duplication and not optimized, but it works.
 */

async function main() {
  try {
    const __dirname = new URL(".", import.meta.url).pathname;
    const data = await Deno.readTextFile(__dirname + "/small-input.txt");
    // const data = await Deno.readTextFile(__dirname + "/input.txt");

    const grid = data.split("\n").map((row) => row.split(""));

    solvePart1(grid);
    solvePart2(grid);
  } catch (error) {
    console.error(error);
  }
}

const isValid = (i: number, j: number, grid: string[][]) => {
  return i >= 0 && i < grid.length && j >= 0 && j < grid[0].length;
};

const getNeighbours = (i: number, j: number, data: string[][]) => {
  const neighbours = []; // array of coordinates and value encoded as string, eg: "1,2-A"
  (isValid(i - 1, j, data))
    ? neighbours.push(`${i - 1},${j}#${data[i - 1][j]}`)
    : neighbours.push(`${i - 1},${j}#outerspace`); // up
  (isValid(i + 1, j, data))
    ? neighbours.push(`${i + 1},${j}#${data[i + 1][j]}`)
    : neighbours.push(`${i + 1},${j}#outerspace`); // down
  (isValid(i, j - 1, data))
    ? neighbours.push(`${i},${j - 1}#${data[i][j - 1]}`)
    : neighbours.push(`${i},${j - 1}#outerspace`); // left
  (isValid(i, j + 1, data))
    ? neighbours.push(`${i},${j + 1}#${data[i][j + 1]}`)
    : neighbours.push(`${i},${j + 1}#outerspace`); // right
  return neighbours;
};

const getPerimeter = (region: string[], grid: string[][]) => {
  // const perimeterSet = new Set();
  const perimeter: string[] = [];
  region.forEach((coord) => {
    const [i, j] = coord.split("#")[0].split(",").map(Number);
    const value = coord.split("#")[1];
    const neighbours = getNeighbours(i, j, grid);
    neighbours.forEach((neighbour) => {
      if (value !== neighbour.split("#")[1]) {
        perimeter.push(neighbour);
      }
    });
  });
  return Array.from(perimeter);
};

function solvePart1(data: string[][]) {
  const regions = getRegions(data);

  let totalPrice = 0;
  for (let region of regions) {
    const perimeter = getPerimeter(region, data);
    // console.log(`${region.length} * ${perimeter.length}`)
    totalPrice += perimeter.length * region.length;
  }

  console.log("Part 1:", totalPrice);
}

function getRegions(data: string[][]) {
  const regions = []; // array of regions (arrays of coordinates and value encoded as string, eg: "1,2-A")

  const row = data.length;
  const col = data[0].length;

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      const value = data[i][j];
      const currentKey = `${i},${j}#${value}`;

      if (regions.length === 0) {
        regions.push([currentKey]);
        continue;
      }

      const neighbours = getNeighbours(i, j, data);
      let mergedRegion = null;

      for (const region of regions) {
        if (
          region.some((coord) => neighbours.includes(coord)) &&
          region[0].split("#")[1] === value
        ) {
          if (mergedRegion) {
            mergedRegion.push(...region);
            regions.splice(regions.indexOf(region), 1);
          } else {
            region.push(currentKey);
            mergedRegion = region;
          }
        }
      }

      if (!mergedRegion) {
        regions.push([currentKey]);
      }
    }
  }

  return regions;
}

function getSides(perimeter: string[]) {
  const sides = new Set();
  const xGroups: Record<string, number[][]> = {};
  const yGroups: Record<string, number[][]> = {};

  perimeter.forEach((coord) => {
    const [i, j] = coord.split("#")[0].split(",").map(Number);
    if (!xGroups[i]) {
      xGroups[i] = [];
    }
    if (!yGroups[j]) {
      yGroups[j] = [];
    }
    xGroups[i].push([i, j]);
    yGroups[j].push([i, j]);
  });

  for (const x in xGroups) {
    xGroups[x].sort((a, b) => a[1] - b[1]);
    console.log(xGroups[x]);
  }

  for (const y in yGroups) {
    yGroups[y].sort((a, b) => a[0] - b[0]);
    console.log(yGroups[y]);
  }

  function combineIntoLines(group: [string, string][]) {
    const lines = [];

    for (let i = 0; i < group.length; i++) {
      const [i1, j1] = group[i];
      for (let j = i + 1; j < group.length; j++) {
        const [i2, j2] = group[j];
        if (i1 === i2) {
          lines.push([i1, j1, i2, j2]);
        } else if (j1 === j2) {
          lines.push([i1, j1, i2, j2]);
        }
      }
    }
  }

  console.log(xGroups);
  console.log(yGroups);
}

function solvePart2(data: string[][]) {
  const regions = getRegions(data);
  const perimeter = getPerimeter(regions[0], data);
  console.log(perimeter);

  const sides = getSides(perimeter, data);
  // console.log(sides)
  console.log("Part 2:");
}

main();
