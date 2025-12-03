import { chain, isNil, max, maxBy } from "lodash-es";
import { getLines } from "../lib/helpers.js";

const input = getLines("./input.txt").map((bank) =>
  bank.split("").map((x) => Number(x)),
);

function largestJoltage(bank, count) {
  if (bank.length < count) {
    return;
  }

  let localMax = max(bank);

  --count;

  if (count > 0) {
    while (!isNil(localMax)) {
      const nextMax = largestJoltage(
        bank.slice(bank.indexOf(localMax) + 1),
        count,
      );

      if (!isNil(nextMax)) {
        return Number(`${localMax}${nextMax}`);
      }

      localMax = maxBy(bank, (v) => (v < localMax ? v : 0));
    }
  }

  return localMax;
}

function part1() {
  return chain(input)
    .map((bank) => largestJoltage(bank, 2))
    .sum()
    .value();
}

function part2() {
  return chain(input)
    .map((bank) => largestJoltage(bank, 12))
    .sum()
    .value();
}

console.log(part1());
console.log(part2());
