import fs from "fs";
import lodash from "lodash-es";

export function getLines(path, { sep = "\n", trim = true } = {}) {
  return fs
    .readFileSync(path)
    .toString()
    .trim()
    .split(sep)
    .map((l) => (trim ? l.trim() : l));
}

export function transpose(arr) {
  let transposed = new Array(arr[0].length)
    .fill(0)
    .map(() => new Array(arr.length));

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      transposed[j][i] = arr[i][j];
    }
  }
  return transposed;
}

export function getPolygonArea(vertices) {
  return Math.abs(
    vertices
      .map(
        (_, i) =>
          vertices[i][0] * vertices[(i + 1) % vertices.length][1] -
          vertices[i][1] * vertices[(i + 1) % vertices.length][0],
      )
      .reduce((a, b) => a + b) / 2,
  );
}

export function sumArray(a, b) {
  return lodash.zip(a, b).map(([x, y]) => x + y);
}

export function subArray(a, b, abs = false) {
  return lodash.zip(a, b).map(([x, y]) => (abs ? Math.abs(x - y) : x - y));
}

export function multiplyArray(arr, y) {
  return arr.map((x) => x * y);
}

export function printMapEvenly(map) {
  const maxLen = map.reduce(
    (_, l) => l.reduce((m, v) => Math.max(v?.toString().length, m), _),
    0,
  );

  console.log(
    map
      .map((l) =>
        l
          .map(
            (v) =>
              `${Array(maxLen - v?.toString().length)
                .fill(" ")
                .join("")}${v}`,
          )
          .join(" "),
      )
      .join("\n"),
  );
}

export function strToCoord(c) {
  return c.split(",").map(Number);
}
