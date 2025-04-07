import { ReactFlowProvider } from '@xyflow/react'
import FileTreeCard, { type FileTreeCardProps } from './FileTreeCard'

function FileTreeCardWithProvider(props: FileTreeCardProps) {
  return (
    <ReactFlowProvider>
      <FileTreeCard {...props} />
    </ReactFlowProvider>
  )
}

export default FileTreeCardWithProvider
