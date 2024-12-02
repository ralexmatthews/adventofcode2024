import path from "node:path";
import fs from "node:fs/promises";

const getData = async () => {
  const input = path.resolve(__dirname, "input.txt");

  const file = await fs.readFile(input, "utf-8");

  return file.trim();
};

type Lists = {
  left: number[];
  right: number[];
};

const getLists = (data: string) => {
  const lines = data.split("\n").map((n) => n.split(/\s+/gim).map(Number));

  return lines.reduce(
    ({ left, right }, [leftNumber, rightNumber]) => ({
      left: [...left, leftNumber],
      right: [...right, rightNumber],
    }),
    { left: [], right: [] } as Lists
  );
};

const getDifference = (lists: Lists) => {
  const { left, right } = lists;

  const leftSorted = left.sort((a, b) => a - b);
  const rightSorted = right.sort((a, b) => a - b);

  return leftSorted
    .map((n, i) => Math.abs(n - rightSorted[i]))
    .reduce((a, b) => a + b, 0);
};

const main = async () => {
  const data = await getData();

  const lists = getLists(data);

  const difference = getDifference(lists);
  console.log(difference);
};

main();
