import path from "node:path";
import fs from "node:fs/promises";

const getData = async () => {
  const input = path.resolve(__dirname, "input.txt");

  const file = await fs.readFile(input, "utf-8");

  return file.trim();
};

type NumberInput = [number, number];

const findMulInstructions = (data: string) => {
  const muls = [...data.matchAll(/mul\(\d+,\d+\)/gm)].map((v) => ({
    value: v[0],
    index: v.index,
  }));
  const dos = [...data.matchAll(/do\(\)/gm)].map((v) => v.index);
  const donts = [...data.matchAll(/don't\(\)/gm)].map((v) => v.index);

  return muls
    .filter((mul) => {
      const maxDo = Math.max(...dos.filter((doIndex) => doIndex < mul.index));
      const maxDont = Math.max(
        ...donts.filter((dontIndex) => dontIndex < mul.index)
      );

      if (maxDont === -Infinity) {
        return true;
      }

      return maxDo > maxDont;
    })
    .map((mul) => mul.value);
};

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
