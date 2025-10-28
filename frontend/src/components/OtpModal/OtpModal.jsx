import React, { useState, useEffect, useRef } from 'react'
import { Modal, Input, Button, message, Typography, Space, Alert } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { 
  sendOtpStart, 
  sendOtpSuccess, 
  sendOtpFailure,
  verifyOtpStart,
  verifyOtpSuccess,
  verifyOtpFailure,
  resetOtp,
  clearOtpMessage
} from '../../store/slices/otpSlice'
import { otpService } from '../../services/otpService'
import './OtpModal.css'

const { Title, Text } = Typography

const OtpModal = ({ 
  visible, 
  onCancel, 
  onSuccess, 
  email, 
  fullName 
}) => {
  const dispatch = useDispatch()
  const { 
    requestId, 
    isSending, 
    isVerifying, 
    error, 
    uiMessage, 
    resendAvailableAt 
  } = useSelector(state => state.otp)
  
  const [otpCode, setOtpCode] = useState('')
  const timerRef = useRef(null)
  const [secondsLeft, setSecondsLeft] = useState(0)

  // Countdown based on resendAvailableAt
  useEffect(() => {
    const computeLeft = () => {
      if (!resendAvailableAt) return 0
      const target = new Date(resendAvailableAt).getTime()
      const now = Date.now()
      const diffMs = target - now
      return diffMs > 0 ? Math.ceil(diffMs / 1000) : 0
    }

    setSecondsLeft(computeLeft())

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (visible && computeLeft() > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          const next = computeLeft()
          if (next <= 0 && timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
          return next
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [resendAvailableAt, visible])

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      dispatch(clearOtpMessage())
      setOtpCode('')
    }
  }, [visible, dispatch])

  const handleSendOtp = async () => {
    try {
      dispatch(sendOtpStart())
      const data = await otpService.sendOtp(email, fullName)
      dispatch(sendOtpSuccess(data))
    } catch (error) {
      dispatch(sendOtpFailure(error.message))
      message.error(error.message || 'Không thể gửi OTP')
    }
  }

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      message.error('Vui lòng nhập đúng mã OTP 6 số')
      return
    }

    try {
      dispatch(verifyOtpStart())
      const data = await otpService.verifyOtp(requestId, otpCode)
      dispatch(verifyOtpSuccess(data))
      
      if (data.verified) {
        onSuccess()
      } else {
        message.error(data.uiMessage || 'Mã OTP không hợp lệ')
      }
    } catch (error) {
      dispatch(verifyOtpFailure(error.message))
      message.error(error.message || 'Không thể xác thực OTP')
    }
  }

  const handleResendOtp = () => {
    if (secondsLeft > 0) return
    handleSendOtp()
  }

  const handleCancel = () => {
    dispatch(resetOtp())
    onCancel()
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Modal
      title="Xác thực OTP"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={380}
      destroyOnClose
      className="otp-modal"
    >
      <div className="otp-modal-content">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="otp-header">
            <Title level={4}>Nhập mã OTP</Title>
            <Text type="secondary">
              Chúng tôi đã gửi mã xác thực 6 số đến email <strong>{email}</strong>
            </Text>
          </div>

          {uiMessage && (
            <Alert
              message={uiMessage}
              type={uiMessage.includes('không hợp lệ') ? 'error' : 'info'}
              showIcon
            />
          )}

          <div className="otp-input-section">
            <Text strong>Mã OTP:</Text>
            <Input
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Nhập mã OTP 6 số"
              maxLength={6}
              size="large"
              className="otp-input"
            />
          </div>

          <div className="otp-actions">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Button
                type="primary"
                size="large"
                onClick={handleVerifyOtp}
                loading={isVerifying}
                disabled={!otpCode || otpCode.length !== 6}
                block
              >
                Xác thực OTP
              </Button>

              <div className="resend-section">
                <Text type="secondary">
                  Không nhận được mã? 
                </Text>
                <Button
                  type="link"
                  onClick={handleResendOtp}
                  loading={isSending}
                  disabled={secondsLeft > 0}
                  className="resend-button"
                >
                  {secondsLeft > 0 
                    ? `Gửi lại sau ${formatTime(secondsLeft)}` 
                    : 'Gửi lại OTP'
                  }
                </Button>
              </div>
            </Space>
          </div>
        </Space>
      </div>
    </Modal>
  )
}

export default OtpModal
