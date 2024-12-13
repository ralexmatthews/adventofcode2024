import path from "node:path";
import fs from "node:fs/promises";

const getData = async () => {
  const input = path.resolve(__dirname, "input.txt");

  const file = await fs.readFile(input, "utf-8");

  return file.trim();
};

type Grid = string[][];
type Cell = {
  key: `${number},${number}`;
  x: number;
  y: number;
  region: string;
  perimeterCost: number;
};

type CellGrid = Cell[][];

const calculatePerimeterCost = (
  grid: Grid,
  x: number,
  y: number,
  region: string
): number => {
  const top = grid[y - 1]?.[x];
  const bottom = grid[y + 1]?.[x];
  const left = grid[y][x - 1];
  const right = grid[y][x + 1];

  const topPrice = top === region ? 0 : 1;
  const bottomPrice = bottom === region ? 0 : 1;
  const leftPrice = left === region ? 0 : 1;
  const rightPrice = right === region ? 0 : 1;

  return topPrice + bottomPrice + leftPrice + rightPrice;
};

const traverseCell = (
  cellGrid: CellGrid,
  cell: Cell,
  visitedCells = new Set<Cell["key"]>()
): { totalPrice: number; visitedCells: Set<Cell["key"]> } => {
  visitedCells.add(cell.key);

  const topCell = cellGrid[cell.y - 1]?.[cell.x];
  const bottomCell = cellGrid[cell.y + 1]?.[cell.x];
  const leftCell = cellGrid[cell.y][cell.x - 1];
  const rightCell = cellGrid[cell.y][cell.x + 1];

  const results = [];

  if (topCell?.region === cell.region && !visitedCells.has(topCell.key)) {
    results.push(traverseCell(cellGrid, topCell, visitedCells));
  }

  if (bottomCell?.region === cell.region && !visitedCells.has(bottomCell.key)) {
    results.push(traverseCell(cellGrid, bottomCell, visitedCells));
  }

  if (leftCell?.region === cell.region && !visitedCells.has(leftCell.key)) {
    results.push(traverseCell(cellGrid, leftCell, visitedCells));
  }

  if (rightCell?.region === cell.region && !visitedCells.has(rightCell.key)) {
    results.push(traverseCell(cellGrid, rightCell, visitedCells));
  }

  if (results.length === 0) {
    return { totalPrice: cell.perimeterCost, visitedCells };
  }

  const totalPrice = results.reduce(
    (acc, result) => acc + result.totalPrice,
    cell.perimeterCost
  );

  const allVisitedCells = results.reduce(
    (acc, result) => new Set([...acc, ...result.visitedCells]),
    visitedCells
  );

  return { totalPrice, visitedCells: allVisitedCells };
};

const getTotalPrice = (grid: Grid): number => {
  const cellGrid: CellGrid = grid.map((row, y) =>
    row.map((region, x) => ({
      key: `${x},${y}`,
      x,
      y,
      region,
      perimeterCost: calculatePerimeterCost(grid, x, y, region),
    }))
  );

  const setOfVisitedCells = new Set<Cell["key"]>();
  let totalPrice = 0;

  for (const row of cellGrid) {
    for (const cell of row) {
      if (setOfVisitedCells.has(cell.key)) {
        continue;
      }

      const results = traverseCell(cellGrid, cell);

      [...results.visitedCells].forEach((key) => setOfVisitedCells.add(key));
      totalPrice += results.totalPrice * results.visitedCells.size;
    }
  }

  return totalPrice;
};

const createGrid = (input: string): Grid =>
  input.split("\n").map((line) => line.split(""));

const main = async () => {
  const data = await getData();

  const grid = createGrid(data);

  const price = getTotalPrice(grid);

  console.log(price);
};

main();
