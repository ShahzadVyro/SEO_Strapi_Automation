import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import CreateCluster from './pages/CreateCluster'
import Drafts from './pages/Drafts'
import PublishLog from './pages/PublishLog'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create" element={<CreateCluster />} />
          <Route path="drafts" element={<Drafts />} />
          <Route path="publish-log" element={<PublishLog />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
