import { createContext, useContext, useState } from 'react'

interface AuthContext {
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
}

const AuthCtx = createContext<AuthContext | undefined>(undefined)

export const AuthenticationProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    window.localStorage.getItem('isAuthenticated') || false,
  )

  return (
    <AuthCtx.Provider
      value={{ isAuthenticated, setIsAuthenticated }}
      {...props}
    />
  )
}

export function useAuthCtx() {
  const ctx = useContext(AuthCtx)

  if (!ctx) {
    throw new Error('useAuthCtx must be used within a AuthenticationProvider')
  }

  return ctx
}
