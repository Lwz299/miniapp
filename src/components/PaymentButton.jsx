import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { initiatePayment, isHylidMiniApp } from '../utils/hylidBridge'
import { Button } from './ui/button'
import { CreditCard, Loader2 } from 'lucide-react'

export default function PaymentButton({ amount, onPaymentSuccess, className }) {
  const { token, isMiniApp, reauthenticate } = useAuth()
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    if (!isMiniApp) {
      alert('الدفع متاح فقط في تطبيق الميني آب')
      return
    }

    // Check if we have token, if not try to get it
    let currentToken = token
    
    if (!currentToken) {
      // Try to get from localStorage
      currentToken = localStorage.getItem('token')
      
      // If still no token, try to reauthenticate
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

  if (!isMiniApp) {
    return null
  }

  // Show button even if token is missing, but it will try to get token on click
  const isDisabled = loading

  return (
    <Button
      onClick={handlePayment}
      disabled={isDisabled}
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
