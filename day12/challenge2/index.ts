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
  hasTopFence: boolean;
  hasBottomFence: boolean;
  hasLeftFence: boolean;
  hasRightFence: boolean;
};

type CellGrid = Cell[][];

const getFences = (
  grid: Grid,
  x: number,
  y: number,
  region: string
): Pick<
  Cell,
  "hasTopFence" | "hasBottomFence" | "hasLeftFence" | "hasRightFence"
> => {
  const top = grid[y - 1]?.[x];
  const bottom = grid[y + 1]?.[x];
  const left = grid[y][x - 1];
  const right = grid[y][x + 1];

  return {
    hasTopFence: top !== region,
    hasBottomFence: bottom !== region,
    hasLeftFence: left !== region,
    hasRightFence: right !== region,
  };
};

const traverseCell = (
  cellGrid: CellGrid,
  cell: Cell,
  visitedCells = new Set<Cell["key"]>()
): { perimeterSides: number; visitedCells: Set<Cell["key"]> } => {
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

  const allVisitedCells = results.reduce(
    (acc, result) => new Set([...acc, ...result.visitedCells]),
    visitedCells
  );

  let perimeterSides = 0;
  for (const cellKey of [...allVisitedCells]) {
    const [x, y] = cellKey.split(",").map(Number);
    const cell = cellGrid[y][x];

    if (cell.hasTopFence) {
      const leftCell = cellGrid[y]?.[x - 1];

      if (
        !leftCell ||
        leftCell.region !== cell.region ||
        !leftCell.hasTopFence
      ) {
        perimeterSides++;
      }
    }

    if (cell.hasBottomFence) {
      const rightCell = cellGrid[y]?.[x + 1];

      if (
        !rightCell ||
        rightCell.region !== cell.region ||
        !rightCell.hasBottomFence
      ) {
        perimeterSides++;
      }
    }

    if (cell.hasLeftFence) {
      const topCell = cellGrid[y - 1]?.[x];

      if (!topCell || topCell.region !== cell.region || !topCell.hasLeftFence) {
        perimeterSides++;
      }
    }

    if (cell.hasRightFence) {
      const bottomCell = cellGrid[y + 1]?.[x];

      if (
        !bottomCell ||
        bottomCell.region !== cell.region ||
        !bottomCell.hasRightFence
      ) {
        perimeterSides++;
      }
    }
  }

  return { perimeterSides, visitedCells: allVisitedCells };
};

const getTotalPrice = (grid: Grid): number => {
  const cellGrid: CellGrid = grid.map((row, y) =>
    row.map((region, x) => ({
      key: `${x},${y}`,
      x,
      y,
      region,
      ...getFences(grid, x, y, region),
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
      totalPrice += results.perimeterSides * results.visitedCells.size;
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
