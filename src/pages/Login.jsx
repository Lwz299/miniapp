import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Shield } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isMiniApp, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // If in Mini App and user is already authenticated, redirect to dashboard
    if (isMiniApp && !loading) {
      // Mini App users might already be authenticated via Hylid
      // Check if we should auto-redirect
    }
  }, [isMiniApp, loading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!isMiniApp && !email && !password) {
      setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور')
      return
    }

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول')
      console.error(err)
    }
  }

  const handleMiniAppLogin = async () => {
    try {
      await login('', '')
      navigate('/dashboard')
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gradient-bg)' }}>
      <div className="w-full max-w-md">
        {/* Logo/Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'var(--gradient-hero-insurance)' }}>
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">مرحباً بك</h1>
          <p className="text-muted-foreground">
            {isMiniApp ? 'سجل الدخول عبر حسابك' : 'سجل الدخول للوصول إلى حسابك'}
          </p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">تسجيل الدخول</CardTitle>
            <CardDescription className="text-center">أدخل بياناتك للوصول إلى حسابك</CardDescription>
          </CardHeader>
          <CardContent>
            {isMiniApp ? (
              <div className="space-y-4">
                <Button 
                  onClick={handleMiniAppLogin} 
                  className="w-full h-12 text-base font-semibold rounded-xl"
                  disabled={loading}
                >
                  {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </Button>
                {error && (
                  <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200 flex items-center gap-2">
                    <span className="flex-shrink-0">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200 flex items-center gap-2">
                    <span className="flex-shrink-0">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    dir="ltr"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold">كلمة المرور</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl mt-6">
                  تسجيل الدخول
                </Button>
                <div className="text-center text-sm pt-2">
                  <span className="text-muted-foreground">ليس لديك حساب؟ </span>
                  <Link 
                    to="/register" 
                    className="font-semibold hover:underline transition-all" 
                    style={{ color: 'var(--base-sv-color)' }}
                  >
                    سجل الآن
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
