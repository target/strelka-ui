import { Collapse, Tag, Typography } from 'antd'
import { useState } from 'react'
import { antdColors } from '../../../utils/colors'
import type { FileIocsOverviewProps } from '../types'
import FileIocsOverviewCard from './FileIocsOverviewCard'

const { Text } = Typography

const FileIocsOverviewLanding = (props: FileIocsOverviewProps) => {
  const { data, onFileIocSelect } = props
  const [filterApplied, setFilterApplied] = useState(false)

  const handleIocSelect = (selectedIoc) => {
    setFilterApplied(!!selectedIoc)
    onFileIocSelect(selectedIoc)
  }

  const borderStyle = filterApplied
    ? {
        // Styles when the filter is applied
        border: `2px solid ${antdColors.blue}50`,
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
      defaultActiveKey={[1]}
      style={{
        width: '100%',
        marginBottom: '10px',
        ...borderStyle,
      }}
      items={[
        {
          key: 1,
          label: (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text>Potential IOCs</Text>
              {filterApplied && <Tag color="blue">Filter Applied</Tag>}
            </div>
          ),
          children: (
            <FileIocsOverviewCard
              data={data}
              onFileIocSelect={handleIocSelect}
            />
          ),
        },
      ]}
    />
  )
}

export default FileIocsOverviewLanding
