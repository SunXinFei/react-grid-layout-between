import React, { Component } from 'react';
// drag && drop
import { DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import Card from './card';
import utils from '@/utils';
import _ from 'lodash';

const groupItemTarget = {
  hover(props, monitor, component) {
    const dragItem = monitor.getItem();
    if (dragItem.type === 'group') {
      //组hover到组
      const dragIndex = monitor.getItem().index;
      const hoverIndex = props.index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      props.moveGroupItem(dragIndex, hoverIndex);

      monitor.getItem().index = hoverIndex;
    } else if (dragItem.type === 'card') {
      //卡片到组
      const hoverItem = props;
      const { x, y } = monitor.getClientOffset();
      const groupItemBoundingRect = findDOMNode(component).getBoundingClientRect();
      const groupItemX = groupItemBoundingRect.left;
      const groupItemY = groupItemBoundingRect.top;
      props.moveCardInGroupItem(dragItem, hoverItem, x - groupItemX, y - groupItemY);
    }
  },
  drop(props, monitor, component) {
    const dragItem = monitor.getItem();
    const dropItem = props;
    if (dragItem.type === 'card') {//释放的分组内的卡片
      props.onCardDropInGroupItem(dragItem, dropItem);
    }
  }
};

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
		let clientWidth;
		const containerDom = document.querySelector('#card-container');
		if (containerDom) {
			clientWidth = containerDom.clientWidth;
		}
		if (this.props.layout.containerWidth !== clientWidth) {
			this.props.handleLoad();
		}
	}
  //创建卡片
	createCards(cards, groupID, groups) {
		let itemDoms = [];
		_.forEach(cards, (c, i) => {
			itemDoms.push(
				<Card
					dragCardID={-1}
          type={'card'}
          groups = {groups}
          card={c}
					id={c.id}
					index={i}
					gridx={c.gridx}
					gridy={c.gridy}
					width={c.width}
					height={c.height}
					isShadow={c.isShadow}
					key={`${groupID}_${c.id}`}
          layout={this.props.layout}
          updateShadowCard={this.props.updateShadowCard}
          updateGroupList={this.props.updateGroupList}
				/>
			);
		});
		return itemDoms;
	}

  render() {
    const {
      connectDropTarget,
      isOver,
      id,
      cards,
      defaultLayout,
      layout,
      groups
    } = this.props;
    const containerHeight = utils.getContainerMaxHeight(cards, layout.rowHeight, layout.margin);
    return connectDropTarget(
      <div className="group-item"  >
					<div
						className='group-item-container'
						style={{ background: isOver ? 'rgb(204, 204, 204)' : 'rgba(79,86,98,.1)' }}
					>
						<section
							id='card-container'
							style={{
								height:
									containerHeight > defaultLayout.containerHeight
										? containerHeight
										: defaultLayout.containerHeight
							}}
						>
							{this.createCards(cards, id, groups)}
						</section>
					</div>
				</div>
    );
  }
}
function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}
const Container = DropTarget('item', groupItemTarget, collectTarget)(Demo);
export default Container;
