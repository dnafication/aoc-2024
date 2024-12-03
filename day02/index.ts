/**
 * https://adventofcode.com/2024/day/2
 */

async function main() {
  try {
    const __dirname = new URL(".", import.meta.url).pathname;
    const data = await Deno.readTextFile(__dirname + "/input.txt");

    const levels = data.split("\n").map((level) =>
      level.trim().split(" ").map((num) => parseInt(num))
    );
    console.log(levels);
    const countOfSafeLevels = levels.filter((level) =>
      areLevelsSafe(level)
    ).length;
    console.log("Part 1:", countOfSafeLevels);

    const countOfSafeLevelsV2 = levels.filter((level) =>
      areLevelsSafeV2(level)
    ).length;
    console.log("Part 2:", countOfSafeLevelsV2);
  } catch (error) {
    console.error(error);
  }
}

function areLevelsSafe(levels: number[]): boolean {
  const increasing = levels[0] < levels[1];
  for (let i = 1; i < levels.length; i++) {
    const diff = Math.abs(levels[i - 1] - levels[i]);
    if (diff < 1 || diff > 3) {
      return false;
    }
    if (increasing && levels[i - 1] >= levels[i]) {
      return false;
    } else if (!increasing && levels[i - 1] <= levels[i]) {
      return false;
    }
  }
  return true;
}

function areLevelsSafeV2(levels: number[]): boolean {
  if (areLevelsSafe(levels)) {
    return true;
  }

  for (let i = 0; i < levels.length; i++) {
    const newLevels = levels.slice(0, i).concat(levels.slice(i + 1));
    if (areLevelsSafe(newLevels)) {
      return true;
    }
  }

  return false;
}

main();
