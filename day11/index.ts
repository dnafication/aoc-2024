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

/**
 * Rules for blinking
 *
 * - If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
 * - If the stone is engraved with a number that has an even number of digits, it is replaced by two stones.
 *   The left half of the digits are engraved on the new left stone, and the right half of the digits are
 *   engraved on the new right stone. (The new numbers don't keep extra leading zeroes: 1000 would become
 *   stones 10 and 0.)
 * - If none of the other rules apply, the stone is replaced by a new stone; the old stone's number
 *   multiplied by 2024 is engraved on the new stone.
 */

function blink(stone: number) {
  if (stone === 0) {
    return 1;
  }

  if (stone.toString().length % 2 === 0) {
    const half = stone.toString().length / 2;
    const left = Number(stone.toString().slice(0, half));
    const right = Number(stone.toString().slice(half));
    return [left, right];
  }

  return stone * 2024;
}

function memoize(fn: Function) {
  const cache = new Map();
  return function (...args: any[]) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Same as blink but recursive and only returns the count of stones
 * and does not maintain the stones
 * @param stone the stone to blink at
 * @param times the number of times to blink
 */
const recursiveBlink = memoize(function (stone: number, times: number): number {
  if (times === 0) {
    return 1;
  }

  if (stone === 0) {
    return recursiveBlink(1, times - 1);
  }

  if (stone.toString().length % 2 === 0) {
    const half = stone.toString().length / 2;
    const left = Number(stone.toString().slice(0, half));
    const right = Number(stone.toString().slice(half));
    return recursiveBlink(left, times - 1) + recursiveBlink(right, times - 1);
  }

  return recursiveBlink(stone * 2024, times - 1);
});

function solvePart1(data: string) {
  let stones = data.split(" ").map(Number);

  const blinkTimes = 25;

  for (let i = 0; i < blinkTimes; i++) {
    const newStones = [];
    for (let j = 0; j < stones.length; j++) {
      const stone = stones[j];
      const newStone = blink(stone);
      if (Array.isArray(newStone)) {
        newStones.push(...newStone);
      } else {
        newStones.push(newStone);
      }
    }
    stones = newStones;
  }

  console.log("Part 1: ", stones.length); // 199982
}

function solvePart2(data: string) {
  let stones = data.split(" ").map(Number);
  const blinkTimes = 75;

  console.log(
    "Part 2: ",
    stones.reduce((acc, stone) => acc + recursiveBlink(stone, blinkTimes), 0),
  );
}

main();
