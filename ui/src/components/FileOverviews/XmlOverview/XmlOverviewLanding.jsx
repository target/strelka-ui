import React from 'react'
import XmlOverviewCard from './XmlOverviewCard'
import { CollapseCard } from '../../CollapseCard'

const XmlOverviewLanding = ({ selectedNodeData, expanded, onExpandChange }) => {
  if (!selectedNodeData?.scan?.xml) {
    return null
  }

  const xmlData = selectedNodeData.scan.xml
  const emittedContentCount = xmlData?.emitted_content?.length || 0

  const label = 'XML'
  const description = `Emitted Content Count: ${emittedContentCount}`

  return (
    <CollapseCard
      onExpandChange={onExpandChange}
      label={label}
      description={description}
      expanded={expanded}
    >
      <XmlOverviewCard xmlData={xmlData} />
    </CollapseCard>
  )
}

export default XmlOverviewLanding
