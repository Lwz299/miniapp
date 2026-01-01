import { useState } from 'react'
import Layout from '../components/Layout'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useAuth } from '../context/AuthContext'
import { User } from 'lucide-react'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState('')

  const handleSave = () => {
    updateProfile({ name, email })
    setIsEditing(false)
    setMessage('تم تحديث الملف الشخصي بنجاح')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">الملف الشخصي</h1>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(95, 191, 80, 0.1)' }}>
                <User className="h-8 w-8" style={{ color: 'var(--base-sv-color)' }} />
              </div>
              <div>
                <CardTitle>{user?.name}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md border border-green-200">
                {message}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">الاسم</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                dir="ltr"
              />
            </div>

            {isEditing ? (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1">
                  حفظ التغييرات
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setName(user?.name || '')
                    setEmail(user?.email || '')
                    setIsEditing(false)
                  }}
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="w-full">
                تعديل الملف الشخصي
              </Button>
            )}

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                تاريخ الانضمام: {new Date(user?.createdAt).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

