import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useDocuments } from '../context/DocumentsContext'
import { FileText, Plus, Shield, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const { documents } = useDocuments()
  const activeDocuments = documents.filter(doc => doc.status === 'active')

  return (
    <Layout>
      <div className="p-5 space-y-5">
        {/* Welcome Card */}
        <Card className="text-white border-0 overflow-hidden relative" style={{ background: 'var(--gradient-hero-insurance)' }}>
          <div className="absolute inset-0 bg-black/5"></div>
          <CardHeader className="relative z-10 pb-4">
            <CardTitle className="text-2xl font-bold mb-2">مرحباً بك 👋</CardTitle>
            <CardDescription className="text-white/95 text-base">
              إصدار وثيقة تأمين سفر جديدة أو إدارة وثائقك الحالية
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="card-stats border-0">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">الوثائق النشطة</p>
                  <p className="text-3xl font-bold" style={{ color: 'var(--base-sv-color)' }}>{activeDocuments.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">وثيقة نشطة</p>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(95, 191, 80, 0.15)' }}>
                  <Shield className="h-6 w-6" style={{ color: 'var(--base-sv-color)' }} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-stats border-0">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">إجمالي الوثائق</p>
                  <p className="text-3xl font-bold" style={{ color: 'var(--main-sv-color)' }}>{documents.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">وثيقة إجمالية</p>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(63, 127, 52, 0.15)' }}>
                  <FileText className="h-6 w-6" style={{ color: 'var(--main-sv-color)' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create New Document Button */}
        <Link to="/create-document" className="block">
          <Button className="w-full h-14 text-base font-semibold rounded-2xl shadow-lg" size="lg">
            <Plus className="h-5 w-5 ml-2" />
            إصدار وثيقة تأمين جديدة
          </Button>
        </Link>

        {/* Recent Documents */}
        {documents.length > 0 && (
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">الوثائق الأخيرة</CardTitle>
                  <CardDescription className="mt-1">عرض آخر الوثائق الصادرة</CardDescription>
                </div>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.slice(0, 3).map((doc) => (
                  <Link
                    key={doc.id}
                    to={`/documents/${doc.id}`}
                    className="block p-4 border border-border/50 rounded-xl hover:border-[var(--base-sv-color)]/30 hover:bg-gradient-to-r hover:from-[var(--base-sv-color)]/5 hover:to-transparent transition-all duration-200 group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="h-4 w-4 text-muted-foreground group-hover:text-[var(--base-sv-color)] transition-colors" />
                          <p className="font-semibold text-base group-hover:text-[var(--base-sv-color)] transition-colors">{doc.travelerName}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{doc.destination}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(doc.createdAt).toLocaleDateString('ar-SA', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                          doc.status === 'active'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {doc.status === 'active' ? '✓ نشط' : 'منتهي'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              {documents.length > 3 && (
                <Link 
                  to="/documents" 
                  className="block text-center text-sm font-medium mt-5 py-2 rounded-lg hover:bg-[var(--bg-lighter)] transition-colors" 
                  style={{ color: 'var(--base-sv-color)' }}
                >
                  عرض جميع الوثائق →
                </Link>
              )}
            </CardContent>
          </Card>
        )}
        
        {documents.length === 0 && (
          <Card className="border-0 text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="p-4 rounded-full bg-[var(--bg-lighter)] mb-4">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">لا توجد وثائق بعد</h3>
                <p className="text-sm text-muted-foreground mb-6">ابدأ بإصدار وثيقة تأمين سفر جديدة</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
