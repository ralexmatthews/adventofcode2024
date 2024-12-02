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

const getNumberOfOccurrences = (list: Lists["right"]) =>
  list.reduce(
    (acc, number) => ({
      ...acc,
      [number]: acc[number] ? acc[number] + 1 : 1,
    }),
    {} as Record<number, number>
  );

const getSimilarityScore = (lists: Lists) => {
  const { left, right } = lists;

  const rightOccurrences = getNumberOfOccurrences(right);

  return left
    .map((n) => n * (rightOccurrences[n] ?? 0))
    .reduce((a, b) => a + b, 0);
};

const main = async () => {
  const data = await getData();

  const lists = getLists(data);

  const similarity = getSimilarityScore(lists);
  console.log(similarity);
};

main();
