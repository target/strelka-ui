import { Checkbox, Col, Input, Row, Typography } from 'antd'
import { useState } from 'react'
import '../../../styles/ExiftoolOverviewCard.css'
import type { OverviewCardProps } from '../types'

const { Text } = Typography

const JavascriptOverviewCard = (props: OverviewCardProps) => {
  const { data } = props
  const [filter, setFilter] = useState('')
  const [wrapText, setWrapText] = useState(false)
  const [trimText, setTrimText] = useState(true)

  // Function to process Javascript script data for display
  const processJavascriptData = (key) => {
    return data.scan.javascript[key]
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

  const renderJavascriptSection = (title: string, key: string) => {
    if (!data.scan.javascript || !data.scan.javascript[key]) {
      return null // Return null or handle the case where key doesn't exist
    }

    const javascriptData = processJavascriptData(key)
    return (
      <div
        className="exif-data-list"
        style={{ maxHeight: '400px', overflow: 'auto' }}
      >
        <Text strong style={{ fontSize: '14px', marginBottom: '10px' }}>
          {title}
        </Text>
        {javascriptData.map(({ line, value }) => (
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
        ))}
      </div>
    )
  }

  return (
    <div className="javascript-overview">
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

      {renderJavascriptSection('Identifiers', 'identifiers')}
      {renderJavascriptSection('Keywords', 'keywords')}
      {renderJavascriptSection('Regular Expressions', 'regular_expressions')}
      {renderJavascriptSection('Strings', 'strings')}
      {renderJavascriptSection('Suspicious Keywords', 'suspicious_keywords')}
      {renderJavascriptSection('Tokens', 'tokens')}
      {renderJavascriptSection('URLs', 'urls')}
    </div>
  )
}

export default JavascriptOverviewCard
