/**
 * https://adventofcode.com/2024/day/2
 */

async function main() {
  try {
    const __dirname = new URL(".", import.meta.url).pathname;
    const data = await Deno.readTextFile(__dirname + "/input.txt");

    let regex = /mul\((\d+),(\d+)\)/gm;
    let matches = data.matchAll(regex);
    let sum = 0;

    for (const match of matches) {
      const [_, a, b] = match;
      console.log(_, a, b);
      sum += parseInt(a) * parseInt(b);
    }

    console.log("Part 1:", sum);

    regex = /mul\((\d+),(\d+)\)|do\(|don't\(/gm;
    matches = data.matchAll(regex);
    let enabled = true;

    sum = 0;

    for (const match of matches) {
      const [_, a, b] = match;
      if (_ === "do(") {
        enabled = true;
      } else if (_ === "don't(") {
        enabled = false;
      } else if (enabled) {
        sum += parseInt(a) * parseInt(b);
      }
    }

    console.log("Part 2:", sum);
  } catch (error) {
    console.error(error);
  }
}

main();
