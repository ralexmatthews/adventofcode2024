import path from "node:path";
import fs from "node:fs/promises";

const getData = async () => {
  const input = path.resolve(__dirname, "input.txt");

  const file = await fs.readFile(input, "utf-8");

  return file.trim();
};

type Coordinate = {
  key: `${number},${number}`;
  x: number;
  y: number;
};

type Antennas = Map<string, Coordinate[]>;

const EMPTY_SPACE = ".";

const createCoordinate = (x: number, y: number): Coordinate => ({
  key: `${x},${y}`,
  x,
  y,
});

const getGrid = (input: string): string[][] =>
  input.split("\n").map((line) => line.split(""));

const getIndexesOfAntennas = (grid: string[][]): Antennas => {
  const antennas = new Map<string, Coordinate[]>();

  grid.forEach((line, y) => {
    line.forEach((cell, x) => {
      if (cell === EMPTY_SPACE) return;

      const key = `${x},${y}`;
      const coordinate = createCoordinate(x, y);

      if (!antennas.has(cell)) {
        antennas.set(cell, []);
      }

      antennas.get(cell)?.push(coordinate);
    });
  });

  return antennas;
};

const getAllPairs = (coordinates: Coordinate[]): [Coordinate, Coordinate][] => {
  const pairs: [Coordinate, Coordinate][] = [];

  coordinates.forEach((coordinate, index) => {
    for (let i = index + 1; i < coordinates.length; i++) {
      pairs.push([coordinate, coordinates[i]]);
    }
  });

  return pairs;
};

const getAntiNodes = (
  a: Coordinate,
  b: Coordinate,
  maxX: number,
  maxY: number
): Coordinate[] => {
  const deltaX = Math.abs(a.x - b.x);
  const deltaY = Math.abs(a.y - b.y);

  let coordinates = [a, b];

  for (let i = 1; i <= maxX * maxY; i++) {
    const x = a.x < b.x ? a.x - deltaX * i : a.x + deltaX * i;
    const y = a.y < b.y ? a.y - deltaY * i : a.y + deltaY * i;

    if (x < 0 || x > maxX || y < 0 || y > maxY) {
      break;
    }

    coordinates.push(createCoordinate(x, y));
  }

  for (let i = 0; i <= maxX * maxY; i++) {
    const x = b.x < a.x ? b.x - deltaX * i : b.x + deltaX * i;
    const y = b.y < a.y ? b.y - deltaY * i : b.y + deltaY * i;

    if (x < 0 || x > maxX || y < 0 || y > maxY) {
      break;
    }

    coordinates.push(createCoordinate(x, y));
  }

  return coordinates;
};

const filterUniqueCoordinates = (coordinates: Coordinate[]): Coordinate[] => {
  const uniqueCoordinates = new Map<string, Coordinate>();

  coordinates.forEach((coordinate) => {
    uniqueCoordinates.set(coordinate.key, coordinate);
  });

  return Array.from(uniqueCoordinates.values());
};

const getAllAntiNodes = (
  antennas: Antennas,
  maxX: number,
  maxY: number
): Coordinate[] => {
  let antiNodes: Coordinate[] = [];

  antennas.forEach((coordinates) => {
    const pairs = getAllPairs(coordinates);

    pairs.forEach(([a, b]) => {
      antiNodes = [...antiNodes, ...getAntiNodes(a, b, maxX, maxY)];
    });
  });

  return filterUniqueCoordinates(antiNodes);
};

const main = async () => {
  const data = await getData();

  const grid = getGrid(data);

  const antennas = getIndexesOfAntennas(grid);

  const antiNodes = getAllAntiNodes(
    antennas,
    grid[0].length - 1,
    grid.length - 1
  );

  console.log(antiNodes.length);
};

main();
