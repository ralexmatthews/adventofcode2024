import path from "node:path";
import fs from "node:fs/promises";

const getData = async () => {
  const input = path.resolve(__dirname, "input.txt");

  const file = await fs.readFile(input, "utf-8");

  return file.trim();
};

type Index = {
  x: number;
  y: number;
};

type WordSearch = string[][];

const hasHorizontalXmas = (index: Index, wordSearch: WordSearch) => {
  const { x, y } = index;

  return (
    wordSearch[y][x] === "X" &&
    wordSearch[y][x + 1] === "M" &&
    wordSearch[y][x + 2] === "A" &&
    wordSearch[y][x + 3] === "S"
  );
};

const hasBackwardHorizontalXmas = (index: Index, wordSearch: WordSearch) => {
  const { x, y } = index;

  return (
    wordSearch[y][x - 0] === "X" &&
    wordSearch[y][x - 1] === "M" &&
    wordSearch[y][x - 2] === "A" &&
    wordSearch[y][x - 3] === "S"
  );
};

const hasVerticalXmas = (index: Index, wordSearch: WordSearch) => {
  const { x, y } = index;

  return (
    wordSearch[y][x] === "X" &&
    wordSearch[y + 1]?.[x] === "M" &&
    wordSearch[y + 2]?.[x] === "A" &&
    wordSearch[y + 3]?.[x] === "S"
  );
};

const hasBackwardsVerticalXmas = (index: Index, wordSearch: WordSearch) => {
  const { x, y } = index;

  return (
    wordSearch[y][x] === "X" &&
    wordSearch[y - 1]?.[x] === "M" &&
    wordSearch[y - 2]?.[x] === "A" &&
    wordSearch[y - 3]?.[x] === "S"
  );
};

const hasBottomRightDiagonalXmas = (index: Index, wordSearch: WordSearch) => {
  const { x, y } = index;

  return (
    wordSearch[y][x] === "X" &&
    wordSearch[y + 1]?.[x + 1] === "M" &&
    wordSearch[y + 2]?.[x + 2] === "A" &&
    wordSearch[y + 3]?.[x + 3] === "S"
  );
};

const hasBottomLeftDiagonalXmas = (index: Index, wordSearch: WordSearch) => {
  const { x, y } = index;

  return (
    wordSearch[y][x] === "X" &&
    wordSearch[y + 1]?.[x - 1] === "M" &&
    wordSearch[y + 2]?.[x - 2] === "A" &&
    wordSearch[y + 3]?.[x - 3] === "S"
  );
};

const hasTopRightDiagonalXmas = (index: Index, wordSearch: WordSearch) => {
  const { x, y } = index;

  return (
    wordSearch[y][x] === "X" &&
    wordSearch[y - 1]?.[x + 1] === "M" &&
    wordSearch[y - 2]?.[x + 2] === "A" &&
    wordSearch[y - 3]?.[x + 3] === "S"
  );
};

const hasTopLeftDiagonalXmas = (index: Index, wordSearch: WordSearch) => {
  const { x, y } = index;

  return (
    wordSearch[y][x] === "X" &&
    wordSearch[y - 1]?.[x - 1] === "M" &&
    wordSearch[y - 2]?.[x - 2] === "A" &&
    wordSearch[y - 3]?.[x - 3] === "S"
  );
};

const getNumberOfXmasAtIndex = (
  index: Index,
  wordSearch: WordSearch
): number => {
  let count = 0;

  count += hasHorizontalXmas(index, wordSearch) ? 1 : 0;
  count += hasBackwardHorizontalXmas(index, wordSearch) ? 1 : 0;
  count += hasVerticalXmas(index, wordSearch) ? 1 : 0;
  count += hasBackwardsVerticalXmas(index, wordSearch) ? 1 : 0;
  count += hasBottomRightDiagonalXmas(index, wordSearch) ? 1 : 0;
  count += hasBottomLeftDiagonalXmas(index, wordSearch) ? 1 : 0;
  count += hasTopRightDiagonalXmas(index, wordSearch) ? 1 : 0;
  count += hasTopLeftDiagonalXmas(index, wordSearch) ? 1 : 0;

  return count;
};

const findCountOfXmas = (data: string) => {
  const lines: WordSearch = data.split("\n").map((line) => line.split(""));

  let count = 0;

  for (let x = 0; x < lines[0].length; x++) {
    for (let y = 0; y < lines.length; y++) {
      const current = lines[y][x];

      if (current === "X") {
        count += getNumberOfXmasAtIndex({ x, y }, lines);
      }
    }
  }

  return count;
};

const main = async () => {
  const data = await getData();

  const numberOfXmas = findCountOfXmas(data);

  console.log(numberOfXmas);
};

main();
