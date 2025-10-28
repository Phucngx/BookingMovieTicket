import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  requestId: null,
  expireAt: null,
  resendAvailableAt: null,
  isVerifying: false,
  isSending: false,
  error: null,
  uiMessage: null,
  countdown: 0,
  isCountdownActive: false
}

const otpSlice = createSlice({
  name: 'otp',
  initialState,
  reducers: {
    // Gửi OTP
    sendOtpStart: (state) => {
      state.isSending = true
      state.error = null
      state.uiMessage = null
    },
    sendOtpSuccess: (state, action) => {
      state.isSending = false
      state.requestId = action.payload.requestId
      state.expireAt = action.payload.expireAt
      state.resendAvailableAt = action.payload.resendAvailableAt
      state.error = null
      // Bắt đầu countdown 1 phút
      state.countdown = 60
      state.isCountdownActive = true
    },
    sendOtpFailure: (state, action) => {
      state.isSending = false
      state.error = action.payload
    },
    
    // Xác thực OTP
    verifyOtpStart: (state) => {
      state.isVerifying = true
      state.error = null
      state.uiMessage = null
    },
    verifyOtpSuccess: (state, action) => {
      state.isVerifying = false
      state.uiMessage = action.payload.uiMessage
      state.error = null
    },
    verifyOtpFailure: (state, action) => {
      state.isVerifying = false
      state.error = action.payload
    },
    
    // Cập nhật countdown
    updateCountdown: (state) => {
      if (state.countdown > 0) {
        state.countdown -= 1
      } else {
        state.isCountdownActive = false
      }
    },
    
    // Reset OTP state
    resetOtp: (state) => {
      state.requestId = null
      state.expireAt = null
      state.resendAvailableAt = null
      state.isVerifying = false
      state.isSending = false
      state.error = null
      state.uiMessage = null
      state.countdown = 0
      state.isCountdownActive = false
    },
    
    // Clear error và message
    clearOtpMessage: (state) => {
      state.error = null
      state.uiMessage = null
    }
  }
})

export const {
  sendOtpStart,
  sendOtpSuccess,
  sendOtpFailure,
  verifyOtpStart,
  verifyOtpSuccess,
  verifyOtpFailure,
  updateCountdown,
  resetOtp,
  clearOtpMessage
} = otpSlice.actions

export default otpSlice.reducer
