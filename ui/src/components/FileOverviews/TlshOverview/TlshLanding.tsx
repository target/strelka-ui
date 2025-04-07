import { CollapseCard } from '../../CollapseCard'
import type { OverviewLandingProps } from '../types'
import TlshOverviewCard from './TlshOverviewCard'

const getTlshRating = (score) => {
  if (score <= 30) return { label: 'Very Similar', color: 'red' }
  if (score <= 60) return { label: 'Somewhat Similar', color: 'volcano' }
  if (score <= 120) return { label: 'Moderately Different', color: 'orange' }
  if (score <= 180) return { label: 'Quite Different', color: 'gold' }
  return { label: 'Very Different', color: 'green' }
}

const FileTlshLanding = (props: OverviewLandingProps) => {
  const { selectedNodeData, expanded, onExpandChange } = props
  const tlshData = selectedNodeData?.scan?.tlsh?.match
  if (!tlshData) {
    return null
  }

  const tags = [getTlshRating(tlshData.score)]

  return (
    <CollapseCard
      onExpandChange={onExpandChange}
      label="TLSH Related Match"
      tags={tags}
      expanded={expanded}
    >
      <TlshOverviewCard data={selectedNodeData} />
    </CollapseCard>
  )
}

export default FileTlshLanding
