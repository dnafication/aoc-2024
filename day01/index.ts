/**
 * https://adventofcode.com/2024/day/1
 */

async function main() {
  try {
    const __dirname = new URL(".", import.meta.url).pathname;
    const data = await Deno.readTextFile(__dirname + "/input.txt");
    const locIdsString = data.split("\n");
    const group1 = [];
    const group2 = [];
    for (let locIds of locIdsString) {
      group1.push(parseInt(locIds.split("   ")[0]));
      group2.push(parseInt(locIds.split("   ")[1]));
    }
    const group1Sorted = group1.toSorted((a, b) => a - b);
    const group2Sorted = group2.toSorted((a, b) => a - b);

    let sumOfGaps = 0;
    for (let i = 0; i < group1Sorted.length; i++) {
      sumOfGaps += Math.abs(group1Sorted[i] - group2Sorted[i]);
    }

    console.log("Part 1 Answer: ", sumOfGaps);

    // Part 2
    let similarityScore = 0;
    for (const locId of group1Sorted) {
      const countOfLocId = group2Sorted.filter((loc) => loc === locId).length;
      if (countOfLocId > 0) {
        similarityScore += countOfLocId * locId;
      }
    }

    console.log("Part 2 Answer: ", similarityScore);
  } catch (error) {
    console.error(error);
  }
}

main();
