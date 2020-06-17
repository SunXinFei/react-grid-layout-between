const testData1 = {
  test: {
    a: {
      gridx: 0,
      gridy: 0,
      width: 2,
      height: 1
    },
    b: {
      gridx: 1,
      gridy: 0,
      width: 1,
      height: 1
    }
  },
  expect: true,
};
const testData2 = {
  test: {
    a: {
      gridx: 0,
      gridy: 0,
      width: 1,
      height: 1
    },
    b: {
      gridx: 1,
      gridy: 0,
      width: 1,
      height: 1
    }
  },
  expect: false,
};

export default [
  testData1,
  testData2
];