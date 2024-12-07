/**
 * https://adventofcode.com/2024
 * Disclaimer: Looks ugly, there may be duplication and not optimized, but it works.
 */

async function main() {
  try {
    const __dirname = new URL(".", import.meta.url).pathname;
    const data = await Deno.readTextFile(__dirname + "/input.txt");

    const equations: string[] = data.split("\n");

    type Equation = [number, number[]];
    const equationsParsed: Equation[] = equations.map((equation) => {
      const [left, right] = equation.split(": ");
      return [parseInt(left), right.split(" ").map(Number)] as Equation;
    });

    const validEquations: Equation[] = [];
    for (const equation of equationsParsed) {
      const [result, numbers] = equation;
      const combinations = generateCombinations(numbers.length - 1);

      for (const [index, combination] of combinations.entries()) {
        const equationResult = numbers.reduce((acc, number, index) => {
          if (index === 0) return number;
          if (combination[index - 1] === "*") return acc * number;
          if (combination[index - 1] === "+") return acc + number;
          return acc;
        }, 0);

        // Tried optimization but it didn't work
        // if (index === 1 && equationResult < result) {
        //   break;
        // }

        if (equationResult === result) {
          // console.log('Equation:', equation, 'Combination:', combination);
          validEquations.push(equation);
          break;
        }
      }
    }

    const sumOfResults = validEquations.reduce(
      (acc, [result]) => acc + result,
      0,
    );

    console.log("Part 1:", sumOfResults);

    // Part 2
    console.log(generateCombinationsPart2(3));

    const validEquationsPart2: Equation[] = [];

    for (const equation of equationsParsed) {
      const [result, numbers] = equation;
      const combinations = generateCombinationsPart2(numbers.length - 1);

      for (const [index, combination] of combinations.entries()) {
        const equationResult = numbers.reduce((acc, number, index) => {
          if (index === 0) return number;
          if (combination[index - 1] === "*") return acc * number;
          if (combination[index - 1] === "+") return acc + number;
          if (combination[index - 1] === "|") {
            return parseInt(acc.toString() + number.toString());
          }
          return acc;
        }, 0);

        if (equationResult === result) {
          // console.log('Equation:', equation, 'Combination:', combination);
          validEquationsPart2.push(equation);
          break;
        }
      }
    }

    const sumOfResultsPart2 = validEquationsPart2.reduce(
      (acc, [result]) => acc + result,
      0,
    );

    console.log("Part 2:", sumOfResultsPart2);
  } catch (error) {
    console.error(error);
  }
}

function generateCombinations(n: number): string[] {
  const results: string[] = [];

  function helper(current: string, length: number) {
    if (length === n) {
      results.push(current);
      return;
    }

    helper(current + "*", length + 1);
    helper(current + "+", length + 1);
  }

  helper("", 0);
  return results;
}

function generateCombinationsPart2(n: number): string[] {
  const results: string[] = [];

  function helper(current: string, length: number) {
    if (length === n) {
      results.push(current);
      return;
    }

    helper(current + "*", length + 1);
    helper(current + "+", length + 1);
    helper(current + "|", length + 1);
  }

  helper("", 0);
  return results;
}

main();
