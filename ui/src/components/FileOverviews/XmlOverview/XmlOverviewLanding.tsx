import { CollapseCard } from '../../CollapseCard'
import type { OverviewLandingProps } from '../types'
import XmlOverviewCard from './XmlOverviewCard'

const XmlOverviewLanding = (props: OverviewLandingProps) => {
  const { selectedNodeData, expanded, onExpandChange } = props

  if (!selectedNodeData?.scan?.xml) {
    return null
  }

  const emittedContentCount =
    selectedNodeData.scan.xml?.emitted_content?.length || 0

  const label = 'XML'
  const description = `Emitted Content Count: ${emittedContentCount}`

  return (
    <CollapseCard
      onExpandChange={onExpandChange}
      label={label}
      description={description}
      expanded={expanded}
    >
      <XmlOverviewCard data={selectedNodeData} />
    </CollapseCard>
  )
}

export default XmlOverviewLanding
