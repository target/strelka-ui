import { Navigate, Outlet } from 'react-router'

import { useAuthServices } from '../hooks/useAuthServices'

const PrivateRoutes = () => {
  const { isAuthenticated } = useAuthServices()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoutes
