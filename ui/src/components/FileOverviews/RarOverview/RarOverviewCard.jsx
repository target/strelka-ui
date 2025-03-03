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
import React, { useState } from 'react'
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

const RarOverviewCard = ({ data }) => {
  const [filter, setFilter] = useState('')

  // Check if files exist and filter based on user input
  const files = data.scan.rar.files || []
  const filteredFiles = files
    .filter(
      (file) =>
        !filter || file.file_name.toLowerCase().includes(filter.toLowerCase()),
    )
    .sort((a, b) => a.file_name.localeCompare(b.file_name)) // Initial sort by filename

  const columns = [
    {
      title: <div style={{ textAlign: 'left' }}>File Name</div>,
      dataIndex: 'file_name',
      key: 'file_name',
      render: (text) => <Text style={{ fontSize: '12px' }}>{text}</Text>,
      sorter: (a, b) => a.file_name.localeCompare(b.file_name),
      defaultSortOrder: 'ascend',
      width: 300,
    },
    {
      title: <div style={{ textAlign: 'right' }}>File Size</div>,
      dataIndex: 'file_size',
      key: 'file_size',
      render: (size) => (
        <Text style={{ float: 'right', fontSize: '12px' }}>
          {formatBytes(Number.parseInt(size))}
        </Text>
      ),
      sorter: (a, b) =>
        Number.parseInt(a.file_size) - Number.parseInt(b.file_size),
      width: 100,
    },
    {
      title: <div style={{ textAlign: 'right' }}>Compression Rate</div>,
      dataIndex: 'compression_rate',
      key: 'compression_rate',
      render: (rate) => (
        <Text style={{ float: 'right', fontSize: '12px' }}>
          {rate.toFixed(2)}%
        </Text>
      ),
      sorter: (a, b) => a.compression_rate - b.compression_rate,
      width: 150,
    },
    {
      title: <div style={{ textAlign: 'center' }}>Encrypted</div>,
      dataIndex: 'encrypted',
      key: 'encrypted',
      render: (encrypted) => (
        <Tag
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto',
            width: '100px',
          }}
          color={encrypted ? 'volcano' : 'green'}
        >
          {encrypted ? 'Encrypted' : 'Not Encrypted'}
        </Tag>
      ),
      sorter: (a, b) => a.encrypted - b.encrypted,
      width: 120,
      align: 'center',
    },
    {
      title: <div style={{ textAlign: 'right' }}>Extracted</div>,
      dataIndex: 'extracted',
      key: 'extracted',
      render: (extracted) => (
        <Tag
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto',
            width: '100px',
          }}
          color={extracted ? 'green' : 'red'}
        >
          {extracted ? 'Yes' : 'No'}
        </Tag>
      ),
      sorter: (a, b) => a.extracted - b.extracted,
      width: 120,
      align: 'center',
    },
    {
      title: <div style={{ textAlign: 'right' }}>Last Modified</div>,
      dataIndex: 'datetime',
      key: 'datetime',
      render: (datetime) => (
        <Text style={{ float: 'right', fontSize: '12px' }}>{datetime}</Text>
      ),
      sorter: (a, b) => new Date(a.datetime) - new Date(b.datetime),
      width: 200,
    },
  ]

  const extracted = data.scan.rar.total.extracted
  const total = data.scan.rar.total.files
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
              height: '100%',
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
            style={{ fontSize: '12px', height: '100%' }}
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
              label="Compression Rate"
              labelStyle={{ width: '140px', fontSize: '12px' }}
            >
              <Text style={{ fontSize: '12px' }}>
                {data.scan.rar.compression_rate}%
              </Text>
            </Descriptions.Item>
            <Descriptions.Item
              label="Host OS"
              labelStyle={{ width: '140px', fontSize: '12px' }}
            >
              <Text style={{ fontSize: '12px' }}>{data.scan.rar.host_os}</Text>
            </Descriptions.Item>
            <Descriptions.Item
              label="Extraction Time"
              labelStyle={{ width: '140px', fontSize: '12px' }}
            >
              <Text style={{ fontSize: '12px' }}>
                {data.scan.rar.elapsed.toFixed(3)} seconds
              </Text>
            </Descriptions.Item>
            {data.scan.rar.flags && (
              <Descriptions.Item
                label="Details"
                labelStyle={{ width: '140px', fontSize: '12px' }}
              >
                {data.scan.rar.flags.map((flag) => (
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
          key: file.file_name + index,
        }))}
        pagination={{ pageSize: 10 }}
        scroll={{ y: 240 }}
        style={{ marginTop: '20px' }}
      />
    </div>
  )
}

export default RarOverviewCard
