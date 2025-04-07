import { Col, Input, List, Row, Tag, Typography } from 'antd'
import { useMemo, useState } from 'react'
import type { StrelkaResponse } from '../../../services/api.types'
import { getColorForString } from '../../../utils/colors'
import type { OverviewCardProps } from '../types'

const { Text, Paragraph } = Typography

const mapDescriptions = (data: StrelkaResponse): Map<string, string> => {
  const descriptionMap = new Map<string, string>()
  if (data?.scan?.yara && Array.isArray(data.scan.yara.meta)) {
    for (const meta of data.scan.yara.meta) {
      if (meta.identifier === 'description') {
        descriptionMap.set(meta.rule, meta.value)
      }
    }
  }
  return descriptionMap
}

const processYaraData = (data: StrelkaResponse, filter: string) => {
  return compileRulesList(data).filter(({ rule, description }) => {
    const searchTerm = filter.toLowerCase()
    return (
      !filter ||
      rule.toLowerCase().includes(searchTerm) ||
      description.toLowerCase().includes(searchTerm)
    )
  })
}

const compileRulesList = (data: StrelkaResponse) => {
  const descriptionMap = mapDescriptions(data)
  if (data?.scan?.yara && Array.isArray(data.scan.yara.matches)) {
    return data.scan.yara.matches
      .map((match: string) => {
        const rule = match
        return {
          rule,
          description: descriptionMap.get(rule) || 'No description available.',
          color: getColorForString(rule.split('_')[0]),
        }
      })
      .sort((a, b) => a.rule.localeCompare(b.rule))
  }

  return []
}

const YaraOverviewCard = ({ data }: OverviewCardProps) => {
  const [filter, setFilter] = useState<string>('')

  const yaraData = useMemo(() => processYaraData(data, filter), [data, filter])

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Input
            placeholder="Filter"
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: '100%', marginBottom: '8px' }}
          />
        </Col>
      </Row>

      <List
        dataSource={yaraData}
        renderItem={(item) => (
          <List.Item
            style={{
              border: 'None',
              display: 'flex',
              alignItems: 'center',
              fontSize: '12px',
              paddingBottom: '4px',
              paddingTop: '4px',
              height: '100%',
            }}
          >
            <Tag
              style={{
                flexGrow: 1,
                display: 'flex',
                padding: '8px',
                alignItems: 'center',
                justifyContent: 'space-between',
                maxWidth: '-webkit-fill-available',
              }}
              color={item.color}
            >
              <Text strong style={{ fontSize: '12px', paddingRight: '10px' }}>
                {item.rule}
              </Text>
              <Paragraph
                ellipsis={{ rows: 1, expandable: true }}
                style={{
                  margin: 0,
                  textAlign: 'right',
                  fontSize: '12px',
                  overflow: 'auto',
                }}
              >
                {item.description}
              </Paragraph>
            </Tag>
          </List.Item>
        )}
        style={{ maxHeight: '200px', overflowY: 'scroll' }}
      />
    </div>
  )
}

export default YaraOverviewCard
