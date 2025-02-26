import React from 'react'
import JsonViewCard from './JsonViewCard'
import { CollapseCard } from '../../CollapseCard'

const JsonViewLanding = ({ selectedNodeData, expanded, onExpandChange }) => {
  return (
    <CollapseCard
      onExpandChange={onExpandChange}
      label="JSON View"
      description="Raw Strelka data, including scanners not yet available in Card view."
      expanded={expanded}
    >
      <JsonViewCard json={selectedNodeData} />
    </CollapseCard>
  )
}

export default JsonViewLanding
