import { Space, Tag, Tooltip, Typography } from 'antd'
import { useState } from 'react'
import { antdColors } from '../../../utils/colors'
import { getIconConfig } from '../../../utils/iconMappingTable'
import type { FileIocsOverviewProps } from '../types'

const { Text } = Typography

/**
 * Displays an overview of IOC matches for files, categorized into IOC types.
 * @param {{ data: Object, onFileIocSelect: Function }} props
 */
const FileIocsOverviewCard = (props: FileIocsOverviewProps) => {
  const { data, onFileIocSelect } = props
  const [selectedIoc, setSelectedIoc] = useState(null)
  const [showMore, setShowMore] = useState(false) // State to control showing more IOCs

  interface IocCounts {
    [ioc: string]: {
      type: string
      count: number
      files: Set<string>
    }
  }

  // Initialize an object to store details for each unique IOC value
  const iocCounts: IocCounts = {}

  // Helper function descriptions
  /**
   * Handles selection of a IOC match.
   * @param {string} ioc The selected IOC match.
   */
  const selectIoc = (ioc) => {
    const newSelectedioc = ioc === selectedIoc ? null : ioc
    setSelectedIoc(newSelectedioc)
    onFileIocSelect(newSelectedioc)
  }

  // Mapping from IOC type to user-friendly label
  const iocTypeLabels = {
    domain: 'Domains',
    url: 'URLs',
    md5: 'MD5 Hashes',
    sha1: 'SHA-1 Hashes',
    sha256: 'SHA-256 Hashes',
    email: 'Email Addresses',
    ip: 'IP Addresses',
  }

  // Aggregate IOCs and their file counts from strelka_response
  for (const response of data.strelka_response) {
    const iocs = response?.iocs || []
    for (const ioc of iocs) {
      const iocValue = ioc.ioc
      if (!iocCounts[iocValue]) {
        // If this is the first time we've seen this IOC, initialize its details
        iocCounts[iocValue] = {
          type: ioc.ioc_type,
          count: 0,
          files: new Set(),
        }
      }
      // Increment the count and add the file to the set
      iocCounts[iocValue].count++
      iocCounts[iocValue].files.add(
        response.file.name || response.scan.hash.md5,
      )
    }
  }

  // Now transform the counts into an array suitable for rendering
  const iocData = Object.entries(iocCounts)
    .map(([value, details]) => ({
      value,
      type: details.type,
      count: details.count,
      files: Array.from(details.files), // Convert the set of files to an array
    }))
    .sort((a, b) => b.count - a.count) // Sort by count descending

  const hasIocs = iocData.length > 0

  // Render tags for each IOC within the type using Space for consistent layout
  const renderIocTag = (iocType, value, count, files) => {
    // Get the icon configuration for the current IOC type
    const iconConfig = getIconConfig('strelka', iocType)
    const IconComponent = iconConfig?.icon
    const iconColor = iconConfig?.color || antdColors.darkPurple // Default to darkPurple if no color is provided

    return (
      <Tooltip key={value} title={`Files: ${files.join(', ')}`}>
        <Tag
          onClick={() => selectIoc(value)}
          color="default"
          style={{
            cursor: 'pointer',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: selectedIoc === value ? `${antdColors.blue}10` : 'none',
            border:
              selectedIoc === value ? `1px solid ${antdColors.blue}` : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {IconComponent && (
              <div
                className="file-type-box"
                style={{ backgroundColor: iconColor, marginRight: '8px' }}
              >
                <IconComponent style={{ fontSize: '12px', color: 'white' }} />
              </div>
            )}
            <Text
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '12px',
              }}
            >
              {value}
            </Text>
            <Text style={{ fontSize: '12px', marginLeft: 'auto' }}>
              {count}
            </Text>
          </div>
        </Tag>
      </Tooltip>
    )
  }

  // Helper function to render a section for an IOC type
  const renderSection = (iocType, iocs) => {
    // Display a limited number of IOCs initially
    const displayedIocs = showMore ? iocs : iocs.slice(0, 5)

    const label = iocTypeLabels[iocType.toLowerCase()] || iocType

    return (
      <Space
        key={iocType}
        direction="vertical"
        size="small"
        style={{ width: '100%', marginBottom: '8px' }}
      >
        <Text strong style={{ fontSize: '12px', paddingBottom: '16px' }}>
          {label}:
        </Text>
        {displayedIocs.map((iocData) =>
          renderIocTag(
            iocData.type,
            iocData.value,
            iocData.count,
            iocData.files,
          ),
        )}
        {!showMore && iocs.length > 5 && (
          <Text
            onClick={() => setShowMore(true)}
            style={{
              cursor: 'pointer',
              color: '#1890ff',
              marginLeft: '30px',
              fontSize: '12px',
            }}
          >
            ... and {iocs.length - 5} more
          </Text>
        )}
      </Space>
    )
  }

  // Render the complete list of IOC sections
  return (
    <div>
      {!hasIocs ? (
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontSize: '12px',
            }}
          >
            No IOCs Not Found
          </p>
        </div>
      ) : (
        <>
          {Object.entries(iocTypeLabels)
            .filter(([iocType]) => iocData.some((ioc) => ioc.type === iocType)) // Filter out the IOC types that have no data
            .map(([iocType, _label]) => {
              const iocsForType = iocData.filter(
                (iocData) => iocData.type === iocType,
              )
              return renderSection(iocType, iocsForType)
            })}
        </>
      )}
    </div>
  )
}

export default FileIocsOverviewCard
