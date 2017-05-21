import { Code } from "../providers.js";

test('pin code length', () => {
  expect(new Code().pin()).toHaveLength(4)
});
