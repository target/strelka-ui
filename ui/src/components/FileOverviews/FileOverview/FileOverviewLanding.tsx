import { CollapseCard } from '../../CollapseCard'
import type { OverviewLandingProps } from '../types'
import FileOverviewCard from './FileOverviewCard'

export interface FileOverviewLandingProps extends OverviewLandingProps {
  onOpenVT: (vt: string) => void
}

const FileOverviewLanding = (props: FileOverviewLandingProps) => {
  const { selectedNodeData, expanded, onExpandChange, onOpenVT } = props

  if (!selectedNodeData) {
    return null
  }

  const label = 'File Overview'
  const description = `Size: ${(selectedNodeData.file.size / 1024).toFixed(2)} KB (${selectedNodeData.file.size} bytes)`

  return (
    <CollapseCard
      onExpandChange={onExpandChange}
      label={label}
      description={description}
      expanded={expanded}
    >
      <FileOverviewCard data={selectedNodeData} onOpenVT={onOpenVT} />
    </CollapseCard>
  )
}

export default FileOverviewLanding
