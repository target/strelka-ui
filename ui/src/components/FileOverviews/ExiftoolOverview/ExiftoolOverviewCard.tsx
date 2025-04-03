import { Checkbox, Col, Input, Row, Typography } from 'antd'
import '../../../styles/ExiftoolOverviewCard.css'
import { useState } from 'react'
import type { OverviewCardProps } from '../types'

const { Text } = Typography

const ExifToolCard = ({ data }: OverviewCardProps) => {
  const [filter, setFilter] = useState('')
  const [wrapText, setWrapText] = useState(false)
  const [trimText, setTrimText] = useState(true)

  // Function to filter, wrap, and trim EXIF data
  const processExifData = () => {
    return Object.entries(data.scan.exiftool)
      .filter(([key, value]) => {
        const searchTerm = filter.toLowerCase()
        const keyValue = key.toLowerCase().includes(searchTerm)
        const valueValue = value.toString().toLowerCase().includes(searchTerm)
        return !filter || keyValue || valueValue
      })
      .map(([key, value], index) => {
        let processedValue = value
        if (trimText && typeof processedValue === 'string') {
          processedValue = processedValue.trim()
        }
        if (!wrapText) {
          processedValue =
            typeof processedValue === 'string'
              ? processedValue.replace(/\s+/g, ' ')
              : processedValue
        }
        return {
          line: index + 1,
          key: key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          value: processedValue,
        }
      })
  }

  const exifData = processExifData()

  return (
    <div className="ocr-overview">
      <Row gutter={[16, 16]}>
        <Col span={18}>
          <Input
            placeholder="Filter"
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={6}>
          <Checkbox
            checked={wrapText}
            onChange={(e) => setWrapText(e.target.checked)}
          >
            Wrap
          </Checkbox>
          <Checkbox
            checked={trimText}
            onChange={(e) => setTrimText(e.target.checked)}
          >
            Trim
          </Checkbox>
        </Col>
      </Row>

      <div
        className="exif-data-list"
        style={{ maxHeight: '400px', overflow: 'auto' }}
      >
        {exifData.map(({ line, label, value }) => (
          <Row key={line} className="exif-data-row">
            <Col span={1} className="line-number">
              <div style={{ fontSize: '12px' }}>{line}</div>
            </Col>
            <Col span={4} className="exif-data-label">
              <Text strong style={{ fontSize: '12px' }}>{`${label}:`}</Text>
            </Col>
            <Col span={14} className="exif-data-value">
              <Text code copyable style={{ fontSize: '12px' }}>
                {typeof value === 'string' ? value : JSON.stringify(value)}
              </Text>
            </Col>
          </Row>
        ))}
      </div>
    </div>
  )
}

export default ExifToolCard
