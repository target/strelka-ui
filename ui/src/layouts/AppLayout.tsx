import {
  BarChartOutlined,
  KeyOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Switch } from 'antd'
import { useState } from 'react'

import { Suspense, lazy } from 'react'
import { Link } from 'react-router'
import { DatabaseStatus } from '../components/DatabaseStatus'
import SystemStatus from '../components/SystemStatus'
import { useAuthServices } from '../hooks/useAuthServices'
import { useDarkModeSetting } from '../hooks/useDarkModeSetting'
import { InternalRouter } from '../routes/InternalRouter'

const ApiKeyModalLazyLoad = lazy(() =>
  import('../components/ApiKeyModal').then((d) => ({
    default: d.ApiKeyModal,
  })),
)
const AppLayout = () => {
  const { logout } = useAuthServices()
  const [isKeyModalVisible, setIsKeyModalVisible] = useState(false)

  const { isDarkMode, setDarkMode } = useDarkModeSetting()

  const showKeyModal = () => {
    setIsKeyModalVisible(true)
  }

  const handleKeyModalCancel = () => {
    setIsKeyModalVisible(false)
  }
  const doLogout = () => {
    logout()
  }

  const menuItems = [
    {
      key: 'home',
      label: (
        <img
          style={{
            marginTop: '7px',
            padding: '0px 12px',
            display: 'block',
          }}
          src="/logo192.png"
          alt="Logo"
          height="30px"
        />
      ),
    },
    {
      key: 'dashboard',
      icon: <BarChartOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: 'key',
      icon: <KeyOutlined />,
      label: (
        <Link to="/" onClick={showKeyModal}>
          Get API Key
        </Link>
      ),
    },
    {
      key: 'logout',
      label: <span onClick={doLogout}>Logout</span>,
    },
    {
      key: 'dark-mode-toggle',
      label: (
        <div>
          <Switch
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            onChange={setDarkMode}
            checked={isDarkMode}
          />
        </div>
      ),
      style: { marginLeft: 'auto', background: 'none', cursor: 'pointer' },
    },
    {
      key: 'system-status',
      label: <SystemStatus />,
      disabled: true,
      style: { background: 'none', cursor: 'pointer' },
    },
    {
      key: 'database-status',
      label: <DatabaseStatus />,
      disabled: true,
      style: { background: 'none', cursor: 'pointer' },
    },
  ]

  return (
    <Layout>
      <Menu
        mode="horizontal"
        defaultSelectedKeys={['home']}
        items={menuItems}
        style={{
          boxShadow:
            '0px 4px 6px -1px rgba(0, 0, 0, 0.1),0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
          paddingLeft: '50px',
          paddingRight: '50px',
        }}
      />
      {isKeyModalVisible && (
        <Suspense fallback={null}>
          <ApiKeyModalLazyLoad
            open={isKeyModalVisible}
            onCancel={handleKeyModalCancel}
          />
        </Suspense>
      )}

      <div className="main-content">
        <InternalRouter />
      </div>
    </Layout>
  )
}

export default AppLayout
