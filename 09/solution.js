import { chain, cloneDeep, orderBy, zip } from "lodash-es";
import { getLines, sumArray } from "../lib/helpers.js";

const input = getLines("./input.txt").map((line) =>
  line.split(",").map((x) => Number(x)),
);

const xs = chain(input)
  .map(([x]) => x)
  .uniq()
  .orderBy((v) => v)
  .value();
const ys = chain(input)
  .map(([, y]) => y)
  .uniq()
  .orderBy((v) => v)
  .value();

const grid = Array(ys.length * 2 - 1)
  .fill(0)
  .map(() => Array(xs.length * 2 - 1).fill(0));

zip(input, [...input.slice(1), input[0]]).forEach(([[x1, y1], [x2, y2]]) => {
  const [ix1, ix2] = orderBy(
    [xs.indexOf(x1) * 2, xs.indexOf(x2) * 2],
    (v) => v,
  );
  const [iy1, iy2] = orderBy(
    [ys.indexOf(y1) * 2, ys.indexOf(y2) * 2],
    (v) => v,
  );

  for (let x = ix1; x <= ix2; x++) {
    for (let y = iy1; y <= iy2; y++) {
      grid[y][x] = 1;
    }
  }
});

const outside = new Set();
const q = [[-1, -1]];
while (q.length) {
  const [x, y] = q.shift();

  [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ].forEach((d) => {
    const [nx, ny] = sumArray([x, y], d);

    if (nx < -1 || ny < -1 || nx > grid[0].length || ny > grid.length) return;
    if (outside.has(JSON.stringify([nx, ny])) || grid[ny]?.[nx] === 1) return;

    q.push([nx, ny]);
    outside.add(JSON.stringify([nx, ny]));
  });
}

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (!outside.has(JSON.stringify([x, y]))) {
      grid[y][x] = 1;
    }
  }
}

const tlbrAreas = cloneDeep(grid);

for (let y = 0; y < tlbrAreas.length; y++) {
  for (let x = 0; x < tlbrAreas[y].length; x++) {
    const topleft = tlbrAreas[y - 1]?.[x - 1] ?? 0;
    const left = tlbrAreas[y - 1]?.[x] ?? 0;
    const top = tlbrAreas[y][x - 1] ?? 0;
    tlbrAreas[y][x] = tlbrAreas[y][x] + left + top - topleft;
  }
}

function area([x1, y1], [x2, y2]) {
  return (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);
}

function areaInside([x1, y1], [x2, y2]) {
  [x1, x2] = orderBy([x1, x2], (v) => v);
  [y1, y2] = orderBy([y1, y2], (v) => v);

  const left = tlbrAreas[y2]?.[x1 - 1] ?? 0;
  const top = tlbrAreas[y1 - 1]?.[x2] ?? 0;
  const topleft = tlbrAreas[y1 - 1]?.[x1 - 1] ?? 0;

  return tlbrAreas[y2][x2] - left - top + topleft;
}

function part1() {
  let max = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      max = Math.max(max, area(input[i], input[j]));
    }
  }
  return max;
}

function part2() {
  let max = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      const a = input[i];
      const b = input[j];
      const ai = [xs.indexOf(a[0]) * 2, ys.indexOf(a[1]) * 2];
      const bi = [xs.indexOf(b[0]) * 2, ys.indexOf(b[1]) * 2];

      const areaActual = area(a, b);
      const areaReal = area(ai, bi);
      const areaIn = areaInside(ai, bi);

      if (areaReal === areaIn) {
        max = Math.max(max, areaActual);
      }
    }
  }
  return max;
}

console.log(part1());
console.log(part2());
