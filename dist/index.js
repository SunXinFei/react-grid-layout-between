function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var HTML5Backend = require('react-dnd-html5-backend');
var HTML5Backend__default = _interopDefault(HTML5Backend);
var reactDnd = require('react-dnd');
var _ = _interopDefault(require('lodash'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var collision = function collision(a, b) {
  if (a.gridx === b.gridx && a.gridy === b.gridy && a.width === b.width && a.height === b.height) {
    return true;
  }

  if (a.gridx + a.width <= b.gridx) return false;
  if (a.gridx >= b.gridx + b.width) return false;
  if (a.gridy + a.height <= b.gridy) return false;
  if (a.gridy >= b.gridy + b.height) return false;
  return true;
};
var getFirstCollison = function getFirstCollison(layout, item) {
  for (var i = 0, length = layout.length; i < length; i++) {
    if (collision(layout[i], item)) {
      return layout[i];
    }
  }

  return null;
};
var layoutCheck = function () {
  var _layoutCheck = function _layoutCheck(layout, layoutItem, cardID, fristItemID, compactType) {
    if (compactType === void 0) {
      compactType = 'vertical';
    }

    var keyArr = [];
    var movedItem = [];
    var axis = compactType === 'vertical' ? 'gridy' : 'gridx';
    var newlayout = layout.map(function (item, index) {
      if (item.id !== cardID) {
        if (collision(item, layoutItem)) {
          keyArr.push(item.id);
          var offsetXY = item[axis] + 1;
          var widthOrHeight = axis === 'gridx' ? item.width : item.height;

          if (layoutItem[axis] > item[axis] && layoutItem[axis] < item[axis] + widthOrHeight) {
            offsetXY = item[axis];
          }

          var newItem = _extends({}, item);

          newItem[axis] = offsetXY;
          movedItem.push(newItem);
          return newItem;
        }
      } else if (fristItemID === cardID) {
        return _extends({}, item, layoutItem);
      }

      return item;
    });

    for (var c = 0, length = movedItem.length; c < length; c++) {
      newlayout = _layoutCheck(newlayout, movedItem[c], keyArr[c], fristItemID, compactType);
    }

    return newlayout;
  };

  return _layoutCheck;
}();

var setPropertyValueForCards = function setPropertyValueForCards(groups, property, value) {
  _.forEach(groups, function (g, index) {
    _.forEach(g.cards, function (a) {
      a[property] = value;
    });
  });
};
var calColWidth = function calColWidth(containerWidth, col, containerPadding, margin) {
  if (margin) {
    return (containerWidth - containerPadding[0] * 2 - margin[0] * (col + 1)) / col;
  }

  return (containerWidth - containerPadding[0] * 2 - 0 * (col + 1)) / col;
};
var calColCount = function calColCount(defaultCalWidth, containerWidth, containerPadding, margin) {
  if (margin) {
    return Math.floor((containerWidth - containerPadding[0] * 2 - margin[0]) / (defaultCalWidth + margin[0]));
  }
};
var layoutBottom = function layoutBottom(layout) {
  var max = 0;
  var bottomY;

  for (var i = 0, len = layout.length; i < len; i++) {
    bottomY = layout[i].gridy + layout[i].height;
    if (bottomY > max) max = bottomY;
  }

  return max;
};
var layoutHorizontalRowLength = function layoutHorizontalRowLength(layout) {
  var max = 0;
  var rowX;

  for (var i = 0, len = layout.length; i < len; i++) {
    rowX = layout[i].gridx + layout[i].width;
    if (rowX > max) max = rowX;
  }

  return max;
};
var getContainerMaxHeight = function getContainerMaxHeight(cards, rowHeight, margin) {
  var resultRow = layoutBottom(cards);
  return resultRow * rowHeight + (resultRow - 1) * margin[1] + 2 * margin[1];
};
var calGridItemPosition = function calGridItemPosition(gridx, gridy, margin, rowHeight, calWidth) {
  var x = Math.round(gridx * calWidth + margin[0] * (gridx + 1));
  var y = Math.round(gridy * rowHeight + margin[1] * (gridy + 1));
  return {
    x: x,
    y: y
  };
};
var checkInContainer = function checkInContainer(gridX, gridY, col, w) {
  if (gridX + w > col - 1) gridX = col - w;
  if (gridX < 0) gridX = 0;
  if (gridY < 0) gridY = 0;
  return {
    gridX: gridX,
    gridY: gridY
  };
};
var calGridXY = function calGridXY(x, y, cardWidth, margin, containerWidth, col, rowHeight) {
  var gridX = Math.floor(x / containerWidth * col);
  var gridY = Math.floor(y / (rowHeight + (margin ? margin[1] : 0)));
  return checkInContainer(gridX, gridY, col, cardWidth);
};
var calWHtoPx = function calWHtoPx(w, h, margin, rowHeight, calWidth) {
  var wPx = Math.round(w * calWidth + (w - 1) * margin[0]);
  var hPx = Math.round(h * rowHeight + (h - 1) * margin[1]);
  return {
    wPx: wPx,
    hPx: hPx
  };
};
var noop = function noop() {};

var utils = {
  __proto__: null,
  setPropertyValueForCards: setPropertyValueForCards,
  calColWidth: calColWidth,
  calColCount: calColCount,
  layoutBottom: layoutBottom,
  layoutHorizontalRowLength: layoutHorizontalRowLength,
  getContainerMaxHeight: getContainerMaxHeight,
  calGridItemPosition: calGridItemPosition,
  checkInContainer: checkInContainer,
  calGridXY: calGridXY,
  calWHtoPx: calWHtoPx,
  noop: noop
};

var sortLayout = function sortLayout(layout) {
  return [].concat(layout).sort(function (a, b) {
    if (a.gridy > b.gridy || a.gridy === b.gridy && a.gridx > b.gridx) {
      return 1;
    } else if (a.gridy === b.gridy && a.gridx === b.gridx) {
      return 0;
    }

    return -1;
  });
};

var compactItem = function compactItem(finishedLayout, item) {
  var newItem = _extends({}, item);

  if (finishedLayout.length === 0) {
    return _extends({}, newItem, {
      gridy: 0
    });
  }

  while (true) {
    var FirstCollison = getFirstCollison(finishedLayout, newItem);

    if (FirstCollison) {
      newItem.gridy = FirstCollison.gridy + FirstCollison.height;
      return newItem;
    }

    newItem.gridy--;
    if (newItem.gridy < 0) return _extends({}, newItem, {
      gridy: 0
    });
  }
};

var compactLayout = function compactLayout(layout, movingItem) {
  var sorted = sortLayout(layout);
  var compareList = [];
  var needCompact = Array(layout.length);

  for (var i = 0, length = sorted.length; i < length; i++) {
    var finished = compactItem(compareList, sorted[i]);
    compareList.push(finished);
    needCompact[i] = finished;
  }

  return needCompact;
};

var getSpaceArea = function getSpaceArea(finishedLayout, item, cols) {
  var newItem = _extends({}, item);

  if (finishedLayout.length === 0) {
    return newItem;
  }

  var FirstCollison = getFirstCollison(finishedLayout, newItem);

  if (FirstCollison) {
    newItem.gridx++;

    if (newItem.gridx + item.width > cols) {
      newItem.gridx = 0;
      newItem.gridy++;
    }

    return getSpaceArea(finishedLayout, newItem, cols);
  } else {
    return newItem;
  }
};

var compactLayoutHorizontal = function compactLayoutHorizontal(layout, cols, movingCardID) {
  var sorted = sortLayout(layout);
  var compareList = [];
  var needCompact = Array(layout.length);
  var arr = [];
  var moveCard;

  for (var i = 0; i < sorted.length; i++) {
    if (movingCardID === sorted[i].id) {
      moveCard = sorted[i];
      continue;
    }

    arr.push(sorted[i]);
  }

  if (moveCard) {
    moveCard.gridy = Math.min(layoutBottom(arr), moveCard.gridy);
  }

  for (var _i = 0; _i < sorted.length; _i++) {
    if (movingCardID !== sorted[_i].id) {
      sorted[_i].gridy = 0;
      sorted[_i].gridx = 0;
    }
  }

  for (var _i2 = 0, length = sorted.length; _i2 < length; _i2++) {
    var finished = getSpaceArea(compareList, sorted[_i2], cols);
    compareList.push(finished);
    needCompact[_i2] = finished;
  }

  return needCompact;
};

var noteSource = {
  beginDrag: function beginDrag(props, monitor, component) {
    var dragCard = props.card;
    dragCard.isShadow = true;
    props.updateShadowCard(dragCard);
    return {
      id: props.id,
      type: props.type
    };
  },
  endDrag: function endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      var groups = props.groups;
      groups = _.cloneDeep(groups);
      utils.setPropertyValueForCards(groups, 'isShadow', false);
      props.updateShadowCard({});
      props.updateGroupList(groups);
    }
  }
};

