import path from "node:path";
import fs from "node:fs/promises";

const getData = async () => {
  const input = path.resolve(__dirname, "input.txt");

  const file = await fs.readFile(input, "utf-8");

  return file.trim();
};

type NumberInput = [number, number];

const findMulInstructions = (data: string) =>
  [...data.matchAll(/mul\(\d+,\d+\)/gm)].map((v) => v[0]);

const getNumbersFromInstruction = (instruction: string): NumberInput => {
  const numbers = instruction.match(/\d+/g);

  if (!numbers) {
    return [0, 0];
  }

  return [Number(numbers[0]), Number(numbers[1])];
};

const mul = ([a, b]: NumberInput) => a * b;

const main = async () => {
  const data = await getData();
  const mulInstructions = findMulInstructions(data);
  const numbers = mulInstructions
    .map(getNumbersFromInstruction)
    .map(mul)
    .reduce((a, b) => a + b, 0);

  console.log(numbers);
};

main();
