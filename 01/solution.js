import { getLines } from "../lib/helpers.js";

const INITIAL = 50;

const input = getLines("./input.txt").map((line) => ({
  dir: line[0] === "L" ? -1 : 1,
  count: Number(line.slice(1)),
}));

function part1() {
  let zeroes = 0;

  input.reduce((acc, { dir, count }) => {
    let result = (dir * count + acc + 100) % 100;
    zeroes += result === 0;
    return result;
  }, INITIAL);

  return zeroes;
}

function part2() {
  let zeroes = 0;

  input.reduce((acc, { dir, count }) => {
    let result = dir * count + acc;
    zeroes +=
      Math.floor(Math.abs(result / 100)) +
      (result === 0 || (result < 0 && acc !== 0));
    return (result % 100 + 100) % 100;
  }, INITIAL);

  return zeroes;
}

console.log(part1());
console.log(part2());
