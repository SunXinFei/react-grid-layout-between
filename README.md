# react-grid-layout-between

> A draggable and resizable grid layout with responsive breakpoints , can between two or more Layouts, for React. Based on [React-DnD](https://github.com/react-dnd/react-dnd).

![react 16.8.6](https://img.shields.io/badge/react-%5E16.8.6-brightgreen.svg)
![npm 6.9.0](https://img.shields.io/badge/npm-v6.9.0-blue.svg)
![react-dnd](https://img.shields.io/badge/reactDnD-%5E2.6.0-7289da.svg)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![picgif](https://user-images.githubusercontent.com/5847281/90307968-0387f780-df0e-11ea-9a19-8d6192ccbe67.gif)

Live Demo : http://demo.sunxinfei.com/

## Install

```bash
npm install --save react-grid-layout-between
```

## Usage

```jsx
import React, { Component } from 'react'

import GridLayout from 'react-grid-layout-between'
import 'react-grid-layout-between/dist/index.css'

class Example extends Component {
  render() {
    return <GridLayout />
  }
}
```

Features:
- [x] get `<reac-grid-layout-between />` component

- [x] DnD widgets between layouts

- [x] 100% React

- [x] Draggable widgets

- [x] Configurable packing: horizontal, vertical

- [x] Bounds checking for dragging

- [x] Responsive breakpoints

- [x] Separate layouts per responsive breakpoint

- [x] Grid Items placed using CSS Transforms

- [x] Drag Custom Preview

- [ ] Drag widgets colliseion by gravity center

- [ ] Static widgets

- [ ] Resizable widgets

- [ ] Support touchable device [Issue](https://github.com/SunXinFei/react-grid-layout-between/issues/9)

bugs:
- [x] ~~when 2x2 or 1x2 collosion bug for horizontal~~

## License

MIT © [SunXinFei](https://github.com/SunXinFei)
