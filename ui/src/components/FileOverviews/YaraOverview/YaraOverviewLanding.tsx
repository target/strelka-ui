import { Collapse, Tag, Typography } from 'antd'
import { useState } from 'react'
import { antdColors } from '../../../utils/colors'
import type { ScanData } from '../types'
import YaraTypeOverviewCard from './YaraTypeOverviewCard'

const { Text } = Typography

interface YaraOverviewLandingProps extends ScanData {
  onFileYaraSelect: (fileYara: string | null) => void
}

const YaraOverviewLanding = (props: YaraOverviewLandingProps) => {
  const { data, onFileYaraSelect } = props
  const [filterApplied, setFilterApplied] = useState(false)

  const handleYaraSelect = (selectedYara) => {
    setFilterApplied(!!selectedYara)
    onFileYaraSelect(selectedYara)
  }

  const borderStyle = filterApplied
    ? {
        // Styles when the filter is applied
        border: `2px solid ${antdColors.purple}50`,
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
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
              <Text>File YARA Matches</Text>
              {filterApplied && (
                <Tag
                  style={{ color: `${antdColors.purple}99`, fontWeight: 700 }}
                >
                  Filter Applied
                </Tag>
              )}
            </div>
          ),
          children: (
            <YaraTypeOverviewCard
              data={data}
              onFileYaraSelect={handleYaraSelect}
            />
          ),
        },
      ]}
    />
  )
}

export default YaraOverviewLanding
