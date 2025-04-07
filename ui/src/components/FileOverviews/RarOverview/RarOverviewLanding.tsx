import { CollapseCard } from '../../CollapseCard'
import type { OverviewLandingProps } from '../types'
import RarOverviewCard from './RarOverviewCard'

const RarOverviewLanding = (props: OverviewLandingProps) => {
  const { selectedNodeData, expanded, onExpandChange } = props
  if (!selectedNodeData?.scan?.rar) {
    return null
  }

  const rarData = selectedNodeData.scan.rar
  const fileCount = rarData.total.files || 0
  const extractedCount = rarData.total.extracted || 0
  const notExtracted = fileCount > 0 && extractedCount === 0

  let extractionStatus = 'Extracted Files'
  if (notExtracted) {
    extractionStatus = 'Could Not Extract Files'
  }

  const label = 'RAR Details'
  const description = `Total Files: ${fileCount}`

  const tags = [
    { label: extractionStatus, color: notExtracted ? 'red' : 'green' },
  ]

  return (
    <CollapseCard
      onExpandChange={onExpandChange}
      label={label}
      description={description}
      tags={tags}
      expanded={expanded}
    >
      <RarOverviewCard data={selectedNodeData} />
    </CollapseCard>
  )
}

export default RarOverviewLanding
