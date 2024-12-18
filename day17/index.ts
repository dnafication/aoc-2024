/**
 * https://adventofcode.com/2024
 * Disclaimer: Looks ugly, there may be duplication and not optimized, but it works.
 */

async function main() {
  try {
    const __dirname = new URL(".", import.meta.url).pathname;
    // const data = await Deno.readTextFile(__dirname + "/small-input.txt");
    const data = await Deno.readTextFile(__dirname + "/input.txt");

    const registerRegex = /Register\s([A-C]):\s(\d+)/g;
    const programRegex = /Program:\s([\d,]+)/;

    const registers: { [key: string]: BigInt } = {};
    let match;

    while ((match = registerRegex.exec(data)) !== null) {
      registers[match[1]] = BigInt(match[2]);
    }

    const programMatch = programRegex.exec(data);
    const program = programMatch ? programMatch[1].split(",").map(Number) : [];

    console.log(registers);
    console.log(program);

    // solvePart1({ registers, program });
    solvePart2(program);
  } catch (error) {
    console.error(error);
  }
}

export function compiler(program: number[], registers: { [key: string]: BigInt }) {
  let instructionPointer = 0;
  let output = [];

  function getOperandValue(operand: number) {
    if (operand >= 0 && operand <= 3) {
      return BigInt(operand);
    }
    switch (operand) {
      case 4:
        return registers.A;
      case 5:
        return registers.B;
      case 6:
        return registers.C;
      case 7:
        return 7n;
      default:
        throw new Error("Invalid operand");
    }
  }

  while (instructionPointer < program.length) {
    const opcode = program[instructionPointer];
    const operand = program[instructionPointer + 1];
    const operandValue = getOperandValue(operand);


    switch (opcode) {
      case 0: // adv
        registers.A = BigInt(registers.A / (2n ** operandValue));
        break;
      case 1: // bxl
        registers.B = registers.B ^ BigInt(operand);
        break;
      case 2: // bst
        registers.B = operandValue % 8n;
        break;
      case 3: // jnz
        if (registers.A !== 0n) {
          instructionPointer = operand;
          continue;
        }
        break;
      case 4: // bxc
        registers.B = registers.B ^ registers.C;
        break;
      case 5: // out
        output.push(operandValue % 8n);
        break;
      case 6: // bdv
        registers.B = BigInt(registers.A / (2n ** operandValue));
        break;
      case 7: // cdv
        registers.C = BigInt(registers.A / (2n ** operandValue));
        break;

      default:
        throw new Error("Invalid opcode");
    }

    instructionPointer += 2;
  }
  return output;
}

// Exits early if the output is not equal to the program
export function compilerV2(program: number[], registers: { [key: string]: BigInt }) {
  let instructionPointer = 0;
  let output = [];

  function getOperandValue(operand: number) {
    if (operand >= 0 && operand <= 3) {
      return BigInt(operand);
    }
    switch (operand) {
      case 4:
        return registers.A;
      case 5:
        return registers.B;
      case 6:
        return registers.C;
      case 7:
        return 7n;
      default:
        throw new Error("Invalid operand");
    }
  }

  while (instructionPointer < program.length) {
    const opcode = program[instructionPointer];
    const operand = program[instructionPointer + 1];
    const operandValue = getOperandValue(operand);


    switch (opcode) {
      case 0: // adv
        registers.A = BigInt(registers.A / (2n ** operandValue));
        break;
      case 1: // bxl
        registers.B = registers.B ^ BigInt(operand);
        break;
      case 2: // bst
        registers.B = operandValue % 8n;
        break;
      case 3: // jnz
        if (registers.A !== 0n) {
          instructionPointer = operand;
          continue;
        }
        break;
      case 4: // bxc
        registers.B = registers.B ^ registers.C;
        break;
      case 5: // out
        output.push(operandValue % 8n);
        break;
      case 6: // bdv
        registers.B = BigInt(registers.A / (2n ** operandValue));
        break;
      case 7: // cdv
        registers.C = BigInt(registers.A / (2n ** operandValue));
        break;

      default:
        throw new Error("Invalid opcode");
    }

    if (output.length > 0) {
      for (let i = 0; i < output.length; i++) {
        if (output[i] !== program[i]) {
          return [];
        }
      }
    }

    instructionPointer += 2;
  }
  return output;
}

function solvePart1(
  { registers, program }: {
    registers: { [key: string]: BigInt };
    program: number[];
  },
) {

  const output = compiler(program, registers);
  console.log(registers);

  console.log("Part 1:", output.join(','));
}

export function checkIfEqual(arr1: number[], arr2: number[]) {
  return arr1.join(',') === arr2.join(',');
}

function solvePart2(program: number[]) {
  //
  // Using workers to parallelize the work
  //
  // const NumberOfWorkers = 10;
  // for (let i = 0; i < NumberOfWorkers; i++) {
  //   const worker = new Worker(
  //     new URL("./worker.ts", import.meta.url).href,
  //     { type: "module" },
  //   )
  //   worker.postMessage({ start: i, step: NumberOfWorkers, max: 999999999, program });
  // }

  for (let i = 9999999999; i < 99999999999; i++) {

    if (i % 1000000 === 0) {
      console.log("Checking", i);
    }

    const registers = {
      A: BigInt(i),
      B: 0n,
      C: 0n,
    }
    const out = compilerV2(program, registers);
    if (out.length === program.length && checkIfEqual(out, program)) {
      console.log("Part 2:", i);
      break;
    }
  }

  console.log("Part 2 done",);
}

main();
