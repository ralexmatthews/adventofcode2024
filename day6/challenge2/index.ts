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
  key: `${number},${number},${Direction}`;
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

const createGuard = (position: Position, direction: Direction): Guard => ({
  position,
  direction,
  key: `${position.key},${direction}`,
});

const getInitialGuardPosition = (grid: Grid): Guard => {
  const y = grid.findIndex((row) => row.includes(Tile.Guard));
  const x = grid[y].findIndex((tile) => tile === Tile.Guard);

  const position = createPosition(x, y);
  return createGuard(position, "up");
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

    return createGuard(nextPosition, direction);
  }

  if (direction === "right") {
    if (x === grid[y].length - 1) {
      return null;
    }

    const nextPosition = createPosition(x + 1, y);

    if (getTile(grid, nextPosition) === Tile.Something) {
      return getNextGuardPosition({ ...guard, direction: "down" }, grid);
    }

    return createGuard(nextPosition, direction);
  }

  if (direction === "down") {
    if (y === grid.length - 1) {
      return null;
    }

    const nextPosition = createPosition(x, y + 1);

    if (getTile(grid, nextPosition) === Tile.Something) {
      return getNextGuardPosition({ ...guard, direction: "left" }, grid);
    }

    return createGuard(nextPosition, direction);
  }

  if (direction === "left") {
    if (x === 0) {
      return null;
    }

    const nextPosition = createPosition(x - 1, y);

    if (getTile(grid, nextPosition) === Tile.Something) {
      return getNextGuardPosition({ ...guard, direction: "up" }, grid);
    }

    return createGuard(nextPosition, direction);
  }

  return null;
};

const moveGuardTilOffGridOrInLoop = (guard: Guard, grid: Grid): boolean => {
  const positions = new Set<Guard["key"]>([guard.key]);

  let nextGuard = guard;
  while (true) {
    const n = getNextGuardPosition(nextGuard, grid);
    if (!n) {
      return false;
    }

    if (positions.has(n.key)) {
      return true;
    }

    positions.add(n.key);

    nextGuard = n;
  }
};

const tryAllExtraObstacles = (guard: Guard, grid: Grid): number => {
  let count = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const percentDone = Math.floor(
        ((y * grid[y].length + x) / (grid.length * grid[y].length)) * 100
      );
      console.log(`${percentDone}%`);

      if (grid[y][x] === Tile.Nothing) {
        const newGrid = grid.map((row) => [...row]);
        newGrid[y][x] = Tile.Something;

        if (moveGuardTilOffGridOrInLoop(guard, newGrid)) {
          count++;
        }
      }
    }
  }

  return count;
};

const main = async () => {
  const data = await getData();
  const grid = parseData(data);

  const guardPosition = getInitialGuardPosition(grid);
  const totalLoops = tryAllExtraObstacles(guardPosition, grid);

  console.log(totalLoops);
};

main();
