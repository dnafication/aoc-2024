import { checkIfEqual, compiler } from "./index.ts";

self.onmessage = (event: MessageEvent<{ start: number; step: number; max: number; program: number[] }>) => {
  const { start, step, max, program } = event.data;
  console.log("Worker received message", start, step, max, program);
  for (let i = start; i < max; i += step) {

    const registers = {
      A: BigInt(i),
      B: 0n,
      C: 0n,
    }
    const out = compiler(program, registers);
    if (checkIfEqual(out, program)) {
      console.log("Part 2:", i);
    }

  }
  self.close();
}