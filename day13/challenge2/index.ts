import path from "node:path";
import fs from "node:fs/promises";

const getData = async () => {
  const input = path.resolve(__dirname, "input.txt");

  const file = await fs.readFile(input, "utf-8");

  return file.trim();
};

type ButtonPress = {
  button: "A" | "B";
  x: number;
  y: number;
};

type Prize = {
  x: number;
  y: number;
};

type Game = {
  a: ButtonPress;
  b: ButtonPress;
  prize: Prize;
};

const parseInput = (data: string): Game[] =>
  data.split("\n\n").map((rawGame): Game => {
    const lines = rawGame.split("\n");
    const [aX, aY] = lines[0]
      .split(":")[1]
      .split(", ")
      .map((v) => Number(v.split("+")[1]));
    const [bX, bY] = lines[1]
      .split(":")[1]
      .split(", ")
      .map((v) => Number(v.split("+")[1]));
    const prize = lines[2]
      .split(": ")[1]
      .split(", ")
      .map((v) => Number(v.split("=")[1]));

    return {
      a: { button: "A", x: aX, y: aY },
      b: { button: "B", x: bX, y: bY },
      prize: { x: 10000000000000 + prize[0], y: 10000000000000 + prize[1] },
    };
  });

const isWithinMathErrorRange = (n: number): boolean =>
  Math.abs(n - Math.round(n)) < 0.001;

const solveGame = (game: Game): { a: number; b: number } | null => {
  /*
    m(aX) + n(bX) = pX
    m(aY) + n(bY) = pY
    ------------------
    0 + n(bX - bY) = pX - pY
    n = (pX - pY) / (bX - bY)
  */
  const { a, b, prize } = game;

  const aX = a.x;
  const aY = a.y;
  const bX = b.x;
  const bY = b.y;
  const pX = prize.x;
  const pY = prize.y;

  const yEquationCoefficient = aX / aY;
  const newBY = bY * yEquationCoefficient;
  const newPY = pY * yEquationCoefficient;

  const totalB = bX - newBY;
  const newTotal = pX - newPY;

  const n = newTotal / totalB;
  const m = (pX - n * bX) / aX;

  if (!isWithinMathErrorRange(n) || !isWithinMathErrorRange(m)) {
    return null;
  }

  return { a: Math.round(m), b: Math.round(n) };
};

const getPrice = (game: Game): number => {
  const result = solveGame(game);

  if (!result) {
    return 0;
  }

  return result.a * 3 + result.b;
};

const main = async () => {
  const data = await getData();

  const games = parseInput(data);

  console.log(games.map(getPrice).reduce((acc, v) => acc + v, 0));
};

main();
