import React, { useState } from 'react'

import GridLayout from 'react-grid-layout-between'
import 'react-grid-layout-between/dist/index.css'
import mockData from './mock'

const App = () => {
  const [compactType, setCompactType] = useState('horizontal');
  const [layout] = useState({
    containerWidth: 1200,
    containerHeight: 300,
    calWidth: 175,
    rowHeight: 175,
    col: 6,
    margin: [10, 10],
    containerPadding: [0, 0]
  });
  const [col, setCol] = useState(layout.col);

  const changeCompactType = () => {
    setCompactType(compactType === "horizontal"
      ? "vertical"
      : "horizontal")
  }

  const onLayoutChange = (layout) =>{
    setCol(layout.col)
  }
  return (
    <div>
      <div style={{margin: '10px'}}>
        <a target="_blank" href="https://github.com/SunXinFei/react-grid-layout-between">View project on GitHub</a>
      </div>
      <div style={{ margin: '10px 10px 0' }}>Current Breakpoint: {col} columns </div>
      <button style={{ height: '30px', margin: '10px' }} onClick={changeCompactType}>Change Compaction Type: <b>{compactType}</b></button>
      <GridLayout groups={mockData} compactType={compactType} layout={layout} onLayoutChange={onLayoutChange} />
    </div>
  )
}

export default App
