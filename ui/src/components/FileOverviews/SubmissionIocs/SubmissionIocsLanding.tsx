import { CollapseCard } from '../../CollapseCard'
import type { OverviewLandingProps } from '../types'
import IocOverviewCard from './SubmissionIocOverviewCard'

const SubmissionIocsLanding = (props: OverviewLandingProps) => {
  const { selectedNodeData, expanded, onExpandChange } = props
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

export default SubmissionIocsLanding
