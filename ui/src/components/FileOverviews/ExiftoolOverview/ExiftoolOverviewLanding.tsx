import { CollapseCard } from '../../CollapseCard'
import type { OverviewLandingProps } from '../types'
import FileExiftoolCard from './ExiftoolOverviewCard'

const ExiftoolOverviewLanding = (props: OverviewLandingProps) => {
  const { selectedNodeData, expanded, onExpandChange } = props
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
