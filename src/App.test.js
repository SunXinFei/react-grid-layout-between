import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { collision } from './utils/collision';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('collision interface', () => {
  const a = {
    gridx: 0,
    gridy: 0,
    width: 2,
    height: 1
  };
  const b = {
    gridx: 1,
    gridy: 0,
    width: 1,
    height: 1
  };
  expect(collision(a,b)).toEqual(true);
});
