import React, { Component } from 'react';
import _ from 'lodash';
//自定义组件
import { layoutCheck } from '../utils/collision';
import { compactLayout, compactLayoutHorizontal } from '../utils/compact';
import utils from '../utils';
import GroupItem from '../components/groupItem';

let resizeWaiter = false;

class MyContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			layout: {
				containerWidth: 1200,
				containerHeight: 300,
				calWidth: 175,
				rowHeight: 175,
				col: 6,
				margin: [10, 10],
				containerPadding: [0, 0]
			},
			shadowCard: {

			},
			groups: [
				{
					id: 0,
					type: 'group',
					cards: [{
						id: 0,
						gridx: 0,
						gridy: 0,
						width: 1,
						height: 1,
						type: 'card',
						isShadow: false
					}, {
						id: 1,
						gridx: 1,
						gridy: 0,
						width: 1,
						height: 1,
						type: 'card',
						isShadow: false
					}]
				},
				{
					id: 1,
					type: 'group',
					cards: [{
						id: 2,
						gridx: 0,
						gridy: 0,
						width: 1,
						height: 1,
						type: 'card',
						isShadow: false
					}, {
						id: 3,
						gridx: 1,
						gridy: 0,
						width: 1,
						height: 1,
						type: 'card',
						isShadow: false
					}]
				}
			]
		};
	}
	//拖拽中卡片在组上移动
	moveCardInGroupItem = (dragItem, hoverItem, x, y) => {
		let { groups, shadowCard } = this.state;
		const { margin, containerWidth, col, rowHeight } = this.state.layout;
		const { gridX, gridY } = utils.calGridXY(x, y, shadowCard.width, margin, containerWidth, col, rowHeight);
		if (gridX === shadowCard.gridx && gridY === shadowCard.gridy) {
			return;
		}
		let groupIndex = hoverItem.index;
		//先判断组内有没有相同的appID
		// const id = shadowCard.id;
		// const isContain = utils.checkCardContainInGroup(groups[groupIndex], id);

		// if (isContain) {
		// 	return;
		// }

		_.forEach(groups, (g, index) => {
			_.remove(g.cards, (a) => {
				return a.isShadow === true;
			});
		});

		shadowCard = { ...shadowCard, gridx: gridX, gridy: gridY };

		groups[groupIndex].cards.push(shadowCard);

		const newlayout = layoutCheck(
			groups[groupIndex].cards,
			shadowCard,
			shadowCard.id,
			shadowCard.id
		);

		const compactedLayout = compactLayout(newlayout, shadowCard);
		groups[groupIndex].cards = compactedLayout;
		this.setState({ shadowCard, groups })
	};
	/*
	 * 工作桌面 用户桌面设置 页面
	 * 关于组的操作
	 */
	//移动组顺序
	moveGroupItem = (dragIndex, hoverIndex) => {
		let { groups } = this.state;
		groups = _.cloneDeep(groups);
		const dragCard = groups[dragIndex];
		groups.splice(dragIndex, 1);
		groups.splice(hoverIndex, 0, dragCard);
		this.setState({ groups })
	};
	//释放分组到分组
	onDrop = (dragItem, dropItem) => {
		if (dragItem.type === dropItem.type) {
			return;
		}
		let { groups } = this.state;
		groups = _.cloneDeep(groups);
		let card;
		let dropGroupIndex, dragCardIndex, dragCardFromGroupIndex;
		for (let i = 0, len = groups.length; i < len; i++) {
			if (groups[i].pk_app_group === dropItem.id) {
				dropGroupIndex = i;
			}
			for (let j = 0, len2 = groups[i].cards.length; j < len2; j++) {
				let cards = groups[i].cards;
				if (cards[j].id === dragItem.id) {
					card = cards[j];
					dragCardIndex = j;
					dragCardFromGroupIndex = i;
				}
			}
		}
		groups[dragCardFromGroupIndex].cards.splice(dragCardIndex, 1);
		groups[dropGroupIndex].cards.push(card);
		this.setState({ groups })
	};
	//释放卡片到分组
	onCardDropInGroupItem = (dragItem, dropItem) => {
		let { groups } = this.state;
		groups = _.cloneDeep(groups);
		const targetGroupIndex = dropItem.index;
		const cardList = dragItem.cardList;

		utils.setPropertyValueForCards(groups, 'isShadow', false);
		//目标组内重新布局
		_.forEach(groups, (g, targetGroupIndex) => {
			let compactedLayout = compactLayoutHorizontal(groups[targetGroupIndex].cards, this.state.layout.col);
			groups[targetGroupIndex].cards = compactedLayout;
		});

		this.setState({ groups, shadowCard: {} })
	};
	//初始化组
	initGroupItem(groups) {
		let itemDoms = [];
		itemDoms = groups.map((g, i) => {
			return (
				<GroupItem
					key={g.id}
					id={g.id}
					type={g.type}
					index={i}
					cards={g.cards}
					length={groups.length}
					// groupname={g.groupname}
					moveCardInGroupItem={this.moveCardInGroupItem}
					onDrop={this.onDrop}
					onCardDropInGroupItem={this.onCardDropInGroupItem}
					onCardListDropInGroupItem={this.onCardListDropInGroupItem}
					moveGroupItem={this.moveGroupItem}
					getCardsByGroupIndex={this.getCardsByGroupIndex}
					layout={this.state.layout}
					updateShadowCard={this.updateShadowCard}
					updateGroupList={this.updateGroupList}
				// handleLoad={this.handleLoad}
				/>
			);
		});
		return itemDoms;
	}
	//
	updateGroupList = (groups) => {
		this.setState({ groups });
	}
	//
	updateShadowCard = (shadowCard) => {
		this.setState({ shadowCard });
	}
	//通过Group Index获取cards
	getCardsByGroupIndex = (groupIndex) => {
		let { groups } = this.state;
		return groups[groupIndex].cards;
	};
	//当页面加载完成，获得卡片容器宽度
	// handleLoad = () => {
	// 	if (!resizeWaiter) {
	// 		resizeWaiter = true;
	// 		setTimeout(() => {
	// 			console.info('resize！');
	// 			resizeWaiter = false;
	// 			let clientWidth;
	// 			const containerDom = document.querySelector('#card-container');
	// 			if (containerDom) {
	// 				clientWidth = containerDom.clientWidth;
	// 			} else {
	// 				const firstAddButton = document.querySelector('#first-add');
	// 				if (firstAddButton) {
	// 					clientWidth = firstAddButton.clientWidth - 10;
	// 				} else {
	// 					return;
	// 				}
	// 			}
	// 			const defaultCalWidth = this.props.defaultLayout.calWidth;
	// 			const { containerPadding, margin } = this.props.layout;
	// 			let layout = _.cloneDeep(this.props.layout);
	// 			const windowWidth = window.innerWidth - 60 * 2;
	// 			const col = utils.calColCount(defaultCalWidth, windowWidth, containerPadding, margin);
	// 			const calWidth = utils.calColWidth(clientWidth, col, containerPadding, margin);

	// 			let { groups } = this.props;
	// 			groups = _.cloneDeep(groups);
	// 			_.forEach(groups, (g) => {
	// 				let compactedLayout = compactLayoutHorizontal(g.cards, col);
	// 				g.cards = compactedLayout;
	// 			});

	// 			layout.calWidth = layout.rowHeight = calWidth;
	// 			layout.col = col;
	// 			layout.containerWidth = clientWidth;
	// 			this.props.updateGroupList(groups);
	// 			this.props.updateLayout(layout);
	// 		}, 500);
	// 	}
	// };
	// componentWillUnmount() {
	// 	window.removeEventListener('resize', this.handleLoad);
	// 	console.log('移除window中resize fn');
	// }
	// componentDidMount() {
	// 	window.addEventListener('resize', this.handleLoad);
	// }
	render() {
		const { groups } = this.state;
		return (
			<div>
				{this.initGroupItem(groups)}
			</div>
			
		);
	}
}

export default MyContent;