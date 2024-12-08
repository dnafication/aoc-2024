/**
 * https://adventofcode.com/2024
 */

// Looks ugly and not optimized but it works

async function main() {
  try {
    const __dirname = new URL(".", import.meta.url).pathname;
    const data = await Deno.readTextFile(__dirname + "/input.txt");

    const grid = data.split("\n").map((row) => row.split(''));
    const rows = grid.length;
    const columns = grid[0].length;

    const guardSymbol = '^'
    const objectSymbol = '#'

    type Coordinate = {
      x: number;
      y: number;
    }

    type Direction = {
      x: number;
      y: number;
    }

    const directions: Direction[] = [
      { x: 0, y: -1 }, // Up
      { x: 1, y: 0 }, // Right
      { x: 0, y: 1 }, // Down
      { x: -1, y: 0 }, // Left
    ]

    const guardPosition: Coordinate = {
      x: 0,
      y: 0
    }

    const isValidPosition = (pos: Coordinate) => {
      return pos.x >= 0 && pos.x < columns && pos.y >= 0 && pos.y < rows;
    }

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (grid[i][j] === guardSymbol) {
          guardPosition.x = j;
          guardPosition.y = i;
          break;
        }
      }
    }
    const initialPosition = { ...guardPosition };

    let directionIndex = 0;
    const route: Coordinate[] = [];

    while (isValidPosition(guardPosition)) {
      // grid[guardPosition.y][guardPosition.x] = 'X';
      route.push({ x: guardPosition.x, y: guardPosition.y });

      const nextCoordinate = {
        x: guardPosition.x + directions[directionIndex].x,
        y: guardPosition.y + directions[directionIndex].y
      }

      if (!isValidPosition(nextCoordinate)) {
        break;
      }

      const nextStep = grid[nextCoordinate.y][nextCoordinate.x];
      if (nextStep === objectSymbol) {
        directionIndex = (directionIndex + 1) % 4;
      } else {
        guardPosition.x += directions[directionIndex].x;
        guardPosition.y += directions[directionIndex].y;
      }
    }

    // deduplicate route
    const uniqueRoute = route.filter((pos, index) => {
      return route.findIndex(p => p.x === pos.x && p.y === pos.y) === index;
    });


    console.log(`Part 1: ${uniqueRoute.length}`);

    // Part 2
    // we'll introduce obstacles along the route
    // we can not place the initial obstacle in front of the guard
    // and check the possibility of a loop.
    // For a given route, if the guard is in the same position and direction
    // after a certain number of steps, then we have a loop.
    // console.log(uniqueRoute);

    let index = 0;
    // removing initial invalid coordinates where we cannot place the obstacle
    for (let i = 0; i < uniqueRoute.length; i++) {
      if (uniqueRoute[i].x === initialPosition.x) {
        index = i;
      } else {
        break;
      }
    }
    const validLocationsForObstacle = uniqueRoute.slice(1)

    console.log(validLocationsForObstacle);

    type CoordinateAndDirection = {
      position: Coordinate;
      direction: Direction;
    }

    function hasLoop(grid: string[][], obstacle: Coordinate, initialPosition: Coordinate) {

      const route: CoordinateAndDirection[] = [];
      let guardPosition = { ...initialPosition };
      let directionIndex = 0;
      while (isValidPosition(guardPosition)) {
        // grid[guardPosition.y][guardPosition.x] = 'X';

        const index = route.findIndex((pos) => {
          return pos.position.x === guardPosition.x && pos.position.y === guardPosition.y && pos.direction.x === directions[directionIndex].x && pos.direction.y === directions[directionIndex].y;
        })

        if (index >= 0) {
          return true;
        }

        route.push({ position: { x: guardPosition.x, y: guardPosition.y }, direction: directions[directionIndex] });

        const nextCoordinate = {
          x: guardPosition.x + directions[directionIndex].x,
          y: guardPosition.y + directions[directionIndex].y
        }

        if (!isValidPosition(nextCoordinate)) {
          break;
        }

        const nextStep = grid[nextCoordinate.y][nextCoordinate.x];
        if (nextStep === objectSymbol || (obstacle.x === nextCoordinate.x && obstacle.y === nextCoordinate.y)) {
          directionIndex = (directionIndex + 1) % 4;
        } else {
          guardPosition.x += directions[directionIndex].x;
          guardPosition.y += directions[directionIndex].y;
        }
      }
      return false;
    }

    let numberOfObstaclesCausingLoop = 0;

    for (let i = 0; i < validLocationsForObstacle.length; i++) {
      const obstacle = validLocationsForObstacle[i];
      if (hasLoop(grid, obstacle, initialPosition)) {
        numberOfObstaclesCausingLoop++;
      }
    }

    console.log(`Part 2: ${numberOfObstaclesCausingLoop}`);


  } catch (error) {
    console.error(error);
  }
}


main();
