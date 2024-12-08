import path from "node:path";
import fs from "node:fs/promises";

const getData = async () => {
  const input = path.resolve(__dirname, "input.txt");

  const file = await fs.readFile(input, "utf-8");

  return file.trim();
};

type Expression = {
  total: number;
  numbers: number[];
};

const getExpressions = (data: string): Expression[] =>
  data.split("\n").map((line) => {
    const [total, rawNumbers] = line.split(":").map((v) => v.trim());
    const numbers = rawNumbers.split(/\s/).map((v) => Number(v.trim()));
    return { total: Number(total), numbers };
  });

const generatePlusAndMultiplyCombinations = (length: number, seed: number) => {
  const binarySeed = seed.toString(2).padStart(length, "0");

  return binarySeed.split("").map((v) => (v === "0" ? "+" : "*"));
};

const getSumOfExpression = (numbers: number[], operators: string[]): number =>
  numbers
    .slice(1)
    .reduce(
      (acc, number, index) =>
        operators[index] === "+" ? acc + number : acc * number,
      numbers[0]
    );

const checkAllCombinations = (numbers: number[], total: number): boolean => {
  const length = numbers.length - 1;
  const maxSeed = 2 ** length;
  for (let seed = 0; seed < maxSeed; seed++) {
    const operators = generatePlusAndMultiplyCombinations(length, seed);
    const sum = getSumOfExpression(numbers, operators);
    if (sum === total) {
      return true;
    }
  }

  return false;
};

const main = async () => {
  const data = await getData();
  const expressions = getExpressions(data);

  const total = expressions
    .map((expression) =>
      checkAllCombinations(expression.numbers, expression.total)
        ? expression.total
        : null
    )
    .filter((v) => v !== null)
    .reduce((acc, expression) => acc + expression, 0);

  console.log(total);
};

main();
