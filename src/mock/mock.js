import Mock from 'mockjs';
export default [
  {
    id: 0,
    type: 'group',
    ...(() =>
      Mock.mock({
        'cards|15': [
          {
            'id|+1': 0,
            gridx: 0,
            gridy: 0,
            'width|1-2': 1,
            'height|1-2': 1,
            type: 'card',
            isShadow: false
          },
        ],
      }))(),
  },
  {
    id: 1,
    type: 'group',
    ...(() =>
      Mock.mock({
        'cards|20': [
          {
            'id|+1': 100,
            gridx: 0,
            gridy: 0,
            'width|1-2': 1,
            'height|1-2': 1,
            type: 'card',
            isShadow: false
          },
        ],
    }))(),
  }
]