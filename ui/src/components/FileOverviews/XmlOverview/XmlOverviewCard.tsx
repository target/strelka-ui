import { Col, Descriptions, Input, List, Row, Typography } from 'antd'
import { useState } from 'react'
import '../../../styles/ExiftoolOverviewCard.css'
import type { OverviewCardProps } from '../types'

const { Text } = Typography

const XmlOverviewCard = (props: OverviewCardProps) => {
  const { data } = props
  const xmlData = data.scan.xml

  const [filter, setFilter] = useState('')

  // Handles filtering and processing of list items (objects or strings)
  const filterData = (dataSource) => {
    const searchTerm = filter.toLowerCase()
    return dataSource.filter((item) => {
      const content = typeof item === 'object' ? JSON.stringify(item) : item
      return !filter || content.toLowerCase().includes(searchTerm)
    })
  }

  // Function to render item content based on whether it is a string or object
  const renderItemContent = (item) => {
    if (typeof item === 'object') {
      return (
        <div>
          {Object.entries(item).map(([key, value]) => {
            // Exclude standalone "Type" entries from being displayed
            if (
              key.toLowerCase() === 'type' &&
              Object.keys(item).length === 1
            ) {
              return null
            }
            return (
              <Row key={key} gutter={24}>
                <Col span={4}>
                  <Text style={{ fontSize: '12px' }}>{key}:</Text>
                </Col>
                <Col span={20}>
                  <Text code copyable style={{ fontSize: '12px' }}>
                    {value.toString()}
                  </Text>
                </Col>
              </Row>
            )
          })}
        </div>
      )
    }
    return (
      <Text code copyable style={{ fontSize: '12px' }}>
        {item}
      </Text>
    )
  }

  return (
    <div className="xml-overview-card">
      <Input
        placeholder="Filter by keyword..."
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: '10px' }}
      />

      <Descriptions bordered column={1} size="small">
        {xmlData.doc_type && (
          <Descriptions.Item key="doc_type" label="Doc Type">
            <Text code copyable style={{ fontSize: '12px' }}>
              {xmlData.doc_type}
            </Text>
          </Descriptions.Item>
        )}
        {xmlData.version && (
          <Descriptions.Item key="version" label="Version">
            <Text code copyable style={{ fontSize: '12px' }}>
              {xmlData.version}
            </Text>
          </Descriptions.Item>
        )}
        {xmlData.namespaces?.length > 0 && (
          <Descriptions.Item key="namespaces" label="Namespaces">
            {xmlData.namespaces.map((ns) => (
              <Text key={ns} code copyable style={{ fontSize: '12px' }}>
                {ns}
              </Text>
            ))}
          </Descriptions.Item>
        )}
        {xmlData.total && (
          <Descriptions.Item key="observed_tags" label="Observed Tags">
            <Text style={{ fontSize: '12px' }}>{xmlData.total.tags}</Text>
          </Descriptions.Item>
        )}
        {xmlData.total && (
          <Descriptions.Item key="extracted_tags" label="Extracted Tags">
            <Text style={{ fontSize: '12px' }}>{xmlData.total.extracted}</Text>
          </Descriptions.Item>
        )}

        <Descriptions.Item label="Emitted Content">
          {xmlData.emitted_content && xmlData.emitted_content.length > 0 ? (
            <List
              size="small"
              dataSource={filterData(xmlData.emitted_content)}
              renderItem={(item) => (
                <List.Item>{renderItemContent(item)}</List.Item>
              )}
              style={{ maxHeight: '200px', overflow: 'auto' }}
            />
          ) : (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              No Data
            </Text>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Tags">
          {xmlData.tags && xmlData.tags.length > 0 ? (
            <List
              size="small"
              dataSource={filterData(xmlData.tags)}
              renderItem={(item) => (
                <List.Item>{renderItemContent(item)}</List.Item>
              )}
              style={{ maxHeight: '200px', overflow: 'auto' }}
            />
          ) : (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              No Data
            </Text>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Tag Data">
          {xmlData.tag_data && xmlData.tag_data.length > 0 ? (
            <List
              size="small"
              dataSource={filterData(xmlData.tag_data)}
              renderItem={(item) => (
                <List.Item>{renderItemContent(item)}</List.Item>
              )}
              style={{ maxHeight: '200px', overflow: 'auto' }}
            />
          ) : (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              No Data
            </Text>
          )}
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}

export default XmlOverviewCard
