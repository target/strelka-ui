import './App.css'

import { ConfigProvider, theme } from 'antd'
import { BrowserRouter } from 'react-router'
import { useDarkModeSetting } from './hooks/useDarkModeSetting'
import { AuthenticationProvider } from './providers/AuthenticationProvider'
import { MessageProvider } from './providers/MessageProvider'
import { MainRouter } from './routes/MainRouter'

import { themeConfig } from './themeConfig'

const baseUrl = '/'

const App = () => {
  const { defaultAlgorithm, darkAlgorithm } = theme

  const { isDarkMode, isLoading } = useDarkModeSetting()

  return (
    <div className="App">
      <ConfigProvider
        theme={{
          ...themeConfig,
          algorithm:
            isDarkMode && !isLoading ? darkAlgorithm : defaultAlgorithm,
        }}
      >
        <MessageProvider>
          <AuthenticationProvider>
            <BrowserRouter basename={baseUrl}>
              <MainRouter />
            </BrowserRouter>
          </AuthenticationProvider>
        </MessageProvider>
      </ConfigProvider>
    </div>
  )
}

export default App
