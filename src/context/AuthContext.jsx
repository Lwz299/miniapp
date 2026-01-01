import { createContext, useContext, useState, useEffect } from 'react'
import { authenticateHylidUser, isHylidMiniApp, showHylidAlert } from '../utils/hylidBridge'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isMiniApp, setIsMiniApp] = useState(false)
  const [token, setToken] = useState(null)

  useEffect(() => {
    // Check if running in Mini App
    const miniApp = isHylidMiniApp()
    setIsMiniApp(miniApp)

    // Load token from localStorage
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
    }

    // Try to authenticate with Hylid if in Mini App environment
    if (miniApp) {
      authenticateHylidUser().then((result) => {
        if (result.success && result.userData) {
          // Save token
          if (result.token) {
            setToken(result.token)
            localStorage.setItem('token', result.token)
          }
          
          // Use user data from API response
          const userData = {
            id: result.userData.id || Date.now().toString(),
            email: result.userData.email || result.userData.phone || '',
            name: result.userData.name || result.userData.nickname || 'المستخدم',
            ...result.userData,
            authCode: result.authCode,
            createdAt: new Date().toISOString()
          }
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
          showHylidAlert('تم تسجيل الدخول بنجاح')
        } else {
          // Fallback to localStorage if authentication fails
          const savedUser = localStorage.getItem('user')
          if (savedUser) {
            setUser(JSON.parse(savedUser))
          }
        }
        setLoading(false)
      }).catch(() => {
        // Fallback to localStorage on error
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
        setLoading(false)
      })
    } else {
      // Load user from localStorage on mount (web mode)
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    // If in Mini App, try Hylid authentication first
    if (isMiniApp) {
      const result = await authenticateHylidUser()
      if (result.success && result.userData) {
        // Save token
        if (result.token) {
          setToken(result.token)
          localStorage.setItem('token', result.token)
        }

        const userData = {
          id: result.userData.id || Date.now().toString(),
          email: result.userData.email || result.userData.phone || email,
          name: result.userData.name || result.userData.nickname || 'المستخدم',
          ...result.userData,
          authCode: result.authCode,
          createdAt: new Date().toISOString()
        }
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        showHylidAlert('تم تسجيل الدخول بنجاح')
        return userData
      }
    }

    // Fallback to simple authentication (for web mode)
    const userData = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString()
    }
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    return userData
  }

  const register = (email, password, name) => {
    // Simple registration (in production, use API)
    // In Mini App, registration might be handled differently
    if (isMiniApp) {
      // Try Hylid authentication for registration too
      return login(email, password)
    }

    const userData = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date().toISOString()
    }
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    return userData
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('documents')
    
    if (isMiniApp) {
      showHylidAlert('تم تسجيل الخروج')
    }
  }

  const updateProfile = (profileData) => {
    const updatedUser = { ...user, ...profileData }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const reauthenticate = async () => {
    if (!isMiniApp) return false
    
    setLoading(true)
    const result = await authenticateHylidUser()
    if (result.success && result.userData) {
      // Save token
      if (result.token) {
        setToken(result.token)
        localStorage.setItem('token', result.token)
      }

      const userData = {
        id: result.userData.id || Date.now().toString(),
        email: result.userData.email || result.userData.phone || '',
        name: result.userData.name || result.userData.nickname || 'المستخدم',
        ...result.userData,
        authCode: result.authCode,
        createdAt: new Date().toISOString()
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      setLoading(false)
      return true
    }
    setLoading(false)
    return false
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updateProfile, 
      loading,
      isMiniApp,
      reauthenticate,
      token
    }}>
      {children}
    </AuthContext.Provider>
  )
}
