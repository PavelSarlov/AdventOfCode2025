import { chain, cloneDeep } from "lodash-es";
import { getLines } from "../lib/helpers.js";

const input = getLines("./input.txt").map((line) => line.split(""));

function part1() {
  const map = cloneDeep(input);
  let splits = 0;

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i - 1]?.[j].match(/[S|]/)) {
        if (map[i][j] === "^") {
          if (j - 1 >= 0) {
            map[i][j - 1] = "|";
          }
          if (j + 1 < map[i].length) {
            map[i][j + 1] = "|";
          }
          splits++;
        } else {
          map[i][j] = "|";
        }
      }
    }
  }

  return splits;
}

function part2() {
  const map = input.map((line) => line.map(() => 0));
  map[0][input[0].indexOf("S")] = 1;

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (input[i - 1]?.[j] !== undefined) {
        if (input[i][j] === "^") {
          if (j - 1 >= 0) {
            map[i][j - 1] = map[i][j - 1] + map[i - 1][j];
          }
          if (j + 1 < map[i].length) {
            map[i][j + 1] = map[i][j + 1] + map[i - 1][j];
          }
        } else {
          map[i][j] = map[i][j] + map[i - 1][j];
        }
      }
    }
  }

  return chain(map[map.length - 1])
    .sum()
    .value();
}

console.log(part1());
console.log(part2());
