import { Col, Row } from 'antd'
import type { ScanData } from '../types'
// FileOverviews/FileHeaderOverview/FileHeaderOverviewLanding.js
import HeaderOverviewCard from './HeaderOverviewCard'

interface HeaderLandingProps extends ScanData {
  onOpenVT: (vtId: string) => void
}

const HeaderLanding = (props: HeaderLandingProps) => {
  const { data, onOpenVT } = props
  return (
    <Row gutter={{ xs: 32, sm: 32, md: 32, lg: 32 }}>
      <Col xs={24} sm={24} md={24} lg={24} style={{ paddingRight: '0px' }}>
        <HeaderOverviewCard data={data} onOpenVT={onOpenVT} />
      </Col>
    </Row>
  )
}

export default HeaderLanding
