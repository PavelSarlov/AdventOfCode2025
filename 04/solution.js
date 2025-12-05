import { chain, cloneDeep } from "lodash-es";
import { getLines } from "../lib/helpers.js";

const input = getLines("./input.txt").map((line) => line.split(""));

function canAccess(input, i, j) {
  return (
    [
      input[i - 1]?.[j - 1]?.match(/[x@]/),
      input[i - 1]?.[j]?.match(/[x@]/),
      input[i - 1]?.[j + 1]?.match(/[x@]/),
      input[i]?.[j - 1]?.match(/[x@]/),
      input[i]?.[j + 1]?.match(/[x@]/),
      input[i + 1]?.[j - 1]?.match(/[x@]/),
      input[i + 1]?.[j]?.match(/[x@]/),
      input[i + 1]?.[j + 1]?.match(/[x@]/),
    ].filter((x) => x).length < 4
  );
}

function part1() {
  const inputCopy = cloneDeep(input);

  for (let i = 0; i < inputCopy.length; i++) {
    for (let j = 0; j < inputCopy[i].length; j++) {
      if (inputCopy[i][j] === "@" && canAccess(inputCopy, i, j)) {
        inputCopy[i][j] = "x";
      }
    }
  }

  return chain(inputCopy)
    .map((line) => line.filter((x) => x === "x").length)
    .sum()
    .value();
}

function part2() {
  const inputCopy = cloneDeep(input);

  for (let i = 0; i < inputCopy.length; i++) {
    for (let j = 0; j < inputCopy[i].length; j++) {
      if (inputCopy[i][j] === "@" && canAccess(inputCopy, i, j)) {
        inputCopy[i][j] = ".";
        i = Math.max(i - 2, -1);
        break;
      }
    }
  }

  return (
    chain(input)
      .map((line) => line.filter((x) => x === "@").length)
      .sum()
      .value() -
    chain(inputCopy)
      .map((line) => line.filter((x) => x === "@").length)
      .sum()
      .value()
  );
}

console.log(part1());
console.log(part2());
