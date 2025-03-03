import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router'

import AppLayout from '../layouts/AppLayout'
import PrivateRoutes from './PrivateRoutes'

const LoginPage = lazy(() => import('../pages/Login'))

export const MainRouter = () => {
  return (
    <Routes>
      <Route
        path="/login"
        key="login"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <LoginPage />
          </Suspense>
        }
      />
      <Route element={<PrivateRoutes />}>
        <Route path="/*" key="/" element={<AppLayout />} />
      </Route>
    </Routes>
  )
}
