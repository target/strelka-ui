import React from 'react'
import FileExiftoolCard from './ExiftoolOverviewCard'
import { CollapseCard } from '../../CollapseCard'

const ExiftoolOverviewLanding = ({
  selectedNodeData,
  expanded,
  onExpandChange,
}) => {
  if (!selectedNodeData?.scan?.exiftool) {
    return null
  }

  const metadataCount = Object.keys(selectedNodeData.scan.exiftool).length

  const label = 'File Metadata'
  const description = `Metadata Count: ${metadataCount}`

  return (
    <CollapseCard
      onExpandChange={onExpandChange}
      label={label}
      description={description}
      expanded={expanded}
    >
      <FileExiftoolCard data={selectedNodeData} />
    </CollapseCard>
  )
}

export default ExiftoolOverviewLanding
