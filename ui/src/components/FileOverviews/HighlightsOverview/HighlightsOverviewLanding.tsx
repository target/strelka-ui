import { Collapse, Tag, Typography, theme } from 'antd'
import { useState } from 'react'
import type { ScanData } from '../types'
import HighlightsOverviewCard from './HighlightsOverviewCard.tsx'
const { Text } = Typography

interface HighlightsOverviewLandingProps extends ScanData {
  onFileNameSelect: (fileName: string) => void
}

const HighlightsOverviewLanding = (props: HighlightsOverviewLandingProps) => {
  const { data, onFileNameSelect } = props
  const { useToken } = theme
  const tokenData = useToken()
  const BLUE = tokenData.token.blue

  const [filterApplied, setFilterApplied] = useState(false)

  const handleFileNameSelect = (selectedFileName) => {
    setFilterApplied(!!selectedFileName)
    onFileNameSelect(selectedFileName)
  }

  const borderStyle = filterApplied
    ? {
        // Styles when the filter is applied
        border: `2px solid ${BLUE}`,
        padding: '3px',
        transition: 'all 0.3s', // Transition for both applying and removing the filter
      }
    : {
        // Styles when the filter is not applied (could potentially add styles for the normal state if needed)
        transition: 'all 0.3s',
      }

  return (
    <Collapse
      defaultActiveKey={['1']}
      style={{
        width: '100%',
        marginBottom: '10px',
        ...borderStyle,
      }}
      items={[
        {
          key: '1',
          label: (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text>File Highlights</Text>
              {filterApplied && <Tag color="blue">Filter Applied</Tag>}
            </div>
          ),
          children: (
            <HighlightsOverviewCard
              data={data}
              onFileNameSelect={handleFileNameSelect}
            />
          ),
        },
      ]}
    />
  )
}

export default HighlightsOverviewLanding
