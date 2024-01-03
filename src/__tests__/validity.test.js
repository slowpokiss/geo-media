test.each([
  ["51.50851, -0.12572", true],
  ["51.50851,-0.12572", false],
  ["[51.50851, −0.12572]", false],
])("(validity test for %s)", (a, expected) => {
  const regular = /^-?\d{1,2}\.\d{5}, -?\d{1,3}\.\d{5}$/;
  const result = regular.test(a);
  expect(result).toBe(expected);
});
