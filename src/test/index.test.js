import { collision } from '../utils/collision'
import Cases2Collision from './case-collision'

test('collision interface', () => {
  Cases2Collision.forEach((caseData, i) => {
    console.log(`collision${i + 1}`)
    const { a, b } = caseData.test
    expect(collision(a, b)).toEqual(caseData.expect)
  })
})
