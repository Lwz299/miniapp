import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useDocuments } from '../context/DocumentsContext'
import { downloadPDF } from '../utils/pdfGenerator'
import PaymentButton from '../components/PaymentButton'
import { ArrowLeft, Download, FileText } from 'lucide-react'

export default function DocumentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getDocumentById } = useDocuments()
  const document = getDocumentById(id)

  if (!document) {
    return (
      <Layout>
        <div className="p-4">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">الوثيقة غير موجودة</p>
              <Button onClick={() => navigate('/documents')} className="mt-4">
                العودة للوثائق
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">تفاصيل الوثيقة</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl mb-2">وثيقة تأمين سفر</CardTitle>
                <p className="text-sm text-muted-foreground">رقم الوثيقة: {document.documentNumber}</p>
              </div>
              <span
                className={`px-3 py-1 text-sm rounded ${
                  document.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {document.status === 'active' ? 'نشط' : 'منتهي'}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Traveler Information */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                معلومات المسافر
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">الاسم:</span>
                  <span className="font-medium">{document.travelerName}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">تاريخ الميلاد:</span>
                  <span className="font-medium">{document.travelerBirthDate}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">الجنس:</span>
                  <span className="font-medium">{document.travelerGender}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">رقم جواز السفر:</span>
                  <span className="font-medium">{document.passportNumber}</span>
                </div>
              </div>
            </div>

            {/* Trip Information */}
            <div>
              <h3 className="font-semibold mb-3">معلومات الرحلة</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">بلد الوجهة:</span>
                  <span className="font-medium">{document.destination}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">تاريخ البداية:</span>
                  <span className="font-medium">
                    {new Date(document.startDate).toLocaleDateString('ar-SA')}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">تاريخ النهاية:</span>
                  <span className="font-medium">
                    {new Date(document.endDate).toLocaleDateString('ar-SA')}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">مدة السفر:</span>
                  <span className="font-medium">{document.duration} يوم</span>
                </div>
              </div>
            </div>

            {/* Price Information */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(95, 191, 80, 0.1)' }}>
              <h3 className="font-semibold mb-3">معلومات السعر</h3>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">قيمة القسط:</span>
                <span className="text-2xl font-bold" style={{ color: 'var(--base-sv-color)' }}>{document.price} دينار عراقي</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => downloadPDF(document)}
                className="flex-1"
                variant="outline"
              >
                <Download className="h-4 w-4 ml-2" />
                تحميل PDF
              </Button>
              <PaymentButton
                amount={document.price}
                onPaymentSuccess={() => {
                  // Handle payment success if needed
                }}
                className="flex-1"
              />
            </div>

            <div className="text-xs text-muted-foreground pt-4 border-t">
              <p>تاريخ الإصدار: {new Date(document.createdAt).toLocaleDateString('ar-SA', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

