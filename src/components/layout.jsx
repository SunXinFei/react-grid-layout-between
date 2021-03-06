import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import _ from 'lodash';
//自定义组件
import { layoutCheck } from '../utils/collision';
import { compactLayout, compactLayoutHorizontal } from '../utils/compact';
import utils from '../utils';
import GroupItem from './groupItem';
import CustomDragLayer from './dragLayer';
import PropTypes from 'prop-types'
import styles from '../styles.module.css';

let resizeWaiter = false;

class MyContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			defaultLayout: {
				containerWidth: 1200,
				containerHeight: 300,
				calWidth: 175,
				rowHeight: 175,
				col: 6,
				margin: [10, 10],
				containerPadding: [0, 0]
			},
			layout: props.layout,
			shadowCard: {},
			groups: props.groups
		};
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleLoad);
	}
	componentDidMount() {
		window.addEventListener('resize', this.handleLoad);
	}
	// 当页面加载完成，获得卡片容器宽度，并自动排列卡片
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
	}
	/*
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
		// const cardid = shadowCard.id;
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
			this.props.compactType
		);
		//压缩当前分组内的layout布局
		let compactedLayout;
		if (this.props.compactType === 'horizontal') {
			compactedLayout = compactLayoutHorizontal(newlayout, this.state.layout.col, shadowCard.id);
		} else if (this.props.compactType === 'vertical') {
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
		//目标组内重新横向压缩布局，由于跨组，故须全部压缩
		_.forEach(groups, (g, i) => {
			if (this.props.compactType === 'horizontal') {
				let compactedLayout = compactLayoutHorizontal(groups[i].cards, this.state.layout.col);
				g.cards = compactedLayout;
			} else if (this.props.compactType === 'vertical') {
				let compactedLayout = compactLayout(groups[i].cards);
				g.cards = compactedLayout;
			}

		});
		this.updateGroupList(groups);
		this.updateShadowCard({});
	};
	//初始化组
	initGroupItem(groups) {
		console.log(groups,'groups')
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
	//更新分组数据
	updateGroupList = (groups) => {
		this.setState({ groups });
	}
	//更新阴影卡片
	updateShadowCard = (shadowCard) => {
		this.setState({ shadowCard });
	}
	//更新布局
	updateLayout = (layout) => {
		this.setState({ layout });
		this.props.onLayoutChange(layout);
	}
	render() {
		const { groups } = this.state;
		return (
			<div>
				<CustomDragLayer/>
				{this.initGroupItem(groups)}
			</div>

		);
	}
}

MyContent.defaultProps = {
	compactType: 'vertical',//('vertical' | 'horizontal')
	layout: {
		containerWidth: 1200,
		containerHeight: 300,
		calWidth: 175,
		rowHeight: 175,
		col: 6,
		margin: [10, 10],
		containerPadding: [0, 0]
	},
	onLayoutChange: utils.noop
}
MyContent.propTypes = {
	compactType: PropTypes.string,
	layout: PropTypes.object,
	onLayoutChange: PropTypes.func
}

export default DragDropContext(HTML5Backend)(MyContent);