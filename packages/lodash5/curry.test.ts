import curry from "./curry";

describe(`curry`, () => {
  it(`should remember passed arguments unless all of them are reached`, () => {
    const fn = curry((a: number, b: number, c: number) => a + b + c);
    const result1 = fn(1);
    const result2 = result1(2);
    const result3 = result2(3);

    expect(result1).toBeInstanceOf(Function);
    expect(result2).toBeInstanceOf(Function);
    expect(result3).toBe(6);
  });
});
