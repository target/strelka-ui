import { CollapseCard } from '../../CollapseCard'
import type { OverviewLandingProps } from '../types'
import JsonViewCard from './JsonViewCard'

const JsonViewLanding = (props: OverviewLandingProps) => {
  const { selectedNodeData, expanded, onExpandChange } = props
  return (
    <CollapseCard
      onExpandChange={onExpandChange}
      label="JSON View"
      description="Raw Strelka data, including scanners not yet available in Card view."
      expanded={expanded}
    >
      <JsonViewCard data={selectedNodeData} />
    </CollapseCard>
  )
}

export default JsonViewLanding
