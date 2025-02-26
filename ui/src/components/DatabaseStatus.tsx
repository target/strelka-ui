import { DatabaseOutlined } from '@ant-design/icons'
import { Avatar, Tooltip } from 'antd'
import { useDatabaseStatus } from '../hooks/useDatabaseStatus'

export function DatabaseStatus() {
  const { data, isLoading, isError } = useDatabaseStatus()

  const isDatabaseOnline =
    !isLoading && !isError && data?.message === 'Database is reachable'

  const statusTooltip = isDatabaseOnline
    ? 'Database is available.'
    : 'Cannot connect to database. File submission may not work. Contact your administrator for details.'

  return (
    <div>
      <Tooltip title={statusTooltip}>
        <Avatar
          style={{ backgroundColor: isDatabaseOnline ? '#52c41a' : '#eb2f96' }}
          icon={<DatabaseOutlined />}
        />
      </Tooltip>
    </div>
  )
}

export default DatabaseStatus
