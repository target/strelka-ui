import { Checkbox, Col, Input, Row, Typography } from 'antd'
import { useState } from 'react'
import '../../../styles/ExiftoolOverviewCard.css'
import type { OverviewCardProps } from '../types'

const { Text } = Typography

const VbOverviewCard = (props: OverviewCardProps) => {
  const { data } = props
  const [filter, setFilter] = useState('')
  const [wrapText, setWrapText] = useState(false)
  const [trimText, setTrimText] = useState(true)

  // Function to process VB script data for display
  const processVbData = (key) => {
    if (!data.scan.vb[key] || !Array.isArray(data.scan.vb[key])) {
      return []
    }

    return data.scan.vb[key]
      .filter((value) => {
        const searchTerm = filter.toLowerCase()
        return !filter || value.toLowerCase().includes(searchTerm)
      })
      .map((value, index) => {
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
        return { line: index + 1, value: processedValue }
      })
  }

  const renderVbSection = (title, key) => {
    const vbData = processVbData(key)

    return (
      <div
        className="exif-data-list"
        style={{ maxHeight: '400px', overflow: 'auto' }}
      >
        <Text strong style={{ fontSize: '14px', marginBottom: '10px' }}>
          {title}
        </Text>
        {vbData.length === 0 ? (
          <div>
            <Text strong style={{ fontSize: '12px', marginBottom: '10px' }}>
              No data available for this section
            </Text>
          </div>
        ) : (
          vbData.map(({ line, value }) => (
            <Row key={line} className="exif-data-row">
              <Col span={1} className="line-number">
                <div style={{ fontSize: '12px' }}>{line}</div>
              </Col>
              <Col span={22} className="exif-data-value">
                <Text code copyable style={{ fontSize: '12px' }}>
                  {typeof value === 'string' ? value : JSON.stringify(value)}
                </Text>
              </Col>
            </Row>
          ))
        )}
      </div>
    )
  }

  return (
    <div className="vb-overview">
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

      {renderVbSection('Tokens', 'tokens')}
      {renderVbSection('Comments', 'comments')}
      {renderVbSection('Functions', 'functions')}
      {renderVbSection('Names', 'names')}
      {renderVbSection('Operators', 'operators')}
      {renderVbSection('Strings', 'strings')}
    </div>
  )
}

export default VbOverviewCard