var Item = /*#__PURE__*/function (_Component) {
  _inheritsLoose(Item, _Component);

  function Item() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = Item.prototype;

  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
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
  };

  _proto.componentDidMount = function componentDidMount() {
    this.props.connectDragPreview(HTML5Backend.getEmptyImage(), {
      captureDraggingState: true
    });
  };

  _proto.render = function render() {
    var _this$props = this.props,
        connectDragSource = _this$props.connectDragSource,
        gridx = _this$props.gridx,
        gridy = _this$props.gridy,
        width = _this$props.width,
        height = _this$props.height,
        isShadow = _this$props.isShadow,
        id = _this$props.id;
    var _this$props$layout = this.props.layout,
        margin = _this$props$layout.margin,
        rowHeight = _this$props$layout.rowHeight,
        calWidth = _this$props$layout.calWidth;

    var _utils$calGridItemPos = utils.calGridItemPosition(gridx, gridy, margin, rowHeight, calWidth),
        x = _utils$calGridItemPos.x,
        y = _utils$calGridItemPos.y;

    var _utils$calWHtoPx = utils.calWHtoPx(width, height, margin, rowHeight, calWidth),
        wPx = _utils$calWHtoPx.wPx,
        hPx = _utils$calWHtoPx.hPx;

    var cardDom;

    if (isShadow) {
      cardDom = /*#__PURE__*/React__default.createElement("div", {
        className: "card-shadow",
        style: {
          width: wPx,
          height: hPx,
          transform: "translate(" + x + "px, " + y + "px)"
        }
      });
    } else {
      cardDom = /*#__PURE__*/React__default.createElement("div", {
        className: "card",
        style: {
          width: wPx,
          height: hPx,
          opacity: 1,
          transform: "translate(" + x + "px, " + y + "px)"
        }
      }, id);
    }

    return connectDragSource(cardDom);
  };

  return Item;
}(React.Component);

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

