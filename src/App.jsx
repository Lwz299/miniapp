import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DocumentsProvider } from './context/DocumentsContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateDocument from './pages/CreateDocument'
import Documents from './pages/Documents'
import DocumentDetail from './pages/DocumentDetail'
import Profile from './pages/Profile'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DocumentsProvider>
                  <Dashboard />
                </DocumentsProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-document"
            element={
              <ProtectedRoute>
                <DocumentsProvider>
                  <CreateDocument />
                </DocumentsProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <DocumentsProvider>
                  <Documents />
                </DocumentsProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents/:id"
            element={
              <ProtectedRoute>
                <DocumentsProvider>
                  <DocumentDetail />
                </DocumentsProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
