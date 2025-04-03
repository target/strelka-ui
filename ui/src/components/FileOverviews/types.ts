import type { Scan, StrelkaResponse } from '../../services/api.types'

export interface OverviewLandingProps {
  selectedNodeData: StrelkaResponse
  expanded: boolean
  onExpandChange: (expanded: boolean) => void
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