var dragDropItem = reactDnd.DragSource('item', noteSource, collectSource)(Item);

var ReactDOM = require('react-dom');
var groupItemTarget = {
  hover: function hover(props, monitor, component) {
    var dragItem = monitor.getItem();

    if (dragItem.type === 'group') {
      var dragIndex = monitor.getItem().index;
      var hoverIndex = props.index;

      if (dragIndex === hoverIndex) {
        return;
      }

      var hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();
      var hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      var clientOffset = monitor.getClientOffset();
      var hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      props.moveGroupItem(dragIndex, hoverIndex);
      monitor.getItem().index = hoverIndex;
    } else if (dragItem.type === 'card') {
      var hoverItem = props;

      var _monitor$getClientOff = monitor.getClientOffset(),
          x = _monitor$getClientOff.x,
          y = _monitor$getClientOff.y;

      var groupItemBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();
      var groupItemX = groupItemBoundingRect.left;
      var groupItemY = groupItemBoundingRect.top;
      props.moveCardInGroupItem(dragItem, hoverItem, x - groupItemX, y - groupItemY);
    }
  },
  drop: function drop(props, monitor, component) {
    var dragItem = monitor.getItem();
    var dropItem = props;

    if (dragItem.type === 'card') {
      props.onCardDropInGroupItem(dragItem, dropItem);
    }
  }
};

