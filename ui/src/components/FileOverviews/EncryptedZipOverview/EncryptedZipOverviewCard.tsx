import { Card, Col, Descriptions, Row, Tag, Typography } from 'antd'
import { antdColors } from '../../../utils/colors'
import type { OverviewCardProps } from '../types'

const { Text } = Typography

// Function to determine extraction color based on extracted and total files
const getExtractionColor = (extracted, total) => {
  let colorObj = { color: antdColors.red }
  if (extracted === total && total > 0) {
    colorObj = { color: antdColors.darkGreen }
  } else if (extracted > 0 && extracted < total) {
    colorObj = { color: antdColors.deepOrange }
  }
  return colorObj
}

const EncryptedZipOverviewCard = ({ data }: OverviewCardProps) => {
  const extracted = data.scan.encrypted_zip.total.extracted
  const total = data.scan.encrypted_zip.total.files
  const extractionColor = getExtractionColor(extracted, total)

  return (
    <div>
      <Text strong>Extraction Details</Text>
      <Row gutter={[16, 16]} style={{ paddingTop: '10px', display: 'flex' }}>
        <Col span={8} style={{ display: 'flex', flexDirection: 'column' }}>
          <Card
            style={{
              textAlign: 'center',
              fontSize: '42px',
              fontWeight: 'bold',
              padding: '32px',
              boxShadow: 'None',
              borderRadius: '8px',
              flex: 1,
            }}
          >
            <div style={{ fontSize: '12px' }}>Extracted Files</div>
            <div style={{ fontSize: '43px', color: extractionColor.color }}>
              {extracted}/{total}
            </div>
          </Card>
        </Col>
        <Col span={16} style={{ display: 'flex', flexDirection: 'column' }}>
          <Descriptions
            bordered
            column={1}
            size="small"
            layout="horizontal"
            style={{ fontSize: '12px', flex: 1 }}
          >
            <Descriptions.Item
              label="Total Files"
              labelStyle={{ width: '140px', fontSize: '12px' }}
            >
              <Text style={{ fontSize: '12px' }}>{total}</Text>
            </Descriptions.Item>
            <Descriptions.Item
              label="Total Extracted"
              labelStyle={{ width: '140px', fontSize: '12px' }}
            >
              <Text style={{ fontSize: '12px' }}>{extracted}</Text>
            </Descriptions.Item>
            <Descriptions.Item
              label="Cracked Password"
              labelStyle={{ width: '140px', fontSize: '12px' }}
            >
              <Text style={{ fontSize: '12px' }}>
                {data.scan.encrypted_zip?.cracked_password || 'Not available'}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item
              label="Extraction Time"
              labelStyle={{ width: '140px', fontSize: '12px' }}
            >
              <Text style={{ fontSize: '12px' }}>
                {data.scan.encrypted_zip.elapsed.toFixed(3)} seconds
              </Text>
            </Descriptions.Item>
            {data.scan.encrypted_zip.flags && (
              <Descriptions.Item
                label="Details"
                labelStyle={{ width: '140px', fontSize: '12px' }}
              >
                {data.scan.encrypted_zip.flags.map((flag) => (
                  <Tag
                    key={flag}
                    color="orange"
                    style={{ marginBottom: '4px' }}
                  >
                    {flag}
                  </Tag>
                ))}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Col>
      </Row>
    </div>
  )
}

export default EncryptedZipOverviewCard
