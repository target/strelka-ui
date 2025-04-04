import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { Descriptions, Divider, List, Table, Typography } from 'antd'
import type { OverviewCardProps } from '../types'

import '../../../styles/PeOverviewCard.css'

const { Text } = Typography

const descriptionStyle = {
  labelStyle: {
    width: '20%',
    maxWidth: '50%',
    fontSize: '12px',
  },
  contentStyle: {
    fontSize: '12px',
  },
}

const PeOverviewCard = ({ data }: OverviewCardProps) => {
  const sectionColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text style={{ fontSize: '12px' }}>{text}</Text>,
    },
    {
      title: 'Virtual Address',
      dataIndex: 'address',
      key: 'virtualAddress',
      render: (address) => (
        <Text style={{ fontSize: '12px' }}>{address.virtual}</Text>
      ),
    },
    {
      title: 'Virtual Size',
      dataIndex: 'size',
      key: 'virtualSize',
      render: (size) => <Text style={{ fontSize: '12px' }}>{size}</Text>,
    },
    {
      title: 'Raw Size',
      dataIndex: 'address',
      key: 'rawSize',
      render: (address) => (
        <Text style={{ fontSize: '12px' }}>{address.physical}</Text>
      ),
    },
    {
      title: 'Entropy',
      dataIndex: 'entropy',
      key: 'entropy',
      render: (entropy) => (
        <Text
          style={{
            color: entropy > 7 ? 'red' : 'inherit',
            fontSize: '12px',
          }}
        >
          {entropy.toFixed(3)}
        </Text>
      ),
    },
    {
      title: 'MD5',
      dataIndex: 'md5',
      key: 'md5',
      render: (md5) => (
        <Text style={{ fontSize: '12px' }} copyable>
          {md5}
        </Text>
      ),
    },
  ]

  const dataSource = data.scan.pe.sections.map((section, index) => ({
    key: index,
    name: section.name,
    address: {
      virtual: section.address.virtual,
      physical: section.address.physical,
    },
    size: section.size,
    entropy: section.entropy,
    md5: section.md5,
  }))

  const importedSymbols = data.scan.pe?.symbols?.imported || []
  const exportedSymbols = data.scan.pe?.symbols?.exported || []

  return (
    <div className="pe-overview-card">
      <div style={{ padding: '5px', paddingBottom: '20px' }}>
        <Divider style={{ padding: '2px', margin: '2px' }} />
        <Text strong style={{ fontSize: '12px' }}>
          Header
        </Text>
        <Divider style={{ padding: '2px', margin: '2px' }} />
        <Descriptions column={1} size="small">
          <Descriptions.Item
            label="Target Machine"
            style={{ padding: '1px' }}
            labelStyle={descriptionStyle.labelStyle}
            contentStyle={descriptionStyle.contentStyle}
          >
            <Text style={{ fontSize: '12px' }} copyable>
              {data.scan.pe.header.machine.type}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item
            label="Compilation Timestamp"
            style={{ padding: '1px' }}
            labelStyle={descriptionStyle.labelStyle}
            contentStyle={descriptionStyle.contentStyle}
          >
            <Text style={{ fontSize: '12px' }} copyable>
              {data.scan.pe.compile_time}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item
            label="Entry Point"
            style={{ padding: '1px' }}
            labelStyle={descriptionStyle.labelStyle}
            contentStyle={descriptionStyle.contentStyle}
          >
            <Text style={{ fontSize: '12px' }} copyable>
              {data.scan.pe.address_of_entry_point}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item
            label="Contained Sections"
            style={{ padding: '1px' }}
            labelStyle={descriptionStyle.labelStyle}
            contentStyle={descriptionStyle.contentStyle}
          >
            <Text style={{ fontSize: '12px' }} copyable>
              {data.scan.pe.sections.length}
            </Text>
          </Descriptions.Item>
        </Descriptions>
      </div>

      <Divider style={{ padding: '2px', margin: '2px' }} />
      <Text strong style={{ fontSize: '12px' }}>
        Sections
      </Text>
      <Divider style={{ padding: '2px', margin: '2px' }} />

      <Table
        dataSource={dataSource}
        columns={sectionColumns}
        pagination={false}
        size="small"
      />

      <Divider style={{ padding: '2px', marginTop: '15px', margin: '2px' }} />
      <Text strong style={{ fontSize: '12px' }}>
        Signature Info
      </Text>
      <Divider style={{ padding: '2px', margin: '2px' }} />
      <div style={{ padding: '5px', paddingBottom: '20px' }}>
        <Text strong style={{ fontSize: '12px' }}>
          Signature Verification
        </Text>
        <div style={{ padding: '5px', paddingBottom: '20px' }}>
          {data.scan.pe?.security ? (
            <div>
              <CheckCircleOutlined
                style={{
                  fontSize: '16px',
                  paddingRight: '5px',
                  color: 'green',
                }}
              />
              <Text style={{ fontSize: '12px' }}>File is signed</Text>
            </div>
          ) : (
            <div>
              <WarningOutlined
                twoToneColor="orange"
                style={{
                  fontSize: '16px',
                  paddingRight: '5px',
                  color: 'orange',
                }}
              />

              <Text style={{ fontSize: '12px' }}>File is not signed</Text>
            </div>
          )}
        </div>
        <Text strong style={{ fontSize: '12px' }}>
          File Version Information
        </Text>
        <Descriptions column={1} size="small">
          <Descriptions.Item
            label="Copyright"
            style={{ padding: '1px' }}
            labelStyle={descriptionStyle.labelStyle}
            contentStyle={descriptionStyle.contentStyle}
          >
            <Text style={{ fontSize: '12px' }} copyable>
              {data.scan.pe?.file_info?.legal_copyright}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item
            label="Product"
            style={{ padding: '1px' }}
            labelStyle={descriptionStyle.labelStyle}
            contentStyle={descriptionStyle.contentStyle}
          >
            <Text style={{ fontSize: '12px' }} copyable>
              {data.scan.pe?.file_info?.product_name}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item
            label="Description"
            style={{ padding: '1px' }}
            labelStyle={descriptionStyle.labelStyle}
            contentStyle={descriptionStyle.contentStyle}
          >
            <Text style={{ fontSize: '12px' }} copyable>
              {data.scan.pe?.file_info?.file_description}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item
            label="Original Name"
            style={{ padding: '1px' }}
            labelStyle={descriptionStyle.labelStyle}
            contentStyle={descriptionStyle.contentStyle}
          >
            <Text style={{ fontSize: '12px' }} copyable>
              {data.scan.pe?.file_info?.original_filename}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item
            label="File Version"
            style={{ padding: '1px' }}
            labelStyle={descriptionStyle.labelStyle}
            contentStyle={descriptionStyle.contentStyle}
          >
            <Text style={{ fontSize: '12px' }} copyable>
              {data.scan.pe?.file_info?.file_version}
            </Text>
          </Descriptions.Item>
        </Descriptions>
      </div>

      <Divider style={{ padding: '2px', margin: '2px', marginTop: '15px' }} />
      <Text strong style={{ fontSize: '12px' }}>
        Imports
      </Text>
      <Divider style={{ padding: '2px', margin: '2px' }} />

      <List
        size="small"
        dataSource={importedSymbols}
        renderItem={(item) => (
          <List.Item>
            <Text style={{ fontSize: '12px' }} code>
              {item}
            </Text>
          </List.Item>
        )}
        style={{ maxHeight: '200px', overflow: 'auto' }}
      />

      <Divider style={{ padding: '2px', margin: '2px', marginTop: '15px' }} />
      <Text strong style={{ fontSize: '12px' }}>
        Exports
      </Text>
      <Divider style={{ padding: '2px', margin: '2px' }} />

      <List
        size="small"
        dataSource={exportedSymbols}
        renderItem={(item) => (
          <List.Item>
            <Text style={{ fontSize: '12px' }} code>
              {item}
            </Text>
          </List.Item>
        )}
        style={{ maxHeight: '200px', overflow: 'auto' }}
      />
    </div>
  )
}

export default PeOverviewCard
