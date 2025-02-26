import FileOverviewCard from './FileOverviewCard'
import { CollapseCard } from '../../CollapseCard'

const FileOverviewLanding = ({
  selectedNodeData,
  onOpenVT,
  expanded,
  onExpandChange,
}) => {
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
