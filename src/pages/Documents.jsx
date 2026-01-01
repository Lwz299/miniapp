import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { Card, CardContent } from '../components/ui/card'
import { useDocuments } from '../context/DocumentsContext'
import { FileText, Download, Plus } from 'lucide-react'
import { downloadPDF } from '../utils/pdfGenerator'

export default function Documents() {
  const { documents } = useDocuments()

  const handleDownload = (e, document) => {
    e.stopPropagation()
    downloadPDF(document)
  }

  return (
    <Layout>
      <div className="p-5 space-y-5">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">الوثائق الصادرة</h1>
          <Link 
            to="/create-document"
            className="p-2 rounded-xl hover:bg-[var(--bg-lighter)] transition-colors"
            style={{ color: 'var(--base-sv-color)' }}
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>

        {documents.length === 0 ? (
          <Card className="border-0 text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="p-4 rounded-full bg-[var(--bg-lighter)] mb-4">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">لا توجد وثائق صادرة</h3>
                <p className="text-sm text-muted-foreground mb-6">ابدأ بإصدار وثيقة تأمين سفر جديدة</p>
                <Link 
                  to="/create-document" 
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{ 
                    backgroundColor: 'var(--base-sv-color)', 
                    color: 'white',
                    boxShadow: '0 4px 14px 0 rgba(95, 191, 80, 0.25)'
                  }}
                >
                  <Plus className="h-4 w-4" />
                  إصدار وثيقة جديدة
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <Link key={doc.id} to={`/documents/${doc.id}`}>
                <Card className="border-0 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-[var(--bg-lighter)] group-hover:bg-[rgba(95,191,80,0.1)] transition-colors">
                            <FileText className="h-5 w-5" style={{ color: 'var(--base-sv-color)' }} />
                          </div>
                          <h3 className="font-bold text-lg group-hover:text-[var(--base-sv-color)] transition-colors truncate">
                            {doc.travelerName}
                          </h3>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {doc.destination}
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          رقم الوثيقة: <span className="font-mono font-semibold">{doc.documentNumber}</span>
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            📅 {new Date(doc.startDate).toLocaleDateString('ar-SA')} - {new Date(doc.endDate).toLocaleDateString('ar-SA')}
                          </span>
                          <span className="flex items-center gap-1">
                            ⏱️ {doc.duration} يوم
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        <span
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${
                            doc.status === 'active'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-gray-100 text-gray-600 border-gray-200'
                          }`}
                        >
                          {doc.status === 'active' ? '✓ نشط' : 'منتهي'}
                        </span>
                        <button
                          onClick={(e) => handleDownload(e, doc)}
                          className="p-2.5 rounded-xl hover:bg-[var(--bg-lighter)] transition-all hover:scale-110"
                          style={{ color: 'var(--base-sv-color)' }}
                          title="تحميل PDF"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
