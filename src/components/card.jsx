import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import utils from '../utils';
import _ from 'lodash';

const noteSource = {
  //开始拖拽，设置isShadow属性，shadowCard对象，更新groups
  beginDrag(props, monitor, component) {
    let dragCard = props.card;

		dragCard.isShadow = true;
		props.updateShadowCard(dragCard);

		return { id: props.id, type: props.type };
  },
  //结束拖拽，设置isShadow属性，shadowCard对象，更新groups
  endDrag(props, monitor, component) {
    //判断是否正常走了drop事件
		if (!monitor.didDrop()) {
			let { groups, groupIndex } = props;
			groups = _.cloneDeep(groups);
			utils.setPropertyValueForCards(groups, 'isShadow', false);
			props.updateShadowCard({});
			props.updateGroupList(groups);
		}
  }
};
class Item extends Component {
  constructor(props) {
    super(props);
  }
  //依靠前后props中shadowCard状态（前为空对象，后为有对象）来判断是否为beginDrag状态，来阻止dom刷新
	shouldComponentUpdate(nextProps, nextState) {
		const thisProps = this.props || {},
			thisState = this.state || {};
		//全等判断值为false，使用isEqual判断
		if (!_.isEqual(this.props.layout, nextProps.layout)) {
			return true;
		}
		if (this.props.gridx !== nextProps.gridx || this.props.gridy !== nextProps.gridy) {
			return true;
		}
		if (this.props.isShadow !== nextProps.isShadow) {
			return true;
		}
		return false;
	}
  render() {
    const { connectDragSource, gridx, gridy, width, height, isShadow, id } = this.props;
    const { margin, rowHeight, calWidth } = this.props.layout;
    const { x, y } = utils.calGridItemPosition(gridx, gridy, margin, rowHeight, calWidth);
    const { wPx, hPx } = utils.calWHtoPx(width, height, margin, rowHeight, calWidth);
    let cardDom;
    //是否为拖拽中的阴影卡片
    if (isShadow) {
      cardDom = (<div
        className='card-shadow'
        style={{
          width: wPx,
          height: hPx,
          transform: `translate(${x}px, ${y}px)`,

        }}
      >
      </div>
      )
    } else {
      cardDom = (
        <div
          className='card'
          style={{
            width: wPx,
            height: hPx,
            opacity: 1,
            transform: `translate(${x}px, ${y}px)`,
          }}
        >
        {id}
        </div>
      );
    }
    return connectDragSource(cardDom);
  }
}
function collectSource(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging()
  };
}
const dragDropItem = DragSource('item', noteSource, collectSource)(Item);
export default dragDropItem;
