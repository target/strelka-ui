import { CollapseCard } from '../../CollapseCard'
import type { OverviewLandingProps } from '../types'
import InsightsCard from './FileInsightsOverviewCard'

const InsightsLanding = (props: OverviewLandingProps) => {
  const { selectedNodeData, expanded, onExpandChange } = props
  const insightsData = selectedNodeData?.insights || []

  const label = 'Insights'
  const tags = [{ label: `Matches: ${insightsData.length}` }]

  return (
    <CollapseCard
      onExpandChange={onExpandChange}
      label={label}
      expanded={expanded}
      tags={tags}
    >
      <InsightsCard data={insightsData} />
    </CollapseCard>
  )
}

export default InsightsLanding
