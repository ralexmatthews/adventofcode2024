import path from "node:path";
import fs from "node:fs/promises";

const getData = async () => {
  const input = path.resolve(__dirname, "input.txt");

  const file = await fs.readFile(input, "utf-8");

  return file.trim();
};

type Rule = [before: number, after: number];
type Update = number[];

const normalizeInput = (input: string) => {
  const [rulesInput, updatesInput] = input.split("\n\n");

  const rules = rulesInput
    .split("\n")
    .map((rule) => rule.split("|"))
    .map(([before, after]): Rule => [parseInt(before), parseInt(after)]);

  const updates = updatesInput
    .split("\n")
    .map((update): Update => update.split(",").map(Number));

  return { rules, updates };
};

const checkUpdate = (update: Update, rules: Rule[]) => {
  for (const [before, after] of rules) {
    const indexOfBefore = update.findIndex((number) => number === before);
    const indexOfAfter = update.findIndex((number) => number === after);

    if (indexOfBefore === -1 || indexOfAfter === -1) {
      continue;
    }

    const isValid = indexOfBefore < indexOfAfter;

    if (!isValid) {
      return false;
    }
  }

  return true;
};

const getMiddleNumberFromUpdate = (update: Update) => {
  const length = update.length;

  return update[Math.floor(length / 2)];
};

const main = async () => {
  const data = await getData();

  const input = normalizeInput(data);

  const sumOfUpdatesThatWork = input.updates
    .filter((update) => checkUpdate(update, input.rules))
    .map(getMiddleNumberFromUpdate)
    .reduce((acc, curr) => acc + curr, 0);

  console.log(sumOfUpdatesThatWork);
};

main();
