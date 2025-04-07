import { CollapseCard } from '../../CollapseCard'
import type { OverviewLandingProps } from '../types'
import YaraOverviewCard from './YaraOverviewCard'

const YaraOverviewLanding = (props: OverviewLandingProps) => {
  const { selectedNodeData, expanded, onExpandChange } = props
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
