/**
 * https://adventofcode.com/2024
 * Disclaimer: Looks ugly, there may be duplication and not optimized, but it works.
 */

async function main() {
  try {
    const __dirname = new URL(".", import.meta.url).pathname;
    const data = await Deno.readTextFile(__dirname + "/input.txt");

    const grid = data.split("\n").map((row) => row.split(""));

    // console.log(grid);

    type Coordinate = [number, number];
    type Antenna = {
      name: string;
      coordinate: Coordinate;
    };
    const rowCount = grid.length;
    const columnCount = grid[0].length;

    const getCoordinateDifference = (
      a: Coordinate,
      b: Coordinate,
    ): Coordinate => [a[0] - b[0], a[1] - b[1]];

    function getUniqueNodes() {
      const visitedAntennas: Antenna[] = [];
      const listOfAntinodes: Coordinate[] = [];

      for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < columnCount; j++) {
          if (grid[i][j] !== ".") {
            const antennaName = grid[i][j];
            const visitedAntennaWithSameName = visitedAntennas.filter((
              antenna,
            ) => antenna.name === antennaName);
            visitedAntennaWithSameName.forEach((antenna) => {
              const coordinateDifference = getCoordinateDifference(
                antenna.coordinate,
                [i, j],
              );
              // console.log([i, j], coordinateDifference)
              listOfAntinodes.push([
                i + (2 * coordinateDifference[0]),
                j + (2 * coordinateDifference[1]),
              ]);
              listOfAntinodes.push([
                i - coordinateDifference[0],
                j - coordinateDifference[1],
              ]);
            });

            visitedAntennas.push({
              name: antennaName,
              coordinate: [i, j],
            });
          }
        }
      }

      // console.log(listOfAntinodes);
      const validAntinodes = listOfAntinodes.filter((coordinate) => {
        const [x, y] = coordinate;
        return x >= 0 && x < rowCount && y >= 0 && y < columnCount;
      });
      return Array.from(new Set(validAntinodes.map(([x, y]) => `${x},${y}`)));
    }

    console.log(`Part 1:`, getUniqueNodes().length);

    function getUniqueNodesPart2() {
      const visitedAntennas: Antenna[] = [];
      const listOfAntinodes: Coordinate[] = [];

      for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < columnCount; j++) {
          if (grid[i][j] !== ".") {
            const antennaName = grid[i][j];
            const visitedAntennaWithSameName = visitedAntennas.filter((
              antenna,
            ) => antenna.name === antennaName);
            visitedAntennaWithSameName.forEach((antenna) => {
              const coordinateDifference = getCoordinateDifference(
                antenna.coordinate,
                [i, j],
              );
              // console.log([i, j], coordinateDifference)

              let nextDown: [number, number] = [
                i + coordinateDifference[0],
                j + coordinateDifference[1],
              ];
              while (isValid(...nextDown)) {
                listOfAntinodes.push(nextDown);
                nextDown = [
                  nextDown[0] + coordinateDifference[0],
                  nextDown[1] + coordinateDifference[1],
                ];
              }

              let nextUp: [number, number] = [
                i - coordinateDifference[0],
                j - coordinateDifference[1],
              ];
              while (isValid(...nextUp)) {
                listOfAntinodes.push(nextUp);
                nextUp = [
                  nextUp[0] - coordinateDifference[0],
                  nextUp[1] - coordinateDifference[1],
                ];
              }
            });

            // also add the current node
            listOfAntinodes.push([i, j]);

            visitedAntennas.push({
              name: antennaName,
              coordinate: [i, j],
            });
          }
        }
      }

      // console.log(listOfAntinodes);
      const validAntinodes = listOfAntinodes.filter((coordinate) => {
        const [x, y] = coordinate;
        return isValid(x, y);
      });

      // Print the grid
      // const newGrid = Array.from({ length: rowCount }, () =>
      //   Array.from({ length: columnCount }, () => ".")
      // );

      // validAntinodes.forEach(([x, y]) => {
      //   newGrid[x][y] = "#";
      // });

      // console.log(newGrid.map((row) => row.join("")).join("\n"));

      return Array.from(new Set(validAntinodes.map(([x, y]) => `${x},${y}`)));
    }

    function isValid(x: number, y: number): unknown {
      return x >= 0 && x < rowCount && y >= 0 && y < columnCount;
    }

    console.log(`Part 2:`, getUniqueNodesPart2().length);
  } catch (error) {
    console.error(error);
  }
}

main();
