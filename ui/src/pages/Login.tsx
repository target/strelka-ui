import { KeyOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, theme } from 'antd'
import { Navigate } from 'react-router'
import GenericLogo from '../components/GenericLogo'
import { useAuthServices } from '../hooks/useAuthServices'

const { useToken } = theme

type LoginFields = {
  username: string
  password: string
}

export const LoginPage = () => {
  const { isAuthenticated, login } = useAuthServices()

  const tokenData = useToken()
  const BACKGROUND = tokenData.token.geekblue1

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        zIndex: '-1',
        background: BACKGROUND,
        backgroundImage: 'url(/dots.svg)',
      }}
    >
      {!isAuthenticated && (
        <div>
          <Card
            style={{ width: '330px', marginTop: '100px', textAlign: 'center' }}
          >
            <div>
              <GenericLogo />
            </div>
            <h1> Strelka Fileshot UI</h1>
            <Form
              initialValues={{ username: '', password: '' }}
              onFinish={async (values: LoginFields) => {
                await login(values.username, values.password)
              }}
              autoComplete="off"
            >
              <Form.Item<LoginFields>
                name="username"
                rules={[
                  { required: true, message: 'Please enter your username' },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Username"
                  style={{ fontSize: '16px' }}
                />
              </Form.Item>
              <Form.Item<LoginFields>
                name="password"
                rules={[
                  { required: true, message: 'Please enter your password' },
                ]}
              >
                <Input.Password
                  prefix={<KeyOutlined />}
                  placeholder="Password"
                  style={{ fontSize: '16px' }}
                />
              </Form.Item>
              <Form.Item label={null} style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{ width: '100%' }}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      )}
    </div>
  )
}

export default LoginPage
