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

const hasBottomRightDiagonalMas = (index: Index, wordSearch: WordSearch) => {
  const { x, y } = index;

  return (
    wordSearch[y - 1]?.[x - 1] === "M" && wordSearch[y + 1]?.[x + 1] === "S"
  );
};

const hasBottomLeftDiagonalMas = (index: Index, wordSearch: WordSearch) => {
  const { x, y } = index;

  return (
    wordSearch[y - 1]?.[x + 1] === "M" && wordSearch[y + 1]?.[x - 1] === "S"
  );
};

const hasTopRightDiagonalMas = (index: Index, wordSearch: WordSearch) => {
  const { x, y } = index;

  return (
    wordSearch[y + 1]?.[x - 1] === "M" && wordSearch[y - 1]?.[x + 1] === "S"
  );
};

const hasTopLeftDiagonalMas = (index: Index, wordSearch: WordSearch) => {
  const { x, y } = index;

  return (
    wordSearch[y + 1]?.[x + 1] === "M" && wordSearch[y - 1]?.[x - 1] === "S"
  );
};

const isMasX = (index: Index, wordSearch: WordSearch): boolean =>
  // has the "\" diagonal
  (hasBottomRightDiagonalMas(index, wordSearch) ||
    hasTopLeftDiagonalMas(index, wordSearch)) &&
  // and has the "/" diagonal
  (hasBottomLeftDiagonalMas(index, wordSearch) ||
    hasTopRightDiagonalMas(index, wordSearch));

const findCountOfMasXs = (data: string) => {
  const lines: WordSearch = data.split("\n").map((line) => line.split(""));

  let count = 0;

  for (let x = 0; x < lines[0].length; x++) {
    for (let y = 0; y < lines.length; y++) {
      const current = lines[y][x];

      if (current === "A") {
        count += isMasX({ x, y }, lines) ? 1 : 0;
      }
    }
  }

  return count;
};

const main = async () => {
  const data = await getData();

  const numberOfXmas = findCountOfMasXs(data);

  console.log(numberOfXmas);
};

main();
