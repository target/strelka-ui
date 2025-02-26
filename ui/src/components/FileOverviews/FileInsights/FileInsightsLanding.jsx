import React from 'react'
import InsightsCard from './FileInsightsOverviewCard'
import { CollapseCard } from '../../CollapseCard'

const InsightsLanding = ({ selectedNodeData, expanded, onExpandChange }) => {
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
