import getRandomObjectId from "./getRandomObjectId";

test("returns a random element from an array", () => {
  const output = getRandomObjectId(testArray);
  expect(output).toBeLessThanOrEqual(10);
  expect(output).toBeGreaterThanOrEqual(1);
  expect(output % 1).toBe(0);
});

const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
