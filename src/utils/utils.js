import _ from 'lodash'
/**
 * 以组为单位，设置卡片属性值
 * @param {Array} groups
 * @param {String} property
 * @param {*} value
 */
export const setPropertyValueForCards = (groups, property, value) => {
  _.forEach(groups, (g, index) => {
    _.forEach(g.cards, (a) => {
      a[property] = value
    })
  })
}

/**
 * 已知放置格子数量, 计算容器的每一个格子多大
 * @param {Number} containerWidth
 * @param {Number} col
 * @param {Number} containerPadding
 * @param {Number} margin
 * @returns {Number} 单元格大小
 */
export const calColWidth = (containerWidth, col, containerPadding, margin) => {
  if (margin) {
    return (
      (containerWidth - containerPadding[0] * 2 - margin[0] * (col + 1)) / col
    )
  }
  return (containerWidth - containerPadding[0] * 2 - 0 * (col + 1)) / col
}

/**
 * 已知格子大小，计算容器一行放置格子数量
 * @param {Number} defaultCalWidth
 * @param {Number} containerWidth
 * @param {Number} containerPadding
 * @param {Number} margin
 * @returns {Number} 每行单元格数量
 */
export const calColCount = (
  defaultCalWidth,
  containerWidth,
  containerPadding,
  margin
) => {
  if (margin) {
    return Math.floor(
      (containerWidth - containerPadding[0] * 2 - margin[0]) /
        (defaultCalWidth + margin[0])
    )
  }
}

/**
 * 获得当前layout中最底单元格的Y坐标
 * @param {Array} layout
 * @returns {Number} 最底单元格Y坐标
 */
export const layoutBottom = (layout) => {
  let max = 0
  let bottomY
  for (let i = 0, len = layout.length; i < len; i++) {
    bottomY = layout[i].gridy + layout[i].height
    if (bottomY > max) max = bottomY
  }
  return max
}

/**
 * 计算横向的长度
 * @param {Array} layout
 * @returns {Number} 最大长度
 */
export const layoutHorizontalRowLength = (layout) => {
  let max = 0
  let rowX
  for (let i = 0, len = layout.length; i < len; i++) {
    rowX = layout[i].gridx + layout[i].width
    if (rowX > max) max = rowX
  }
  return max
}
/**
 * 计算卡片容器的最大高度
 * @param {Array} cards
 * @param {Number} rowHeight
 * @param {Number} margin
 * @returns {Number} 容器高度
 */
export const getContainerMaxHeight = (cards, rowHeight, margin) => {
  const resultRow = layoutBottom(cards)
  return resultRow * rowHeight + (resultRow - 1) * margin[1] + 2 * margin[1]
}

/**
 * 给予一个grid的位置，算出元素具体的在容器中位置在哪里，单位是px
 * @param {Number} gridx
 * @param {Number} gridy
 * @param {Number} margin
 * @param {Number} rowHeight
 * @param {Number} calWidth
 * @returns {Object} 包含x，y坐标的对象
 */
export const calGridItemPosition = (
  gridx,
  gridy,
  margin,
  rowHeight,
  calWidth
) => {
  const x = Math.round(gridx * calWidth + margin[0] * (gridx + 1))
  const y = Math.round(gridy * rowHeight + margin[1] * (gridy + 1))
  return {
    x: x,
    y: y
  }
}
/**
 * 防止元素溢出容器
 * @param {Int} gridX
 * @param {Int} gridY
 * @param {Int} col
 * @param {Int} w 卡片宽度
 * @returns {Object} gridX，gridY的单元格坐标对象
 */
export const checkInContainer = (gridX, gridY, col, w) => {
  if (gridX + w > col - 1) gridX = col - w // 右边界
  if (gridX < 0) gridX = 0 // 左边界
  if (gridY < 0) gridY = 0 // 上边界
  return { gridX, gridY }
}
/**
 * 通过坐标x，y像素值计算所在的单元格坐标
 * @param {Number} x
 * @param {Number} y
 * @param {Number} cardWidth
 * @param {Number} margin
 * @param {Number} containerWidth
 * @param {Number} col
 * @param {Number} rowHeight
 * @returns {Object} 包含gridx和gridy的单元格坐标的对象
 */
export const calGridXY = (
  x,
  y,
  cardWidth,
  margin,
  containerWidth,
  col,
  rowHeight
) => {
  // 坐标转换成格子的时候，向下取整，无须计算margin
  const gridX = Math.floor((x / containerWidth) * col)
  const gridY = Math.floor(y / (rowHeight + (margin ? margin[1] : 0)))
  // 防止卡片溢出容器
  return checkInContainer(gridX, gridY, col, cardWidth)
}

/**
 * 宽和高计算成为px
 * @param {Number} w
 * @param {Number} h
 * @param {Number} margin
 * @param {Number} rowHeight
 * @param {Number} cardWidth
 * @returns {Object} 包含wPx, hPx的对象
 */
export const calWHtoPx = (w, h, margin, rowHeight, calWidth) => {
  const wPx = Math.round(w * calWidth + (w - 1) * margin[0])
  const hPx = Math.round(h * rowHeight + (h - 1) * margin[1])
  return { wPx, hPx }
}

export const noop = () => {}
