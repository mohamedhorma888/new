const { add, multiply } = require('../src/math');

test('add(1, 2) returns 3', () => {
  expect(add(1, 2)).toBe(3);
});

test('multiply(3, 4) returns 12', () => {
  expect(multiply(3, 4)).toBe(12);
});

test('add handles negative values', () => {
  expect(add(-2, 4)).toBe(2);
});

test('multiply handles zero', () => {
  expect(multiply(0, 10)).toBe(0);
});
