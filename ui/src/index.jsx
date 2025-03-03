import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { QueryProvider } from './providers/QueryProvider'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <QueryProvider>
    <App tab="home" />
  </QueryProvider>,
)
