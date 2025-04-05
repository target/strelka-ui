import { Input, Table, Typography } from 'antd'
import { useState } from 'react'
import '../../../styles/IocOverviewCard.css'
import type { OverviewCardProps } from '../types'

const { Text } = Typography

const IocOverviewCard = (props: OverviewCardProps) => {
  const { data } = props
  const [filter, setFilter] = useState('')
  const [pageSize, setPageSize] = useState(10)

  const columns = [
    {
      title: 'Scanner',
      dataIndex: 'scanner',
      key: 'scanner',
      sorter: (a, b) => a.scanner.localeCompare(b.scanner),
      width: 200,
    },
    {
      title: 'Type',
      dataIndex: 'iocType',
      key: 'iocType',
      sorter: (a, b) => a.iocType.localeCompare(b.iocType),
      width: 200,
    },
    {
      title: 'IOC',
      dataIndex: 'ioc',
      key: 'ioc',
      sorter: (a, b) => a.ioc.localeCompare(b.ioc),
      render: (text) => (
        <Text code copyable>
          {text}
        </Text>
      ),
    },
  ]

  const processIocData = () => {
    return data.iocs
      .filter((ioc) => {
        const searchTerm = filter.toLowerCase()
        return (
          !filter ||
          ioc.ioc.toLowerCase().includes(searchTerm) ||
          ioc.ioc_type.toLowerCase().includes(searchTerm) ||
          ioc.scanner.toLowerCase().includes(searchTerm)
        )
      })
      .map((ioc, index) => ({
        key: index,
        ioc: ioc.ioc,
        iocType: ioc.ioc_type,
        scanner: ioc.scanner,
      }))
  }

  const handleTableChange = (pagination) => {
    // Update pageSize when table pagination changes
    setPageSize(pagination.pageSize)
  }

  const filteredIocs = processIocData()

  return (
    <div>
      <Input
        placeholder="Filter IOCs"
        onChange={(e) => setFilter(e.target.value)}
        style={{ width: '100%', marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={filteredIocs}
        pagination={{ pageSize, showSizeChanger: true }}
        scroll={{ y: 200 }}
        className="ioc-table"
        onChange={handleTableChange} // Handle pagination changes
      />
    </div>
  )
}

export default IocOverviewCard
