import type { Scan, StrelkaResponse } from '../../services/api.types'

export interface OverviewLandingProps {
  expanded: boolean
  onExpandChange: (expanded: boolean) => void
  selectedNodeData: StrelkaResponse
}

export interface OverviewCardProps {
  data: StrelkaResponse
}

export interface ScanData {
  data: Scan
}

export interface FileIocsOverviewProps extends ScanData {
  onFileIocSelect: (ioc: string) => void
}
