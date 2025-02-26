import React from 'react'
import PeOverviewCard from './PeOverviewCard'
import { CollapseCard } from '../../CollapseCard'

const PeOverviewLanding = ({ selectedNodeData, expanded, onExpandChange }) => {
  if (!selectedNodeData?.scan?.pe) {
    return null
  }

  const { file_info, compile_time, security } = selectedNodeData.scan.pe
  const productName = file_info?.product_name
  const signedLabel = security ? 'Signed' : 'Not Signed'

  const label = 'Executable Information'
  const description = [`Product: ${productName}`, `Compiled: ${compile_time}`]
  const tags = [
    {
      label: signedLabel,
      color: security ? 'success' : 'error',
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
      <PeOverviewCard data={selectedNodeData} />
    </CollapseCard>
  )
}

export default PeOverviewLanding
