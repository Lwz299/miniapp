// Hylid Bridge utilities for Mini App

/**
 * Check if running in Hylid Mini App environment
 */
export const isHylidMiniApp = () => {
  return typeof window !== 'undefined' && window.my && typeof window.my.getAuthCode === 'function'
}

/**
 * Get authentication code from Hylid Mini App
 */
export const getHylidAuthCode = (scopes = ['auth_base', 'USER_ID']) => {
  return new Promise((resolve, reject) => {
    if (!isHylidMiniApp()) {
      reject(new Error('Not running in Hylid Mini App environment'))
      return
    }

    window.my.getAuthCode({
      scopes: scopes,
      success: (res) => {
        resolve(res.authCode)
      },
      fail: (res) => {
        reject(new Error(`Auth failed: ${JSON.stringify(res)}`))
      },
    })
  })
}

/**
 * Authenticate with SuperQi API
 */
export const authenticateWithSuperQi = async (authCode) => {
  try {
    const response = await fetch('https://its.mouamle.space/api/auth-with-superQi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: authCode
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Authentication error:', error)
    throw error
  }
}

/**
 * Show alert in Mini App
 */
export const showHylidAlert = (content) => {
  if (isHylidMiniApp() && window.my.alert) {
    window.my.alert({
      content: content
    })
  } else {
    alert(content)
  }
}

/**
 * Initiate payment process
 */
export const initiatePayment = async (token) => {
  try {
    if (!isHylidMiniApp()) {
      throw new Error('Payment is only available in Mini App environment')
    }

    const response = await fetch('https://its.mouamle.space/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return new Promise((resolve, reject) => {
      window.my.tradePay({
        paymentUrl: data.url,
        success: (res) => {
          resolve(res)
          showHylidAlert('تم الدفع بنجاح')
        },
        fail: (res) => {
          reject(new Error(`Payment failed: ${JSON.stringify(res)}`))
          showHylidAlert('فشل الدفع')
        },
      })
    })
  } catch (error) {
    console.error('Payment error:', error)
    showHylidAlert('فشل عملية الدفع')
    throw error
  }
}

/**
 * Complete authentication flow for Hylid Mini App
 */
export const authenticateHylidUser = async () => {
  try {
    // Get auth code from Hylid
    const authCode = await getHylidAuthCode()
    
    // Authenticate with SuperQi API
    const responseData = await authenticateWithSuperQi(authCode)
    
    return {
      success: true,
      authCode,
      token: responseData.token,
      userData: responseData
    }
  } catch (error) {
    console.error('Hylid authentication error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
