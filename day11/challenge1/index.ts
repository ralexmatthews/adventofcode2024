import path from "node:path";
import fs from "node:fs/promises";

const getData = async () => {
  const input = path.resolve(__dirname, "input.txt");

  const file = await fs.readFile(input, "utf-8");

  return file.trim();
};

type StonesLine = number[];

const getStones = (data: string): StonesLine => data.split(" ").map(Number);

const evolveStoneLine = (stones: StonesLine): StonesLine =>
  stones.reduce<StonesLine>((acc, currentNumber) => {
    if (currentNumber === 0) {
      acc.push(1);
      return acc;
    }

    const strNumber = `${currentNumber}`;

    if (strNumber.length % 2 === 0) {
      const firstHalfOfDigits = strNumber.slice(0, strNumber.length / 2);
      const secondHalfOfDigits = strNumber.slice(strNumber.length / 2);
      acc.push(Number(firstHalfOfDigits));
      acc.push(Number(secondHalfOfDigits));
      return acc;
    }

    acc.push(currentNumber * 2024);
    return acc;
  }, []);

const evolveStoneLineNTimes = (stones: StonesLine, times: number): StonesLine =>
  new Array(times).fill(0).reduce((acc) => evolveStoneLine(acc), stones);

const main = async () => {
  const data = await getData();

  const stones = getStones(data);

  const evolvedStones = evolveStoneLineNTimes(stones, 25);

  console.log(evolvedStones.length);
};

main();
