import React from 'react'
import SevenZipOverviewCard from './SevenZipOverviewCard'
import { CollapseCard } from '../../CollapseCard'

const SevenZipOverviewLanding = ({
  selectedNodeData,
  expanded,
  onExpandChange,
}) => {
  if (!selectedNodeData?.scan?.seven_zip) {
    return null
  }

  const sevenZipData = selectedNodeData.scan.seven_zip
  const fileCount = sevenZipData.total.files || 0
  const wasExtracted = Boolean(sevenZipData.total.extracted || 0)

  let extractionStatus = 'Could Not Extract Files'
  if (wasExtracted) {
    extractionStatus = 'Extracted Files'
  }

  const label = '7-Zip Overview'
  const description = `Total Files: ${fileCount}`
  const tags = [
    {
      label: wasExtracted ? 'Extracted' : 'Not Extracted',
      color: wasExtracted ? 'success' : 'error',
    },
  ]

  return (
    <CollapseCard
      onExpandChange={onExpandChange}
      label={label}
      description={description}
      tags={tags}
      expanded={expanded}
    >
      <SevenZipOverviewCard data={selectedNodeData} />
    </CollapseCard>
  )
}

export default SevenZipOverviewLanding
