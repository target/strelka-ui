import { Layout, Typography } from 'antd'
import styled from 'styled-components'

import type { ReactNode } from 'react'

const { Title, Text } = Typography
const { Content } = Layout

const PageContainer = styled.div`
  margin-left: 40px;
  margin-right: 40px;
  margin-bottom: 20px;
  text-align: left;
`

const StyledContent = styled(Content)`
  min-height: calc(100vh - 134px);
`

interface PageWrapperProps {
  children?: ReactNode
  title?: string
  subtitle?: string
}

const PageWrapper = ({ children, title, subtitle }: PageWrapperProps) => {
  return (
    <PageContainer>
      <Typography>
        <Title level={1}>{title}</Title>
        {subtitle && <Text type="secondary">{subtitle}</Text>}
      </Typography>
      <StyledContent>{children}</StyledContent>
    </PageContainer>
  )
}

export default PageWrapper
