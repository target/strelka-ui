import { CollapseCard } from '../../CollapseCard'
import type { OverviewLandingProps } from '../types'
import QrOverviewCard from './QrOverviewCard'

const QrOverviewLanding = (props: OverviewLandingProps) => {
  const { selectedNodeData, expanded, onExpandChange } = props
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
