import { Panel } from '@xyflow/react'
import { Input } from 'antd'

interface NodeSearchPanelProps {
  onSearchChange: (searchValue: string) => void
}

const NodeSearchPanel = (props: NodeSearchPanelProps) => {
  const { onSearchChange } = props
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
