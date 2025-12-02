import { getLines } from "../lib/helpers.js";

const input = getLines("./input.txt")[0]
  .split(",")
  .map((range) => range.split("-").map((x) => Number(x)));

function solve(multiple = false) {
  return input.reduce((acc, [start, end]) => {
    for (let i = start; i <= end; i++) {
      if (i.toString().match(new RegExp(`^(\\d+)\\1${multiple ? "+" : ""}$`))) {
        acc = acc + i;
      }
    }
    return acc;
  }, 0);
}

function part1() {
  return solve();
}

function part2() {
  return solve(true);
}

console.log(part1());
console.log(part2());
