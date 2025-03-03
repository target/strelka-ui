import React from 'react'
import EncryptedZipOverviewCard from './EncryptedZipOverviewCard'
import { CollapseCard } from '../../CollapseCard'

const EncryptedZipOverviewLanding = ({
  selectedNodeData,
  expanded,
  onExpandChange,
}) => {
  if (!selectedNodeData?.scan?.encrypted_zip) {
    return null
  }

  const encryptedZipData = selectedNodeData.scan.encrypted_zip
  const fileCount = encryptedZipData.total.files || 0
  const extractedCount = encryptedZipData.total.extracted || 0

  const notExtracted = fileCount > 0 && extractedCount === 0

  const label = 'Encrypted Zip Details'
  const description = `Total Files: ${fileCount}`
  const tags = [
    {
      label: notExtracted ? 'Could Not Extract Files' : 'Extracted Files',
      color: notExtracted ? 'red' : 'green',
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
      <EncryptedZipOverviewCard data={selectedNodeData} />
    </CollapseCard>
  )
}

export default EncryptedZipOverviewLanding
