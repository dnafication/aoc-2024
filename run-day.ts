const { args } = Deno;

if (args.length !== 1) {
  console.error("Usage: deno run run-day.ts <day>");
  Deno.exit(1);
}

const day = args[0].padStart(2, "0");
const dirPath = `./day${day}`;
const filePath = `${dirPath}/index.ts`;

try {
  Deno.chdir(dirPath);
  const process = Deno.run({
    cmd: ["deno", "run", "--allow-read", "--allow-net", "index.ts"],
  });

  const status = await process.status();
  Deno.exit(status.code);
} catch (error) {
  console.error(`Failed to run the script for day ${day}:`, error);
  Deno.exit(1);
}
