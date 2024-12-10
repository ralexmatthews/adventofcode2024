import path from "node:path";
import fs from "node:fs/promises";

const getData = async () => {
  const input = path.resolve(__dirname, "input.txt");

  const file = await fs.readFile(input, "utf-8");

  return file.trim();
};

type Grid = number[][];
type Coordinate = {
  key: `${number},${number}`;
  x: number;
  y: number;
};
type TrailSpot = {
  coordinate: Coordinate;
  elevation: number;
};

const createCoordinate = (x: number, y: number): Coordinate => ({
  key: `${x},${y}`,
  x,
  y,
});

const createTrailSpot = (
  x: number,
  y: number,
  elevation: number
): TrailSpot => ({
  coordinate: createCoordinate(x, y),
  elevation,
});

const createGrid = (input: string): Grid =>
  input.split("\n").map((line) => line.split("").map((v) => Number(v)));

const findTrailHeads = (grid: Grid): TrailSpot[] =>
  grid.reduce<TrailSpot[]>(
    (acc, row, y) => [
      ...acc,
      ...row
        .map((cell, x) => createTrailSpot(x, y, Number(cell)))
        .filter((v) => v.elevation === 0),
    ],
    []
  );

const findNextSpots = (grid: Grid, trailSpot: TrailSpot): TrailSpot[] => {
  const { coordinate, elevation } = trailSpot;
  const { x, y } = coordinate;

  const leftNumber = grid[y][x - 1];
  const leftSpot = leftNumber ? createTrailSpot(x - 1, y, leftNumber) : null;
  const rightNumber = grid[y][x + 1];
  const rightSpot = rightNumber ? createTrailSpot(x + 1, y, rightNumber) : null;
  const upNumber = grid[y - 1]?.[x];
  const upSpot = upNumber ? createTrailSpot(x, y - 1, upNumber) : null;
  const downNumber = grid[y + 1]?.[x];
  const downSpot = downNumber ? createTrailSpot(x, y + 1, downNumber) : null;

  return [leftSpot, rightSpot, upSpot, downSpot].filter(
    (v): v is TrailSpot => !!v && v.elevation === elevation + 1
  );
};

const investigateTrail = (trailHead: TrailSpot, grid: Grid) => {
  let spotsToCheck = [trailHead];
  while (
    spotsToCheck.length > 0 &&
    !spotsToCheck.some((v) => v.elevation === 9)
  ) {
    const newSpotsToCheck: TrailSpot[] = [];
    for (const spot of spotsToCheck) {
      const nextSpots = findNextSpots(grid, spot);
      newSpotsToCheck.push(...nextSpots);
    }

    if (newSpotsToCheck.length === 0) {
      break;
    }

    spotsToCheck = newSpotsToCheck;
  }

  return spotsToCheck.length;
};

const main = async () => {
  const data = await getData();
  const grid = createGrid(data);

  const trailHeads = findTrailHeads(grid);

  const numberOfTrails = trailHeads
    .flatMap((trailHead) => investigateTrail(trailHead, grid))
    .reduce((acc, v) => acc + v, 0);

  console.log(numberOfTrails);
};

main();
