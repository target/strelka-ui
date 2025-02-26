import { useAuthCtx } from '../providers/AuthenticationProvider'
import { useMessageApi } from '../providers/MessageProvider'
import * as api from '../services/api'

export function useAuthServices() {
  const { isAuthenticated, setIsAuthenticated } = useAuthCtx()

  const message = useMessageApi()

  const handle401 = () => {
    message.info('Please log in, your session may have timed out.')
    window.localStorage.removeItem('isAuthenticated')
    setIsAuthenticated(false)
  }

  const logout = () => {
    api.logout().then(() => {
      window.localStorage.removeItem('isAuthenticated')
      setIsAuthenticated(false)
      message.success('You have successfully logged out')
    })
  }

  async function login(username: string, password: string) {
    try {
      await api.login(username, password)
      window.localStorage.setItem('isAuthenticated', 'true')
      setIsAuthenticated(true)
      message.success('Login succeeded')
    } catch (e) {
      message.error(`Login failed: ${e.response?.data?.error || e.message}`)
    }
  }

  return {
    login,
    logout,
    isAuthenticated,
    handle401,
    message,
  }
}