var Demo = /*#__PURE__*/function (_Component) {
  _inheritsLoose(Demo, _Component);

  function Demo(props) {
    var _this;

    _this = _Component.call(this, props) || this;
    _this.state = {};
    return _this;
  }

  var _proto = Demo.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var clientWidth;
    var containerDom = document.querySelector('#card-container');

    if (containerDom) {
      clientWidth = containerDom.clientWidth;
    }

    if (this.props.layout.containerWidth !== clientWidth) {
      this.props.handleLoad();
    }
  };

  _proto.createCards = function createCards(cards, groupID, groups) {
    var _this2 = this;

    var itemDoms = [];

    _.forEach(cards, function (c, i) {
      itemDoms.push( /*#__PURE__*/React__default.createElement(dragDropItem, {
        dragCardID: -1,
        type: 'card',
        groups: groups,
        card: c,
        id: c.id,
        index: i,
        gridx: c.gridx,
        gridy: c.gridy,
        width: c.width,
        height: c.height,
        isShadow: c.isShadow,
        key: groupID + "_" + c.id,
        layout: _this2.props.layout,
        updateShadowCard: _this2.props.updateShadowCard,
        updateGroupList: _this2.props.updateGroupList
      }));
    });

    return itemDoms;
  };

  _proto.render = function render() {
    var _this$props = this.props,
        connectDropTarget = _this$props.connectDropTarget,
        isOver = _this$props.isOver,
        id = _this$props.id,
        cards = _this$props.cards,
        defaultLayout = _this$props.defaultLayout,
        layout = _this$props.layout,
        groups = _this$props.groups;
    var containerHeight = utils.getContainerMaxHeight(cards, layout.rowHeight, layout.margin);
    return connectDropTarget( /*#__PURE__*/React__default.createElement("div", {
      className: "rglb_group-item"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "group-item-container",
      style: {
        background: isOver ? 'rgb(204, 204, 204)' : 'rgba(79,86,98,.1)'
      }
    }, /*#__PURE__*/React__default.createElement("section", {
      id: "card-container",
      style: {
        height: containerHeight > defaultLayout.containerHeight ? containerHeight : defaultLayout.containerHeight
      }
    }, this.createCards(cards, id, groups)))));
  };

  return Demo;
}(React.Component);

function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

var Container = reactDnd.DropTarget('item', groupItemTarget, collectTarget)(Demo);

var CardListDragPreview = /*#__PURE__*/function (_Component) {
  _inheritsLoose(CardListDragPreview, _Component);

  function CardListDragPreview() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = CardListDragPreview.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        cardListLength = _this$props.cardListLength,
        cardId = _this$props.cardId;
    var divDom = [];

    for (var index = 0; index < cardListLength; index++) {
      if (index === cardListLength - 1) {
        var myIndex = index >= 3 ? 3 : index;
        divDom.push( /*#__PURE__*/React__default.createElement("div", {
          key: index,
          className: "layer-card",
          style: {
            left: myIndex * 5 + "px",
            top: myIndex * 5 + "px"
          }
        }, /*#__PURE__*/React__default.createElement("span", {
          className: "layer-card-span"
        }, cardId), /*#__PURE__*/React__default.createElement("img", {
          src: "https://reactjs.org/logo-180x180.png",
          alt: "logo",
          width: "107",
          height: "113"
        })));
      } else if (index < 3) {
        divDom.push( /*#__PURE__*/React__default.createElement("div", {
          key: index,
          className: "layer-card",
          style: {
            left: index * 5 + "px",
            top: index * 5 + "px"
          }
        }));
      }
    }

    return /*#__PURE__*/React__default.createElement("div", {
      className: "custom-layer-card-list"
    }, divDom);
  };

  return CardListDragPreview;
}(React.Component);

