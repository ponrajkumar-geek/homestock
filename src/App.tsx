import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Fab } from './components/layout/Fab'
import { Dashboard } from './pages/Dashboard'
import { ItemList } from './pages/ItemList'
import { ItemDetail } from './pages/ItemDetail'
import { ItemEdit } from './pages/ItemEdit'
import { Settings } from './pages/Settings'
import { useApplyTheme } from './hooks/useTheme'

function AppShell() {
  useApplyTheme()
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/items" element={<ItemList />} />
          <Route path="/items/new" element={<ItemEdit />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/items/:id/edit" element={<ItemEdit />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Fab />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
