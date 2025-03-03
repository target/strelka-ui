import React from 'react'
import QrOverviewCard from './QrOverviewCard'
import { CollapseCard } from '../../CollapseCard'

const QrOverviewLanding = ({ selectedNodeData, expanded, onExpandChange }) => {
  if (!selectedNodeData?.scan?.qr?.data) {
    return null
  }

  const qrData = selectedNodeData.scan.qr.data
  const qrDataCount = qrData.length

  return (
    <CollapseCard
      onExpandChange={onExpandChange}
      label="QR Code Data"
      description={`QR Data Count: ${qrDataCount}`}
      expanded={expanded}
    >
      <QrOverviewCard data={selectedNodeData} />
    </CollapseCard>
  )
}

export default QrOverviewLanding
