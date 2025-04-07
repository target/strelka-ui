import { CollapseCard } from '../../CollapseCard'
import type { OverviewLandingProps } from '../types'
import ZipOverviewCard from './ZipOverviewCard'

const ZipOverviewLanding = (props: OverviewLandingProps) => {
  const { selectedNodeData, expanded, onExpandChange } = props
  if (!selectedNodeData?.scan?.zip) {
    return null
  }

  const zipData = selectedNodeData.scan.zip
  const fileCount = zipData.total.files || 0
  const extractedCount = zipData.total.extracted || 0

  const notExtracted = fileCount > 0 && extractedCount === 0

  let extractionStatus = 'Extracted Files'
  if (notExtracted) {
    extractionStatus = 'Could Not Extract Files'
  }

  const label = 'Zip Details'
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
      <ZipOverviewCard data={selectedNodeData} />
    </CollapseCard>
  )
}

export default ZipOverviewLanding
