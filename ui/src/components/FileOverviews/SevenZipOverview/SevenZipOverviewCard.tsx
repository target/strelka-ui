import {
  Card,
  Col,
  Descriptions,
  Divider,
  Input,
  Row,
  Table,
  Tag,
  Typography,
} from 'antd'
import { useState } from 'react'
import { antdColors } from '../../../utils/colors'

const { Text } = Typography

// Utility function to format bytes into more readable formats
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

// Function to determine extraction color based on extracted and total files
const getExtractionColor = (extracted, total) => {
  if (extracted === total && total > 0) {
    return { color: antdColors.darkGreen }
  }

  if (extracted > 0 && extracted < total) {
    return { color: antdColors.deepOrange }
  }

  return { color: antdColors.red }
}

const SevenZipOverviewCard = ({ data }) => {
  const [filter, setFilter] = useState('')

  // Check if files exist and filter based on user input
  const files = data.scan.seven_zip.files || []
  const filteredFiles = files
    .filter(
      (file) =>
        !filter || file.filename.toLowerCase().includes(filter.toLowerCase()),
    )
    .sort((a, b) => a.filename.localeCompare(b.filename)) // Initial sort by filename

  const columns = [
    {
      title: <div style={{ textAlign: 'left' }}>File Name</div>,
      dataIndex: 'filename',
      key: 'filename',
      render: (text) => <Text style={{ fontSize: '12px' }}>{text}</Text>,
      defaultSortOrder: 'ascend' as const,
      width: 300,
    },
    {
      title: <div style={{ textAlign: 'right' }}>File Size</div>,
      dataIndex: 'size',
      key: 'size',
      render: (size) => (
        <Text style={{ float: 'right', fontSize: '12px' }}>
          {formatBytes(Number.parseInt(size))}
        </Text>
      ),
      sorter: (a, b) => Number.parseInt(a.size) - Number.parseInt(b.size),
      width: 100,
    },
    {
      title: <div style={{ textAlign: 'right' }}>Last Modified</div>,
      dataIndex: 'datetime',
      key: 'datetime',
      render: (datetime) => (
        <Text style={{ float: 'right', fontSize: '12px' }}>{datetime}</Text>
      ),
      sorter: (a, b) =>
        new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
      width: 200,
    },
  ]

  const extracted = data.scan.seven_zip.total.extracted
  const total = data.scan.seven_zip.total.files
  const extractionColor = getExtractionColor(extracted, total)

  return (
    <div>
      <Text strong>Extraction Details</Text>
      <Row gutter={[16, 16]} style={{ paddingTop: '10px' }}>
        <Col span={8}>
          <Card
            style={{
              textAlign: 'center',
              fontSize: '42px',
              fontWeight: 'bold',
              padding: '32px',
              boxShadow: 'None',
              borderRadius: '8px',
            }}
          >
            <div style={{ fontSize: '12px' }}>Extracted Files</div>
            <div style={{ fontSize: '43px', color: extractionColor.color }}>
              {extracted}/{total}
            </div>
          </Card>
        </Col>
        <Col span={16}>
          <Descriptions
            bordered
            column={1}
            size="small"
            layout="horizontal"
            style={{ fontSize: '12px' }}
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
              label="7-Zip Version"
              labelStyle={{ width: '140px', fontSize: '12px' }}
            >
              <Text style={{ fontSize: '12px' }}>
                {data.scan.seven_zip?.meta?.['7zip_version'] || 'Not available'}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item
              label="Extraction Time"
              labelStyle={{ width: '140px', fontSize: '12px' }}
            >
              <Text style={{ fontSize: '12px' }}>
                {data.scan.seven_zip.elapsed.toFixed(3)} seconds
              </Text>
            </Descriptions.Item>
            <Descriptions.Item
              label="Details"
              labelStyle={{ width: '140px', fontSize: '12px' }}
            >
              {data.scan.seven_zip?.flags?.map((flag) => (
                <Tag key={flag} color="orange" style={{ marginBottom: '4px' }}>
                  {flag}
                </Tag>
              )) || (
                <Tag color="default" style={{ marginBottom: '4px' }}>
                  No Additional Details
                </Tag>
              )}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Divider />
      <Text strong>File Listing</Text>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Input
            placeholder="Filter by file name"
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: '100%', marginTop: '10px' }}
          />
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={filteredFiles.map((file, index) => ({
          ...file,
          key: file.filename + index,
        }))}
        pagination={{ pageSize: 10 }}
        scroll={{ y: 240 }}
        style={{ marginTop: '20px' }}
      />
    </div>
  )
}

export default SevenZipOverviewCard
