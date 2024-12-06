import path from "node:path";
import fs from "node:fs/promises";

const getData = async () => {
  const input = path.resolve(__dirname, "input.txt");

  const file = await fs.readFile(input, "utf-8");

  return file.trim();
};

type Position = {
  x: number;
  y: number;
  key: `${number},${number}`;
};

type Direction = "up" | "down" | "left" | "right";

type Guard = {
  position: Position;
  direction: Direction;
};

enum Tile {
  Nothing = ".",
  Something = "#",
  Guard = "^",
}

type Grid = Tile[][];

const parseData = (data: string): Grid => {
  return data.split("\n").map((line) => line.split("") as Tile[]);
};

const getTile = (grid: Grid, position: Position): Tile =>
  grid[position.y][position.x];

const createPosition = (x: number, y: number): Position => ({
  x,
  y,
  key: `${x},${y}`,
});

const getInitialGuardPosition = (grid: Grid): Guard => {
  const y = grid.findIndex((row) => row.includes(Tile.Guard));
  const x = grid[y].findIndex((tile) => tile === Tile.Guard);

  const position = createPosition(x, y);
  return {
    position,
    direction: "up",
  };
};

const getNextGuardPosition = (guard: Guard, grid: Grid): Guard | null => {
  const { x, y } = guard.position;
  const { direction } = guard;

  if (direction === "up") {
    if (y === 0) {
      return null;
    }

    const nextPosition = createPosition(x, y - 1);

    if (getTile(grid, nextPosition) === Tile.Something) {
      return getNextGuardPosition({ ...guard, direction: "right" }, grid);
    }

    return {
      position: nextPosition,
      direction,
    };
  }

  if (direction === "right") {
    if (x === grid[y].length - 1) {
      return null;
    }

    const nextPosition = createPosition(x + 1, y);

    if (getTile(grid, nextPosition) === Tile.Something) {
      return getNextGuardPosition({ ...guard, direction: "down" }, grid);
    }

    return {
      position: nextPosition,
      direction,
    };
  }

  if (direction === "down") {
    if (y === grid.length - 1) {
      return null;
    }

    const nextPosition = createPosition(x, y + 1);

    if (getTile(grid, nextPosition) === Tile.Something) {
      return getNextGuardPosition({ ...guard, direction: "left" }, grid);
    }

    return {
      position: nextPosition,
      direction,
    };
  }

  if (direction === "left") {
    if (x === 0) {
      return null;
    }

    const nextPosition = createPosition(x - 1, y);

    if (getTile(grid, nextPosition) === Tile.Something) {
      return getNextGuardPosition({ ...guard, direction: "up" }, grid);
    }

    return {
      position: nextPosition,
      direction,
    };
  }

  return null;
};

const moveGuardTilOffGrid = (guard: Guard, grid: Grid): Position[] => {
  const positions: Position[] = [];

  let nextGuard = guard;
  while (true) {
    positions.push(nextGuard.position);
    const n = getNextGuardPosition(nextGuard, grid);
    if (!n) {
      break;
    }
    nextGuard = n;
  }

  return positions;
};

const main = async () => {
  const data = await getData();
  const grid = parseData(data);

  const guardPosition = getInitialGuardPosition(grid);
  const allPositions = moveGuardTilOffGrid(guardPosition, grid);

  const totalPositions = new Set(allPositions.map((position) => position.key))
    .size;

  console.log(totalPositions);
};

main();
