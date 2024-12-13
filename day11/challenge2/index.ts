import path from "node:path";
import fs from "node:fs/promises";

const getData = async () => {
  const input = path.resolve(__dirname, "input.txt");

  const file = await fs.readFile(input, "utf-8");

  return file.trim();
};

const cache: Record<string, number> = {};

const evolveStone = (number: number): number[] => {
  if (number === 0) {
    return [1];
  }

  const numString = `${number}`;

  if (numString.length % 2 === 0) {
    const firstHalfOfDigits = numString.slice(0, numString.length / 2);
    const secondHalfOfDigits = numString.slice(numString.length / 2);
    return [Number(firstHalfOfDigits), Number(secondHalfOfDigits)];
  }

  return [number * 2024];
};

const evolveStoneLineNTimes = (stone: number, times: number): number => {
  const key = `${stone}-${times}`;
  if (cache[key]) {
    return cache[key];
  }

  if (times === 1) {
    cache[key] = evolveStone(stone).length;
    return cache[key];
  }

  const evolvedStones = evolveStone(stone);
  cache[key] = evolvedStones
    .map((stone) => evolveStoneLineNTimes(stone, times - 1))
    .reduce((acc, current) => acc + current, 0);
  return cache[key];
};

const main = async () => {
  const data = await getData();

  const stones = data.split(" ").map(Number);

  const evolvedStones = stones
    .map((stone) => evolveStoneLineNTimes(stone, 75))
    .reduce((acc, current) => acc + current, 0);

  console.log(evolvedStones);
};

main();
