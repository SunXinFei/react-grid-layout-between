import React, { Component } from 'react';
import _ from 'lodash';
//自定义组件
import { layoutCheck } from '../utils/collision';
import { compactLayout, compactLayoutHorizontal } from '../utils/compact';
import utils from '../utils';
import GroupItem from '../components/groupItem';
import mockData from '../mock/mock'

let resizeWaiter = false;

class MyContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			compactType: 'horizontal',//('vertical' | 'horizontal') = 'vertical'
			defaultLayout: {
				containerWidth: 1200,
				containerHeight: 300,
				calWidth: 175,
				rowHeight: 175,
				col: 6,
				margin: [10, 10],
				containerPadding: [0, 0]
			},
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
			groups: mockData
		};
	}
	/*
	 * 工作桌面 用户桌面设置 页面
	 * 关于卡片在组内的操作
	 */
	/**
	 * 拖拽中卡片在组上移动
	 * @param {Object} dragItem 拖拽中的对象
	 * @param {Object} hoverItem 拖拽中鼠标悬浮的对象
	 * @param {Number} x 当前元素所在的网页的x轴位置，单位为px
	 * @param {Number} y 当前元素所在的网页的y轴位置，单位为px
	**/
	moveCardInGroupItem = (dragItem, hoverItem, x, y) => {
		let groups = this.state.groups;
		let shadowCard = this.state.shadowCard;
		const { margin, containerWidth, col, rowHeight } = this.state.layout;
		//计算当前所在的网格坐标
		const { gridX, gridY } = utils.calGridXY(x, y, shadowCard.width, margin, containerWidth, col, rowHeight);
		if (gridX === shadowCard.gridx && gridY === shadowCard.gridy) {
			return;
		}
		let groupIndex = hoverItem.index;
		//先判断组内是否存在相同的卡片
		const cardid = shadowCard.id;
		// const isContain = utils.checkCardContainInGroup(groups[groupIndex], cardid);

		// if (isContain) {
		// 	return;
		// }
		//删除阴影的卡片
		_.forEach(groups, (g, index) => {
			_.remove(g.cards, (a) => {
				return a.isShadow === true;
			});
		});

		shadowCard = { ...shadowCard, gridx: gridX, gridy: gridY };
		//添加阴影的卡片
		groups[groupIndex].cards.push(shadowCard);
		//获得当前分组内最新的layout布局
		const newlayout = layoutCheck(
			groups[groupIndex].cards,
			shadowCard,
			shadowCard.id,
			shadowCard.id,
			this.state.compactType
		);
		//压缩当前分组内的layout布局
		let compactedLayout;
		if (this.state.compactType === 'horizontal') {
			compactedLayout = compactLayoutHorizontal(newlayout, this.state.layout.col, cardid);
		} else if (this.state.compactType === 'vertical') {
			compactedLayout = compactLayout(newlayout, shadowCard);
		}
		//更新group对象
		groups[groupIndex].cards = compactedLayout;
		this.updateShadowCard(shadowCard);
		this.updateGroupList(groups);
	};
	/**
	 * 释放卡片到分组
	 * @param {Object} dragItem 拖拽的卡片对象
	 * @param {Object} dropItem 释放的目标组对象
	**/
	onCardDropInGroupItem = (dragItem, dropItem) => {
		let { groups } = this.state;
		groups = _.cloneDeep(groups);
		//将所有分组内的阴影卡片设为非阴影
		utils.setPropertyValueForCards(groups, 'isShadow', false);
		//目标组内重新横向压缩布局
		_.forEach(groups, (g, targetGroupIndex) => {
			if (this.state.compactType === 'horizontal') {
				let compactedLayout = compactLayoutHorizontal(groups[targetGroupIndex].cards, this.state.layout.col);
				groups[targetGroupIndex].cards = compactedLayout;
			} else if (this.state.compactType === 'vertical') {
				let compactedLayout = compactLayout(groups[targetGroupIndex].cards);
				groups[targetGroupIndex].cards = compactedLayout;
			}

		});
		this.updateGroupList(groups);
		this.updateShadowCard({});
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
					groups = {groups}
					moveCardInGroupItem={this.moveCardInGroupItem}
					onDrop={this.onDrop}
					onCardDropInGroupItem={this.onCardDropInGroupItem}
					getCardsByGroupIndex={this.getCardsByGroupIndex}
					layout={this.state.layout}
					defaultLayout={this.state.defaultLayout}
					updateShadowCard={this.updateShadowCard}
					updateGroupList={this.updateGroupList}
					handleLoad={this.handleLoad}
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
	//
	updateLayout = (layout) => {
		this.setState({ layout });
	}
	//通过Group Index获取cards
	getCardsByGroupIndex = (groupIndex) => {
		let { groups } = this.state;
		return groups[groupIndex].cards;
	};
	// 当页面加载完成，获得卡片容器宽度
	handleLoad = () => {
		if (!resizeWaiter) {
			resizeWaiter = true;
			setTimeout(() => {
				console.info('resize!');
				resizeWaiter = false;
				let clientWidth;
				const containerDom = document.querySelector('#card-container');
				if (containerDom) {
					clientWidth = containerDom.clientWidth;
				} else {
					const firstAddButton = document.querySelector('#first-add');
					if (firstAddButton) {
						clientWidth = firstAddButton.clientWidth - 10;
					} else {
						return;
					}
				}
				const defaultCalWidth = this.state.defaultLayout.calWidth;
				const { containerPadding, margin } = this.state.layout;
				let layout = _.cloneDeep(this.state.layout);
				const windowWidth = window.innerWidth - 60 * 2;
				const col = utils.calColCount(defaultCalWidth, windowWidth, containerPadding, margin);
				const calWidth = utils.calColWidth(clientWidth, col, containerPadding, margin);

				let { groups } = this.state;
				groups = _.cloneDeep(groups);
				_.forEach(groups, (g) => {
					let compactedLayout = compactLayoutHorizontal(g.cards, col);
					g.cards = compactedLayout;
				});

				layout.calWidth = layout.rowHeight = calWidth;
				layout.col = col;
				layout.containerWidth = clientWidth;
				this.updateGroupList(groups);
				this.updateLayout(layout);
			}, 500);
		}
	};
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleLoad);
		console.log('移除window中resize fn');
	}
	componentDidMount() {
		window.addEventListener('resize', this.handleLoad);
	}
	changeCompactType = () =>{
		const { compactType: oldCompactType } = this.state;
		const compactType =
			oldCompactType === "horizontal"
				? "vertical"
				: "horizontal";
		this.setState({ compactType });
	}
	render() {
		const { groups, compactType } = this.state;
		return (
			<div>
				<button style={{ height:'30px'} } onClick={this.changeCompactType}>Change Compaction Type: <b>{compactType}</b></button>
				{this.initGroupItem(groups)}
			</div>

		);
	}
}

export default MyContent;