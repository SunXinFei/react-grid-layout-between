import React from 'react';
import ReactDOM from 'react-dom';
import App from '@/App';
import { collision } from '@/utils/collision';
import Cases2Collision from '@/../test/case-collision';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('collision interface', () => {
  Cases2Collision.forEach((caseData, i) => {
    console.log(`collision${i + 1}`);
    const {a,b} = caseData.test;
    expect(collision(a,b)).toEqual(caseData.expect);
  });
});
