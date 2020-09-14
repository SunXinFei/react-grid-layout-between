import { getFirstCollison } from './collision'
import { layoutBottom } from './utils'
/**
 * 布局的item排序，按照gridx由小到大，gridy由小到大
 * @param {Array} layout 布局的数组
 * @returns {Array} 新的排序后的layout
 */
const sortLayout = (layout) => {
  return [].concat(layout).sort((a, b) => {
    if (a.gridy > b.gridy || (a.gridy === b.gridy && a.gridx > b.gridx)) {
      return 1
    } else if (a.gridy === b.gridy && a.gridx === b.gridx) {
      return 0
    }
    return -1
  })
}
/**
 * 压缩单个元素，使得每一个元素都会紧挨着边界或者相邻的元素
 * @param {Array} finishedLayout 压缩完的元素会放进这里来，用来对比之后的每一个元素是否需要压缩
 * @param {Object} item
 * @returns {Object} item 返回新的坐标位置的item
 */
const compactItem = (finishedLayout, item) => {
  const newItem = { ...item }
  if (finishedLayout.length === 0) {
    return { ...newItem, gridy: 0 }
  }

  while (true) {
    const FirstCollison = getFirstCollison(finishedLayout, newItem)
    if (FirstCollison) {
      newItem.gridy = FirstCollison.gridy + FirstCollison.height
      return newItem
    }
    newItem.gridy--
    if (newItem.gridy < 0) return { ...newItem, gridy: 0 } // 碰到边界，gridy设为0
  }
}
/**
 * 纵向压缩vertical，使得每一个元素都会紧挨着边界或者相邻的元素
 * @param {Array} layout
 * @param {Object} movingItem
 * @returns {Array} layout 最新layout布局
 */
export const compactLayout = function (layout, movingItem) {
  const sorted = sortLayout(layout)
  const compareList = []
  const needCompact = Array(layout.length)

  for (let i = 0, length = sorted.length; i < length; i++) {
    const finished = compactItem(compareList, sorted[i])
    compareList.push(finished)
    needCompact[i] = finished
  }
  return needCompact
}
/**
 * 获取空闲卡片放置区域
 * @param {Array} finishedLayout
 * @param {Object} item
 * @param {Int} cols
 * @returns {Object} 卡片放置位置
 */
const getSpaceArea = (finishedLayout, item, cols) => {
  const newItem = { ...item }
  if (finishedLayout.length === 0) {
    return newItem
  }

  const FirstCollison = getFirstCollison(finishedLayout, newItem)
  if (FirstCollison) {
    newItem.gridx++
    if (newItem.gridx + item.width > cols) {
      newItem.gridx = 0
      newItem.gridy++
    }
    return getSpaceArea(finishedLayout, newItem, cols)
  } else {
    return newItem
  }
}

/**
 * horizontal compact Layout Version2.1
 * 横向压缩 2.1版本
 * 先将卡片按照x和y排序，
 * 放置一个卡片，从0，0开始检测是否碰撞或超过边界，如果碰撞，则grix=0，y+1，再次检测是否碰撞
 * 需优化的地方：如果移动中的卡片坐标应该一直在一个区域范围内，而不应该任意位置拖拽
 * @param {Array} layout
 * @param {Int} cols
 * @param {Object} movingCardID 移动中的元素id
 * @returns {Array} 最新layout布局
 */
export const compactLayoutHorizontal = function (layout, cols, movingCardID) {
  const sorted = sortLayout(layout)
  const compareList = []
  const needCompact = Array(layout.length)
  const arr = []
  let moveCard
  // 进行坐标重置，移动中的卡片除外
  for (let i = 0; i < sorted.length; i++) {
    if (movingCardID === sorted[i].id) {
      moveCard = sorted[i]
      continue
    }
    arr.push(sorted[i])
  }
  // 获得当前组内的最大的y值，并赋值给移动卡片，防止分组Y值无限变大
  if (moveCard) {
    moveCard.gridy = Math.min(layoutBottom(arr), moveCard.gridy)
  }
  // 将非移动的卡片进行坐标重置
  for (let i = 0; i < sorted.length; i++) {
    if (movingCardID !== sorted[i].id) {
      sorted[i].gridy = 0
      sorted[i].gridx = 0
    }
  }
  // 进行重新放置，移动中卡片除外
  for (let i = 0, length = sorted.length; i < length; i++) {
    const finished = getSpaceArea(compareList, sorted[i], cols)
    compareList.push(finished)
    needCompact[i] = finished
  }
  return needCompact
}

/**
 * horizontal compact Layout Version2.0
 * 横向压缩 2.0版本
 * 先将卡片按照x和y排序，
 * 放置一个卡片，从0，0开始检测是否碰撞或超过边界，如果碰撞，则grix=0，y+1，再次检测是否碰撞
 * @param {Array} layout
 * @param {Int} cols
 * @returns {layout} 最新layout布局
 */
// export const compactLayoutHorizontal = function(layout, cols) {
// 	let sorted = sortLayout(layout);
// 	const compareList = [];
// 	const needCompact = Array(layout.length);

// 	for (let i = 0; i < sorted.length; i++) {
// 		sorted[i].gridy = 0;
// 		sorted[i].gridx = 0;
// 	}
// 	let rowCount = 0;
// 	for (let i = 0, length = sorted.length; i < length; i++) {
// 		let finished = getSpaceArea(compareList, sorted[i], cols);
// 		compareList.push(finished);
// 		needCompact[i] = finished;
// 	}
// 	return needCompact;
// };
