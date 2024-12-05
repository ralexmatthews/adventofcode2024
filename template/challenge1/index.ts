import path from "node:path";
import fs from "node:fs/promises";

const getData = async () => {
  const input = path.resolve(__dirname, "test_input.txt");

  const file = await fs.readFile(input, "utf-8");

  return file.trim();
};

const main = async () => {
  const data = await getData();
  console.log(data);
};

main();
