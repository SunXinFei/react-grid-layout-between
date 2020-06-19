import React, { Component } from 'react';
//拖拽预览组件类
export default class CardListDragPreview extends Component {
	render() {
		const { cardListLength, cardId } = this.props;
		let divDom = [];
		for (let index = 0; index < cardListLength; index++) {
			//第一个显示layer的dom，需要显示图片和数量红色气泡
			if (index === cardListLength - 1) {
				const myIndex = index >= 3 ? 3 : index;
				divDom.push(
					<div
						key={index}
						className='layer-card'
						style={{ left: `${myIndex * 5}px`, top: `${myIndex * 5}px` }}
					>
						<span className='layer-card-span'>{cardId}</span>
					</div>
				);
			} else if (index < 3) {//layer的dom最多显示四个
				divDom.push(
					<div key={index} className='layer-card' style={{ left: `${index * 5}px`, top: `${index * 5}px` }} />
				);
			}
		}
		return <div className='custom-layer-card-list'>{divDom}</div>;
	}
}