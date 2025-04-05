import { BookOutlined, WarningOutlined } from '@ant-design/icons'
import { Row, Tag, Tooltip, Typography } from 'antd'
import { useState } from 'react'
import { antdColors } from '../../../utils/colors'
import type { ScanData } from '../types'

const { Text } = Typography

interface YaraTypeOverviewCardProps extends ScanData {
  onFileYaraSelect: (selectedYara: string | null) => void
}

/**
 * Displays an overview of YARA matches for files, categorized into suspicious and classifiers.
 */
const YaraTypeOverviewCard = (props: YaraTypeOverviewCardProps) => {
  const { data, onFileYaraSelect } = props
  const [selectedYara, setSelectedYara] = useState(null)
  const [showMoreSuspicious, setShowMoreSuspicious] = useState(false)
  const [showMoreClassifiers, setShowMoreClassifiers] = useState(false)

  /**
   * Defined Suspicious YARA Qualifiers
   */
  const suspiciousYaraRules = [
    'autoopen',
    'screenshot',
    'maldoc',
    'exploit',
    'download',
    'crowdstrike',
    'keylogger',
    'malicious',
    'suspicious',
    'network',
  ]

  // Helper function descriptions
  /**
   * Handles selection of a YARA match.
   * @param {string} yara The selected YARA match.
   */
  const selectYara = (yara) => {
    const newSelectedYara = yara === selectedYara ? null : yara
    setSelectedYara(newSelectedYara)
    onFileYaraSelect(newSelectedYara)
  }

  interface YaraCounts {
    [yara: string]: {
      count: number
      files: string[]
    }
  }

  const yaraCounts: YaraCounts = {}

  for (const response of data.strelka_response) {
    const yaraMatches = response.scan?.yara?.matches || []
    for (const match of yaraMatches) {
      if (yaraCounts[match]) {
        yaraCounts[match].count++
        yaraCounts[match].files.push(
          response.file.name || response.scan.hash.md5,
        )
      } else {
        yaraCounts[match] = {
          count: 1,
          files: [response.file.name || response.scan.hash.md5],
        }
      }
    }
  }

  const yaraData = Object.entries(yaraCounts)
    .map(([yara, details]) => ({
      yara,
      count: details.count,
      files: details.files,
      isSuspicious: suspiciousYaraRules.some((rule) =>
        yara.toLowerCase().includes(rule),
      ),
    }))
    .sort((a, b) => b.count - a.count)

  // Filter yaraData into two categories based on the suspiciousYaraRules
  const suspiciousItems = yaraData.filter((item) => item.isSuspicious)
  const classifierItems = yaraData.filter((item) => !item.isSuspicious)

  const renderYaraTag = (item, isSuspicious) => (
    <Row key={item.yara} style={{ marginBottom: '8px' }}>
      <Tooltip title={item.files.join(', ')}>
        <Tag
          onClick={() => selectYara(item.yara)}
          style={{
            width: '95%',
            justifyContent: 'space-between',
            alignItems: 'center',
            background:
              selectedYara === item.yara
                ? isSuspicious
                  ? `${antdColors.deepOrange}20`
                  : `${antdColors.blue}20`
                : 'none',
            cursor: 'pointer',
            border:
              selectedYara === item.yara
                ? `1px solid ${
                    isSuspicious ? antdColors.deepOrange : antdColors.blue
                  }`
                : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              className="file-type-box"
              style={{
                backgroundColor: isSuspicious
                  ? antdColors.deepOrange
                  : antdColors.darkGray,
                marginRight: '8px',
              }}
            >
              {isSuspicious ? (
                <WarningOutlined style={{ fontSize: '12px', color: 'white' }} />
              ) : (
                <BookOutlined style={{ fontSize: '12px', color: 'white' }} />
              )}
            </div>
            <Text
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '12px',
              }}
            >
              {item.yara}
            </Text>
            <Text style={{ fontSize: '12px', marginLeft: 'auto' }}>
              {item.count}
            </Text>
          </div>
        </Tag>
      </Tooltip>
    </Row>
  )

  // Main render method for sections
  /**
   * Renders a section of YARA matches with a show more link if applicable.
   * @param {Array} items The YARA match items to render.
   * @param {boolean} isSuspicious Indicates if the section is for suspicious items.
   * @param {boolean} showMore Indicates if the section should show all items.
   * @param {Function} setShowMore The state setter for showing more items.
   * @returns {React.ReactNode}
   */
  const renderSection = (items, isSuspicious, showMore, setShowMore) => {
    const filteredItems = items.filter(
      (item) => item.isSuspicious === isSuspicious,
    )
    const displayedItems = showMore ? filteredItems : filteredItems.slice(0, 10)

    return (
      <>
        {displayedItems.map((item) => renderYaraTag(item, isSuspicious))}
        {!showMore && filteredItems.length > 10 && (
          <Row style={{ marginTop: '8px' }}>
            <Text
              onClick={() => setShowMore(true)}
              style={{
                marginLeft: '30px',
                fontSize: '12px',
                color: antdColors.blue,
                cursor: 'pointer',
              }}
            >
              ... and {filteredItems.length - 10} more
            </Text>
          </Row>
        )}
      </>
    )
  }

  return (
    <>
      {suspiciousItems.length > 0 && (
        <>
          <div style={{ paddingBottom: '10px' }}>
            <Text strong style={{ fontSize: '12px', paddingBottom: '16px' }}>
              Potentially Suspicious:
            </Text>
          </div>
          {renderSection(
            suspiciousItems,
            true,
            showMoreSuspicious,
            setShowMoreSuspicious,
          )}
        </>
      )}
      {classifierItems.length > 0 && (
        <>
          <div style={{ paddingTop: '8px', paddingBottom: '10px' }}>
            <Text strong style={{ fontSize: '12px', paddingBottom: '10px' }}>
              Potential Classifiers:
            </Text>
          </div>
          {renderSection(
            classifierItems,
            false,
            showMoreClassifiers,
            setShowMoreClassifiers,
          )}
        </>
      )}
    </>
  )
}

export default YaraTypeOverviewCard
