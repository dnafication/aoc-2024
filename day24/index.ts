/**
 * https://adventofcode.com/2024
 * Disclaimer: Looks ugly, there may be duplication and not optimized, but it works.
 */

interface Operation {
  input1: string;
  operation: string;
  input2: string;
  output: string;
}

function parseLine(line: string): Operation {
  const regex = /^(\w+)\s+(\w+)\s+(\w+)\s+->\s+(\w+)$/;
  const match = line.match(regex);
  if (!match) {
    throw new Error(`Line does not match expected format: ${line}`);
  }
  const [, input1, operation, input2, output] = match;
  return { input1, operation, input2, output };
}

async function main() {
  try {
    const __dirname = new URL(".", import.meta.url).pathname;
    const a = await Deno.readTextFile(__dirname + "/input-a.txt");
    const b = await Deno.readTextFile(__dirname + "/input-b.txt");

    const inputs = a.split('\n').reduce<Record<string, number>>((acc, y) => {
      const [m, n] = y.split(': ')
      acc[m] = parseInt(n)
      return acc
    }, {})

    const operations = b.split('\n').map(x => parseLine(x))

    // console.log(operations)

    // solvePart1(inputs, operations);
    solvePart2(inputs, operations);
  } catch (error) {
    console.error(error);
  }
}

function solveOperation(op: Operation, operations: Operation[], inputs: Record<string, number>): number {
  const { input1, input2, operation, output } = op
  if (inputs[input1] === undefined) {
    const op = operations.find(o => o.output === input1)
    if (!op) {
      throw new Error("Input not found");
    }
    solveOperation(op, operations, inputs)
  }
  if (inputs[input2] === undefined) {
    const op = operations.find(o => o.output === input2)
    if (!op) {
      throw new Error("Input not found");
    }
    solveOperation(op, operations, inputs)
  }

  switch (operation) {
    case 'AND':
      return inputs[output] = inputs[input1] & inputs[input2]
    case 'OR':
      return inputs[output] = inputs[input1] | inputs[input2]
    case 'XOR':
      return inputs[output] = inputs[input1] ^ inputs[input2]
    default:
      throw new Error("Operation not found");
  }
}

function sortObjectKeys(obj: Record<string, any>): Record<string, any> {
  const sortedKeys = Object.keys(obj).sort().reverse();
  const sortedObj: Record<string, any> = {};

  for (const key of sortedKeys) {
    sortedObj[key] = obj[key];
  }

  return sortedObj;
}

function zWiresBinaryToDecimal(obj: Record<string, any>): Record<string, any> {
  let binary: string = '';
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && key.startsWith('z')) {
      binary += obj[key];
      console.log(key, obj[key])
    }
  }
  const decimal = parseInt(binary, 2);
  return { 'z': decimal };
}


function solvePart1(inputs: Record<string, number>, operations: Operation[]) {

  // console.log(inputs, operations)
  for (const op of operations) {
    solveOperation(op, operations, inputs)
  }

  console.log(zWiresBinaryToDecimal(sortObjectKeys(inputs)))
  // console.log("Part 1:", inputs);
}

function solvePart2(inputs: Record<string, number>, operations: Operation[]) {
  console.log("Part 2:",);
  let xBin: string = '';
  let yBin: string = '';

  const sortedKeys = Object.keys(inputs).sort().reverse();
  for (const key of sortedKeys) {
    if (key.startsWith('x')) {
      xBin += inputs[key];
    } else if (key.startsWith('y')) {
      yBin += inputs[key];
    }
  }

  const zFromSol1 = 51715173446832;
  console.log("xBin:", xBin);
  console.log("yBin:", yBin);
  const expectedZ = parseInt(xBin, 2) + parseInt(yBin, 2)
  console.log("expectedZ:", expectedZ);
  console.log("expectedZBin:", expectedZ.toString(2)); // 1011110000000011011110100010110111100010110000
  console.log("zFromSol1:", zFromSol1.toString(2));
  // 1011110000000011011110100010110111100010110000
  // 1011110000100011100000100010101111010010110000
  // 101010011010010001001100001111100111111100001
  // 110011100110001010101000000111010100011001111
}

main();