var CumDragLayer = /*#__PURE__*/function (_Component) {
  _inheritsLoose(CumDragLayer, _Component);

  function CumDragLayer() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;

    _this.getItemStyles = function () {
      var clientOffset = _this.props.clientOffset;

      if (!clientOffset) {
        return {
          display: 'none'
        };
      }

      var x = clientOffset.x,
          y = clientOffset.y;
      var transform = "translate(" + x + "px, " + y + "px)";
      return {
        transform: transform,
        WebkitTransform: transform
      };
    };

    return _this;
  }

  var _proto = CumDragLayer.prototype;

  _proto.renderItem = function renderItem(type, item) {
    switch (type) {
      case 'item':
        return /*#__PURE__*/React__default.createElement(CardListDragPreview, {
          cardListLength: 1,
          cardId: item.id
        });

      default:
        return null;
    }
  };

  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    var _this$props$item, _this$props$item2;

    if (((_this$props$item = this.props.item) === null || _this$props$item === void 0 ? void 0 : _this$props$item.type) === 'card' && this.props.isDragging !== nextProps.isDragging) {
      return true;
    }

    if (((_this$props$item2 = this.props.item) === null || _this$props$item2 === void 0 ? void 0 : _this$props$item2.type) === 'card' && this.props.currentOffset !== nextProps.currentOffset) {
      if (nextProps.currentOffset && Math.pow(Math.pow(this.props.clientOffset.x - nextProps.clientOffset.x, 2) + Math.pow(this.props.clientOffset.y - nextProps.clientOffset.y, 2), 0.5) > 1.5) {
        return true;
      }
    }

    return false;
  };

  _proto.render = function render() {
    var _this$props = this.props,
        item = _this$props.item,
        itemType = _this$props.itemType,
        isDragging = _this$props.isDragging;

    if (!isDragging || item.type !== 'card') {
      return null;
    }

    if (navigator.userAgent.indexOf('MSIE') > -1 || navigator.userAgent.indexOf('Trident') > -1 || navigator.userAgent.indexOf('Edge') > -1) {
      return null;
    }

    return /*#__PURE__*/React__default.createElement("div", {
      className: "rglb_custom-layer"
    }, /*#__PURE__*/React__default.createElement("div", {
      style: this.getItemStyles()
    }, this.renderItem(itemType, item)));
  };

  return CumDragLayer;
}(React.Component);

function collect(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    clientOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging()
  };
}

var CustomDragLayer = reactDnd.DragLayer(collect)(CumDragLayer);

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?
Symbol.for("react.suspense_list"):60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.block"):60121,w=b?Symbol.for("react.fundamental"):60117,x=b?Symbol.for("react.responder"):60118,y=b?Symbol.for("react.scope"):60119;
function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function A(a){return z(a)===m}var AsyncMode=l;var ConcurrentMode=m;var ContextConsumer=k;var ContextProvider=h;var Element=c;var ForwardRef=n;var Fragment=e;var Lazy=t;var Memo=r;var Portal=d;
var Profiler=g;var StrictMode=f;var Suspense=p;var isAsyncMode=function(a){return A(a)||z(a)===l};var isConcurrentMode=A;var isContextConsumer=function(a){return z(a)===k};var isContextProvider=function(a){return z(a)===h};var isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===c};var isForwardRef=function(a){return z(a)===n};var isFragment=function(a){return z(a)===e};var isLazy=function(a){return z(a)===t};
var isMemo=function(a){return z(a)===r};var isPortal=function(a){return z(a)===d};var isProfiler=function(a){return z(a)===g};var isStrictMode=function(a){return z(a)===f};var isSuspense=function(a){return z(a)===p};
var isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v)};var typeOf=z;

var reactIs_production_min = {
	AsyncMode: AsyncMode,
	ConcurrentMode: ConcurrentMode,
	ContextConsumer: ContextConsumer,
	ContextProvider: ContextProvider,
	Element: Element,
	ForwardRef: ForwardRef,
	Fragment: Fragment,
	Lazy: Lazy,
	Memo: Memo,
	Portal: Portal,
	Profiler: Profiler,
	StrictMode: StrictMode,
	Suspense: Suspense,
	isAsyncMode: isAsyncMode,
	isConcurrentMode: isConcurrentMode,
	isContextConsumer: isContextConsumer,
	isContextProvider: isContextProvider,
	isElement: isElement,
	isForwardRef: isForwardRef,
	isFragment: isFragment,
	isLazy: isLazy,
	isMemo: isMemo,
	isPortal: isPortal,
	isProfiler: isProfiler,
	isStrictMode: isStrictMode,
	isSuspense: isSuspense,
	isValidElementType: isValidElementType,
	typeOf: typeOf
};

