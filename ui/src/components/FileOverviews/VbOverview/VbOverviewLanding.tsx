import { CollapseCard } from '../../CollapseCard'
import type { OverviewLandingProps } from '../types'
import VbOverviewCard from './VbOverviewCard'

const VbOverviewLanding = (props: OverviewLandingProps) => {
  const { selectedNodeData, expanded, onExpandChange } = props

  if (
    !selectedNodeData ||
    !selectedNodeData.scan ||
    !selectedNodeData.scan.vb
  ) {
    return null
  }

  const vbData = selectedNodeData.scan.vb
  const scriptLength = vbData.script_length_bytes || 0

  const tags = [
    {
      label: `Script Length: ${scriptLength} bytes`,
      color: 'blue',
    },
  ]

  return (
    <CollapseCard
      onExpandChange={onExpandChange}
      label="Visual Basic"
      tags={tags}
      expanded={expanded}
    >
      <VbOverviewCard data={selectedNodeData} />
    </CollapseCard>
  )
}

export default VbOverviewLanding
