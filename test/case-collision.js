/**
 *碰撞检测方法的测试用例
 */

/**
 * (0,0) 宽2 高1
 * (1,0) 宽1 高1
 */
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
/**
 * (0,0) 宽1 高1
 * (1,0) 宽1 高1
 */
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
/**
 * (0,0) 宽1 高2
 * (0,1) 宽1 高1
 * 碰撞 解决issue：when 2x2 or 1x2 collosion bug for horizontal
 */
const testData3 = {
  test: {
    a: {
      gridx: 0,
      gridy: 0,
      width: 1,
      height: 2
    },
    b: {
      gridx: 0,
      gridy: 1,
      width: 1,
      height: 1
    }
  },
  expect: true,
};

export default [
  testData1,
  testData2,
  testData3
];
