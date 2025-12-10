import { getLines } from "../lib/helpers.js";

const input = getLines("./example1.txt").map((line) =>
  line.split(",").map((x) => Number(x)),
);
const maxY = Math.max(...input.map(([, y]) => y));
const edges = input.map((x, i) => [
  x,
  i + 1 === input.length ? input[0] : input[i + 1],
]);

console.log(maxY);

function area([x1, y1], [x2, y2]) {
  return (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);
}

function onSegment(p, q, r) {
  return (
    q[0] <= Math.max(p[0], r[0]) &&
    q[0] >= Math.min(p[0], r[0]) &&
    q[1] <= Math.max(p[1], r[1]) &&
    q[1] >= Math.min(p[1], r[1])
  );
}

function orientation(p, q, r) {
  let val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);

  if (val === 0) return 0;

  return val > 0 ? 1 : 2;
}

function intersect(points) {
  let o1 = orientation(points[0][0], points[0][1], points[1][0]);
  let o2 = orientation(points[0][0], points[0][1], points[1][1]);
  let o3 = orientation(points[1][0], points[1][1], points[0][0]);
  let o4 = orientation(points[1][0], points[1][1], points[0][1]);

  console.log(
    o1,
    o2,
    o3,
    o4,
    // onSegment(points[0][0], points[1][0], points[0][1]),
    // onSegment(points[0][0], points[1][1], points[0][1]),
    onSegment(points[1][0], points[0][0], points[1][1]),
    onSegment(points[1][0], points[0][1], points[1][1]),
  );

  if (o1 !== o2 && o3 !== o4) return true;

  // if (o1 === 0 && onSegment(points[0][0], points[1][0], points[0][1]))
  //   return true;
  //
  // if (o2 === 0 && onSegment(points[0][0], points[1][1], points[0][1]))
  //   return true;

  if (o3 === 0 && onSegment(points[1][0], points[0][0], points[1][1]))
    return true;

  if (o4 === 0 && onSegment(points[1][0], points[0][1], points[1][1]))
    return true;

  return false;
}

// function intersect(a, b, c, d) {
//   const ccw = ([x1, y1], [x2, y2], [x3, y3]) => {
//     return (y3 - y1) * (x2 - x1) > (y2 - y1) * (x3 - x1);
//   };
//
//   return ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d);
// }

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
      const [c, d] = [
        [a[0], b[1]],
        [b[0], a[1]],
      ];

      const [cInt, dInt] = edges.reduce(
        ([cAcc, dAcc], [f, g]) => {
          if (area(a, b) === 24) {
            console.log(
              f,
              g,
              intersect([
                [c, [c[0], maxY]],
                [f, g],
              ]),
            );
            console.log(
              f,
              g,
              intersect([
                [d, [d[0], maxY]],
                [f, g],
              ]),
            );
          }
          return [
            cAcc +
              intersect([
                [c, [c[0], maxY]],
                [f, g],
              ]),
            dAcc +
              intersect([
                [d, [d[0], maxY]],
                [f, g],
              ]),
          ];
        },
        [0, 0],
      );

      console.log(cInt, dInt, a, b, c, d, area(a, b));
      if (cInt % 2 !== 0 && dInt % 2 !== 0) {
        max = Math.max(max, area(a, b));
      }
    }
  }
  return max;
}

console.log(part1());
console.log(part2());