var reactIs_development = createCommonjsModule(function (module, exports) {



if (process.env.NODE_ENV !== "production") {
  (function() {

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}
});

var reactIs = createCommonjsModule(function (module) {

if (process.env.NODE_ENV === 'production') {
  module.exports = reactIs_production_min;
} else {
  module.exports = reactIs_development;
}
});

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

var printWarning = function() {};

if (process.env.NODE_ENV !== 'production') {
  var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
  var loggedTypeFailures = {};
  var has = Function.call.bind(Object.prototype.hasOwnProperty);

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (process.env.NODE_ENV !== 'production') {
    loggedTypeFailures = {};
  }
};

var checkPropTypes_1 = checkPropTypes;

var has$1 = Function.call.bind(Object.prototype.hasOwnProperty);
var printWarning$1 = function() {};

if (process.env.NODE_ENV !== 'production') {
  printWarning$1 = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret_1) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning$1(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!reactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (process.env.NODE_ENV !== 'production') {
        if (arguments.length > 1) {
          printWarning$1(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning$1('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has$1(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? printWarning$1('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning$1(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = objectAssign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes_1;
  ReactPropTypes.resetWarningCache = checkPropTypes_1.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  }  shim.isRequired = shim;
  function getShim() {
    return shim;
  }  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var ReactIs = reactIs;

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = factoryWithTypeCheckers(ReactIs.isElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = factoryWithThrowingShims();
}
});

var resizeWaiter = false;

var MyContent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(MyContent, _Component);

  function MyContent(props) {
    var _this;

    _this = _Component.call(this, props) || this;

    _this.handleLoad = function () {
      if (!resizeWaiter) {
        resizeWaiter = true;
        setTimeout(function () {
          console.info('resize!');
          resizeWaiter = false;
          var clientWidth;
          var containerDom = document.querySelector('#card-container');

          if (containerDom) {
            clientWidth = containerDom.clientWidth;
          } else {
            var firstAddButton = document.querySelector('#first-add');

            if (firstAddButton) {
              clientWidth = firstAddButton.clientWidth - 10;
            } else {
              return;
            }
          }

          var defaultCalWidth = _this.state.defaultLayout.calWidth;
          var _this$state$layout = _this.state.layout,
              containerPadding = _this$state$layout.containerPadding,
              margin = _this$state$layout.margin;

          var layout = _.cloneDeep(_this.state.layout);

          var windowWidth = window.innerWidth - 60 * 2;
          var col = utils.calColCount(defaultCalWidth, windowWidth, containerPadding, margin);
          var calWidth = utils.calColWidth(clientWidth, col, containerPadding, margin);
          var groups = _this.state.groups;
          groups = _.cloneDeep(groups);

          _.forEach(groups, function (g) {
            var compactedLayout = compactLayoutHorizontal(g.cards, col);
            g.cards = compactedLayout;
          });

          layout.calWidth = layout.rowHeight = calWidth;
          layout.col = col;
          layout.containerWidth = clientWidth;

          _this.updateGroupList(groups);

          _this.updateLayout(layout);
        }, 500);
      }
    };

    _this.moveCardInGroupItem = function (dragItem, hoverItem, x, y) {
      var groups = _this.state.groups;
      var shadowCard = _this.state.shadowCard;
      var _this$state$layout2 = _this.state.layout,
          margin = _this$state$layout2.margin,
          containerWidth = _this$state$layout2.containerWidth,
          col = _this$state$layout2.col,
          rowHeight = _this$state$layout2.rowHeight;

      var _utils$calGridXY = utils.calGridXY(x, y, shadowCard.width, margin, containerWidth, col, rowHeight),
          gridX = _utils$calGridXY.gridX,
          gridY = _utils$calGridXY.gridY;

      if (gridX === shadowCard.gridx && gridY === shadowCard.gridy) {
        return;
      }

      var groupIndex = hoverItem.index;

      _.forEach(groups, function (g, index) {
        _.remove(g.cards, function (a) {
          return a.isShadow === true;
        });
      });

      shadowCard = _extends({}, shadowCard, {
        gridx: gridX,
        gridy: gridY
      });
      groups[groupIndex].cards.push(shadowCard);
      var newlayout = layoutCheck(groups[groupIndex].cards, shadowCard, shadowCard.id, shadowCard.id, _this.props.compactType);
      var compactedLayout;

      if (_this.props.compactType === 'horizontal') {
        compactedLayout = compactLayoutHorizontal(newlayout, _this.state.layout.col, shadowCard.id);
      } else if (_this.props.compactType === 'vertical') {
        compactedLayout = compactLayout(newlayout);
      }

      groups[groupIndex].cards = compactedLayout;

      _this.updateShadowCard(shadowCard);

      _this.updateGroupList(groups);
    };

    _this.onCardDropInGroupItem = function (dragItem, dropItem) {
      var groups = _this.state.groups;
      groups = _.cloneDeep(groups);
      utils.setPropertyValueForCards(groups, 'isShadow', false);

      _.forEach(groups, function (g, i) {
        if (_this.props.compactType === 'horizontal') {
          var compactedLayout = compactLayoutHorizontal(groups[i].cards, _this.state.layout.col);
          g.cards = compactedLayout;
        } else if (_this.props.compactType === 'vertical') {
          var _compactedLayout = compactLayout(groups[i].cards);

          g.cards = _compactedLayout;
        }
      });

      _this.updateGroupList(groups);

      _this.updateShadowCard({});
    };

    _this.updateGroupList = function (groups) {
      _this.setState({
        groups: groups
      });
    };

    _this.updateShadowCard = function (shadowCard) {
      _this.setState({
        shadowCard: shadowCard
      });
    };

    _this.updateLayout = function (layout) {
      _this.setState({
        layout: layout
      });

      _this.props.onLayoutChange(layout);
    };

    _this.state = {
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
    return _this;
  }

  var _proto = MyContent.prototype;

  _proto.componentWillUnmount = function componentWillUnmount() {
    window.removeEventListener('resize', this.handleLoad);
  };

  _proto.componentDidMount = function componentDidMount() {
    window.addEventListener('resize', this.handleLoad);
  };

  _proto.initGroupItem = function initGroupItem(groups) {
    var _this2 = this;

    console.log(groups, 'groups');
    var itemDoms = [];
    itemDoms = groups.map(function (g, i) {
      return /*#__PURE__*/React__default.createElement(Container, {
        key: g.id,
        id: g.id,
        type: g.type,
        index: i,
        cards: g.cards,
        length: groups.length,
        groups: groups,
        moveCardInGroupItem: _this2.moveCardInGroupItem,
        onDrop: _this2.onDrop,
        onCardDropInGroupItem: _this2.onCardDropInGroupItem,
        layout: _this2.state.layout,
        defaultLayout: _this2.state.defaultLayout,
        updateShadowCard: _this2.updateShadowCard,
        updateGroupList: _this2.updateGroupList,
        handleLoad: _this2.handleLoad
      });
    });
    return itemDoms;
  };

  _proto.render = function render() {
    var groups = this.state.groups;
    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(CustomDragLayer, null), this.initGroupItem(groups));
  };

  return MyContent;
}(React.Component);

MyContent.defaultProps = {
  compactType: 'vertical',
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
};
MyContent.propTypes = {
  compactType: propTypes.string,
  layout: propTypes.object,
  onLayoutChange: propTypes.func
};
var layout = reactDnd.DragDropContext(HTML5Backend__default)(MyContent);

module.exports = layout;
//# sourceMappingURL=index.js.map
