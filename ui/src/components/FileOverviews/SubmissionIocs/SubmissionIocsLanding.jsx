import React from 'react'
import IocOverviewCard from './SubmissionIocOverviewCard'
import { CollapseCard } from '../../CollapseCard'

const FilePotentialIocsOverview = ({
  selectedNodeData,
  expanded,
  onExpandChange,
}) => {
  const iocs = selectedNodeData?.iocs

  if (!iocs || iocs.length === 0) {
    return null
  }

  const firstIoc = iocs[0]?.ioc || 'N/A'
  const iocsCount = iocs.length
  const additionalIocs = iocsCount > 1 ? ` and ${iocsCount - 1} more` : ''

  const label = 'Indicators of Compromise (IOCs)'
  const description = `${firstIoc}${additionalIocs}`

  const tags = [
    { label: `${iocsCount} Potential IOCs Extracted`, color: 'purple' },
  ]

  return (
    <CollapseCard
      onExpandChange={onExpandChange}
      label={label}
      description={description}
      tags={tags}
      expanded={expanded}
    >
      <IocOverviewCard data={selectedNodeData} />
    </CollapseCard>
  )
}

export default FilePotentialIocsOverview
