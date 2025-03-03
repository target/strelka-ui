import { KeyOutlined, UserOutlined } from '@ant-design/icons'
import ProForm, { ProFormText } from '@ant-design/pro-form'
import { Card, theme } from 'antd'
import { Navigate } from 'react-router'
import GenericLogo from '../components/GenericLogo'
import { useAuthServices } from '../hooks/useAuthServices'

const { useToken } = theme

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
            <ProForm
              onFinish={async (values) => {
                await login(values.username, values.password)
              }}
              submitter={{
                searchConfig: {
                  submitText: 'Login',
                },
                render: (_, dom) => dom.pop(),
                submitButtonProps: {
                  type: 'primary',
                  size: 'large',
                  style: {
                    width: '100%',
                  },
                },
              }}
              isKeyPressSubmit={true}
            >
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                  autoComplete: 'username',
                }}
                name="username"
                placeholder="Username"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your username',
                  },
                ]}
              />

              <ProFormText.Password
                fieldProps={{
                  size: 'large',
                  prefix: <KeyOutlined />,
                  autoComplete: 'current-password',
                }}
                name="password"
                placeholder="Password"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your password',
                  },
                ]}
              />
            </ProForm>
          </Card>
        </div>
      )}
    </div>
  )
}

export default LoginPage
