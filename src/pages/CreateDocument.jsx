import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select } from '../components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import PaymentButton from '../components/PaymentButton'
import { useDocuments } from '../context/DocumentsContext'
import { useAuth } from '../context/AuthContext'
import { calculatePrice, getDestinationsByZone } from '../utils/priceCalculator'
import { ArrowLeft } from 'lucide-react'

export default function CreateDocument() {
  const navigate = useNavigate()
  const { createDocument } = useDocuments()
  const { isMiniApp } = useAuth()
  const [step, setStep] = useState(1)
  const [priceInfo, setPriceInfo] = useState(null)
  const [documentCreated, setDocumentCreated] = useState(false)

  // Traveler Data
  const [travelerName, setTravelerName] = useState('')
  const [travelerBirthDate, setTravelerBirthDate] = useState('')
  const [travelerGender, setTravelerGender] = useState('')
  const [passportNumber, setPassportNumber] = useState('')

  // Trip Data
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const destinationsByZone = getDestinationsByZone()
  const allDestinations = [
    ...destinationsByZone.local,
    ...destinationsByZone.regional,
    ...destinationsByZone.international,
  ]

  useEffect(() => {
    if (startDate && endDate && destination) {
      const price = calculatePrice(destination, startDate, endDate)
      setPriceInfo(price)
    }
  }, [destination, startDate, endDate])

  const handleNext = () => {
    if (step === 1) {
      if (!travelerName || !travelerBirthDate || !travelerGender || !passportNumber) {
        alert('الرجاء ملء جميع بيانات المسافر')
        return
      }
      setStep(2)
    }
  }

  const handleSubmit = () => {
    if (!destination || !startDate || !endDate) {
      alert('الرجاء ملء جميع بيانات الرحلة')
      return
    }

    if (!priceInfo) {
      alert('الرجاء التحقق من بيانات الرحلة')
      return
    }

    const document = createDocument({
      travelerName,
      travelerBirthDate,
      travelerGender,
      passportNumber,
      destination,
      startDate,
      endDate,
      duration: priceInfo.duration,
      price: priceInfo.price,
      zone: priceInfo.zone,
    })

    setDocumentCreated(true)
    
    // If not in Mini App, navigate directly
    if (!isMiniApp) {
      navigate(`/documents/${document.id}`)
    }
  }

  const handlePaymentSuccess = () => {
    // After payment success, navigate to document detail
    if (documentCreated) {
      // Find the created document and navigate to it
      const documents = JSON.parse(localStorage.getItem('documents') || '[]')
      const latestDoc = documents[documents.length - 1]
      if (latestDoc) {
        navigate(`/documents/${latestDoc.id}`)
      }
    }
  }

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">إصدار وثيقة تأمين جديدة</h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className={`flex items-center ${step >= 1 ? '' : 'text-gray-400'}`} style={step >= 1 ? { color: 'var(--base-sv-color)' } : {}}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'text-white' : 'bg-gray-200'}`} style={step >= 1 ? { backgroundColor: 'var(--base-sv-color)' } : {}}>
              1
            </div>
            <span className="mr-2 text-sm">بيانات المسافر</span>
          </div>
          <div className={`h-1 w-16 ${step >= 2 ? '' : 'bg-gray-200'}`} style={step >= 2 ? { backgroundColor: 'var(--base-sv-color)' } : {}}></div>
          <div className={`flex items-center ${step >= 2 ? '' : 'text-gray-400'}`} style={step >= 2 ? { color: 'var(--base-sv-color)' } : {}}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'text-white' : 'bg-gray-200'}`} style={step >= 2 ? { backgroundColor: 'var(--base-sv-color)' } : {}}>
              2
            </div>
            <span className="mr-2 text-sm">بيانات الرحلة</span>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>بيانات المسافر</CardTitle>
              <CardDescription>أدخل معلومات المسافر الأساسية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="travelerName">الاسم الكامل</Label>
                <Input
                  id="travelerName"
                  value={travelerName}
                  onChange={(e) => setTravelerName(e.target.value)}
                  placeholder="أدخل الاسم الكامل"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">تاريخ الميلاد</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={travelerBirthDate}
                  onChange={(e) => setTravelerBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">الجنس</Label>
                <Select
                  id="gender"
                  value={travelerGender}
                  onChange={(e) => setTravelerGender(e.target.value)}
                >
                  <option value="">اختر الجنس</option>
                  <option value="ذكر">ذكر</option>
                  <option value="أنثى">أنثى</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="passport">رقم جواز السفر</Label>
                <Input
                  id="passport"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  placeholder="أدخل رقم جواز السفر"
                />
              </div>
              <Button onClick={handleNext} className="w-full">
                التالي
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>بيانات الرحلة</CardTitle>
              <CardDescription>أدخل تفاصيل الرحلة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="destination">بلد الوجهة</Label>
                <Select
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  <option value="">اختر بلد الوجهة</option>
                  {allDestinations.map((dest) => (
                    <option key={dest} value={dest}>
                      {dest}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">تاريخ البداية</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">تاريخ النهاية</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                />
              </div>

              {priceInfo && (
                <Card className="border-2" style={{ backgroundColor: 'rgba(95, 191, 80, 0.1)', borderColor: 'var(--base-sv-color)' }}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">مدة السفر:</span>
                        <span className="font-medium">{priceInfo.duration} يوم</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">المنطقة:</span>
                        <span className="font-medium">
                          {priceInfo.zone === 'local' ? 'محلية' : priceInfo.zone === 'regional' ? 'إقليمية' : 'دولية'}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t" style={{ borderColor: 'var(--base-sv-color)' }}>
                        <span>قيمة القسط:</span>
                        <span style={{ color: 'var(--base-sv-color)' }}>{priceInfo.price} دينار عراقي</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  السابق
                </Button>
                {!documentCreated ? (
                  <Button onClick={handleSubmit} className="flex-1" disabled={!priceInfo}>
                    إصدار الوثيقة
                  </Button>
                ) : isMiniApp ? (
                  <PaymentButton
                    amount={priceInfo?.price || 0}
                    onPaymentSuccess={handlePaymentSuccess}
                    className="flex-1"
                  />
                ) : (
                  <Button onClick={() => {
                    const documents = JSON.parse(localStorage.getItem('documents') || '[]')
                    const latestDoc = documents[documents.length - 1]
                    if (latestDoc) {
                      navigate(`/documents/${latestDoc.id}`)
                    }
                  }} className="flex-1">
                    عرض الوثيقة
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
