import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { initiatePayment } from '../utils/hylidBridge'
import { Button } from './ui/button'
import { CreditCard, Loader2 } from 'lucide-react'

export default function PaymentButton({ amount, onPaymentSuccess, className }) {
  const { token, isMiniApp } = useAuth()
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    if (!isMiniApp) {
      alert('الدفع متاح فقط في تطبيق الميني آب')
      return
    }

    if (!token) {
      alert('يجب تسجيل الدخول أولاً')
      return
    }

    setLoading(true)
    try {
      await initiatePayment(token)
      if (onPaymentSuccess) {
        onPaymentSuccess()
      }
    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isMiniApp) {
    return null
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={loading || !token}
      className={className}
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
  )
}

