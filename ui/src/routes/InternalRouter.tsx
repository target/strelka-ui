import React from 'react'
import { Route, Routes } from 'react-router'
import PrivateRoutes from './PrivateRoutes'

const DashboardPage = React.lazy(() => import('../pages/Dashboard'))
const SubmissionViewPage = React.lazy(() => import('../pages/SubmissionView'))

export function InternalRouter() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route
            path="/submissions/:id"
            key="/submission-view"
            element={<SubmissionViewPage />}
          />
        </Route>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/*" element={<DashboardPage />} />
      </Routes>
    </React.Suspense>
  )
}

export default InternalRouter
