import { Input } from 'antd'
import React from 'react'
import { Panel } from '@xyflow/react'

const NodeSearchPanel = ({ onSearchChange }) => {
  return (
    <Panel position="top-left">
      <Input.Search
        placeholder="Filter by filename..."
        onChange={(event) => onSearchChange(event.target.value)}
        style={{ width: 200 }}
      />
    </Panel>
  )
}

export default NodeSearchPanel
