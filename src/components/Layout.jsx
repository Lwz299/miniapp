import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from './ui/button'
import { LogOut, FileText, User, Home } from 'lucide-react'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-light)' }}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--base-sv-color)' }}>تأمين السفر</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline">{user?.name}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="rounded-xl hover:bg-[var(--bg-lighter)]"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-24 min-h-[calc(100vh-140px)]">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-border/50 max-w-md mx-auto shadow-lg">
        <div className="flex justify-around items-center h-16">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative ${
              isActive('/dashboard') ? '' : 'text-muted-foreground'
            }`}
            style={isActive('/dashboard') ? { color: 'var(--base-sv-color)' } : {}}
          >
            {isActive('/dashboard') && (
              <div className="absolute top-0 w-12 h-1 rounded-full" style={{ backgroundColor: 'var(--base-sv-color)' }}></div>
            )}
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">الرئيسية</span>
          </Link>
          <Link
            to="/documents"
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative ${
              isActive('/documents') ? '' : 'text-muted-foreground'
            }`}
            style={isActive('/documents') ? { color: 'var(--base-sv-color)' } : {}}
          >
            {isActive('/documents') && (
              <div className="absolute top-0 w-12 h-1 rounded-full" style={{ backgroundColor: 'var(--base-sv-color)' }}></div>
            )}
            <FileText className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">الوثائق</span>
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative ${
              isActive('/profile') ? '' : 'text-muted-foreground'
            }`}
            style={isActive('/profile') ? { color: 'var(--base-sv-color)' } : {}}
          >
            {isActive('/profile') && (
              <div className="absolute top-0 w-12 h-1 rounded-full" style={{ backgroundColor: 'var(--base-sv-color)' }}></div>
            )}
            <User className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">الملف الشخصي</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
