import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { initiatePayment, scanQRCode, initiatePaymentFromQR, isHylidMiniApp } from '../utils/hylidBridge'
import { Button } from './ui/button'
import { CreditCard, QrCode, Loader2, ChevronDown } from 'lucide-react'

export default function PaymentButton({ amount, onPaymentSuccess, className }) {
  const { token, isMiniApp, reauthenticate } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showQROption, setShowQROption] = useState(false)
  const [qrLoading, setQrLoading] = useState(false)

  const getToken = async () => {
    let currentToken = token
    
    if (!currentToken) {
      currentToken = localStorage.getItem('token')
      
      if (!currentToken) {
        try {
          const success = await reauthenticate()
          if (success) {
            currentToken = localStorage.getItem('token')
          }
        } catch (error) {
          console.error('Reauthentication error:', error)
        }
      }
    }

    return currentToken
  }

  const handlePayment = async () => {
    if (!isMiniApp) {
      alert('الدفع متاح فقط في تطبيق الميني آب')
      return
    }

    const currentToken = await getToken()
    if (!currentToken) {
      alert('يجب تسجيل الدخول أولاً. يرجى تسجيل الدخول ثم المحاولة مرة أخرى.')
      return
    }

    setLoading(true)
    try {
      await initiatePayment(currentToken)
      if (onPaymentSuccess) {
        onPaymentSuccess()
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert(`حدث خطأ أثناء الدفع: ${error.message || 'يرجى المحاولة مرة أخرى'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleQRPayment = async () => {
    if (!isMiniApp) {
      alert('الدفع متاح فقط في تطبيق الميني آب')
      return
    }

    setQrLoading(true)
    try {
      // Scan QR code
      const qrData = await scanQRCode()
      
      if (!qrData.invoiceId || !qrData.amount) {
        alert('رمز QR غير صحيح. يجب أن يحتوي على invoiceId و amount')
        setQrLoading(false)
        return
      }

      // Get token
      const currentToken = await getToken()
      if (!currentToken) {
        alert('يجب تسجيل الدخول أولاً. يرجى تسجيل الدخول ثم المحاولة مرة أخرى.')
        setQrLoading(false)
        return
      }

      // Initiate payment with QR data
      await initiatePaymentFromQR(qrData.invoiceId, qrData.amount, currentToken)
      
      if (onPaymentSuccess) {
        onPaymentSuccess()
      }
    } catch (error) {
      console.error('QR Payment error:', error)
      alert(`حدث خطأ أثناء الدفع عبر QR: ${error.message || 'يرجى المحاولة مرة أخرى'}`)
    } finally {
      setQrLoading(false)
      setShowQROption(false)
    }
  }

  if (!isMiniApp) {
    return null
  }

  const isDisabled = loading || qrLoading

  return (
    <div className={`space-y-2 ${className}`}>
      {!showQROption ? (
        <div className="flex gap-2">
          <Button
            onClick={handlePayment}
            disabled={isDisabled}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 ml-2" />
                دفع {amount} دينار عراقي
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowQROption(true)}
            disabled={isDisabled}
            className="px-4"
            title="الدفع عبر QR Code"
          >
            <QrCode className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <Button
            onClick={handleQRPayment}
            disabled={isDisabled}
            className="w-full"
          >
            {qrLoading ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              <>
                <QrCode className="h-4 w-4 ml-2" />
                الدفع عبر QR Code
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowQROption(false)}
            disabled={isDisabled}
            className="w-full"
          >
            <ChevronDown className="h-4 w-4 ml-2 rotate-180" />
            إلغاء
          </Button>
        </div>
      )}
    </div>
  )
}
