import React from 'react'
import YaraOverviewCard from './YaraOverviewCard'
import { CollapseCard } from '../../CollapseCard'

const YaraOverviewLanding = ({
  selectedNodeData,
  expanded,
  onExpandChange,
}) => {
  const yaraMatches = selectedNodeData?.scan?.yara?.matches || []

  const label = 'YARA Signatures'

  const tags = [
    {
      label: `Matches: ${yaraMatches.length}`,
    },
  ]

  return (
    <CollapseCard
      onExpandChange={onExpandChange}
      label={label}
      tags={tags}
      expanded={expanded}
    >
      {yaraMatches.length > 0 ? (
        <YaraOverviewCard data={selectedNodeData} />
      ) : (
        'No YARA Matches'
      )}
    </CollapseCard>
  )
}

export default YaraOverviewLanding
