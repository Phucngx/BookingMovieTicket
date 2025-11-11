const API_BASE_URL = 'http://localhost:8080/api/v1'

export const otpService = {
  // Gửi OTP
  async sendOtp(email, fullName) {
    try {
      const response = await fetch(`${API_BASE_URL}/user-service/otp/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purpose: 'RESET_PASSWORD',
          channel: 'EMAIL',
          identifier: email,
          fullName: fullName
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể gửi OTP')
      }

      return data.data
    } catch (error) {
      console.error('Send OTP error:', error)
      throw error
    }
  },

  // Xác thực OTP
  async verifyOtp(requestId, code) {
    try {
      const response = await fetch(`${API_BASE_URL}/user-service/otp/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: requestId,
          code: code
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể xác thực OTP')
      }

      return data.data
    } catch (error) {
      console.error('Verify OTP error:', error)
      throw error
    }
  }
}
