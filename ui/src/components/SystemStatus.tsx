import { CloudServerOutlined } from '@ant-design/icons'
import { Avatar, Tooltip } from 'antd'
import { useStrelkaStatus } from '../hooks/useStrelkaStatus'

function SystemStatus() {
  const { data, isLoading, isError } = useStrelkaStatus()

  const isStrelkaOnline =
    !isLoading && !isError && data?.message === 'Strelka is reachable'

  return (
    <div>
      <Tooltip
        title={
          isStrelkaOnline
            ? 'Strelka server is available.'
            : 'Cannot connect to Strelka. File submission may not work. Contact your administrator for details.'
        }
      >
        <Avatar
          style={{ backgroundColor: isStrelkaOnline ? '#52c41a' : '#eb2f96' }}
          icon={<CloudServerOutlined />}
        />
      </Tooltip>
    </div>
  )
}

export default SystemStatus
