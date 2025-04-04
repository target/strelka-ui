import { Input, Table, Typography } from 'antd'
import { useState } from 'react'
import '../../../styles/IocOverviewCard.css'
import type { OverviewCardProps } from '../types'

const { Text } = Typography

const QrOverviewCard = (props: OverviewCardProps) => {
  const { data } = props
  const [filter, setFilter] = useState('')

  const columns = [
    {
      title: 'Data',
      dataIndex: 'data',
      key: 'data',
      render: (text) => (
        <Text code copyable>
          {text}
        </Text>
      ),
    },
  ]

  const processQrData = () => {
    // Assuming data.scan.qr.data is an array of strings (URLs)
    return data.scan.qr.data
      .filter((url) => {
        const searchTerm = filter.toLowerCase()
        return !filter || url.toLowerCase().includes(searchTerm)
      })
      .map((data, index) => ({
        key: index,
        data: data,
      }))
  }

  const filteredQrData = processQrData()

  return (
    <div>
      <Input
        placeholder="Filter QR Codes"
        onChange={(e) => setFilter(e.target.value)}
        style={{ width: '100%', marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={filteredQrData}
        pagination={{ pageSize: 10 }}
        scroll={{ y: 200 }}
        className="qr-table"
      />
    </div>
  )
}

export default QrOverviewCard
