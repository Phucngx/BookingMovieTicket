import React, { useEffect, useRef, useState } from 'react'
import { Card, Input, Button, Typography, Spin, Empty, message } from 'antd'
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { sendMessage, fetchMessages, markAllAsRead } from '../../store/slices/chatSlice'
import { chatService } from '../../services/chatService'
import ChatMessage from '../ChatMessage'
import './ChatWindow.css'

const { Text } = Typography
const { TextArea } = Input

const ChatWindow = () => {
  const dispatch = useDispatch()
  const { userInfo, isAuthenticated } = useSelector(state => state.user)
  const { messages, loading, sending, isConnected } = useSelector(state => state.chat)
  
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load messages when chat window opens
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMessages({ page: 1, limit: 50 }))
      dispatch(markAllAsRead())
    }
  }, [dispatch, isAuthenticated])

  // WebSocket connection
  useEffect(() => {
    if (isAuthenticated) {
      const handleWebSocketMessage = (data) => {
        if (data.type === 'message') {
          dispatch({ type: 'chat/addMessage', payload: data.message })
        } else if (data.type === 'typing') {
          setIsTyping(data.isTyping)
        }
      }

      const handleConnectionChange = (connected) => {
        dispatch({ type: 'chat/setConnectionStatus', payload: connected })
      }

      chatService.connectWebSocket(handleWebSocketMessage, handleConnectionChange)

      return () => {
        chatService.disconnectWebSocket()
      }
    }
  }, [dispatch, isAuthenticated])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để sử dụng tính năng chat')
      return
    }

    const messageData = {
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    }

    try {
      // Send via WebSocket if connected, otherwise via API
      if (isConnected && chatService.isConnected()) {
        chatService.sendWebSocketMessage(messageData)
      } else {
        await dispatch(sendMessage(messageData)).unwrap()
      }
      
      setInputMessage('')
    } catch (error) {
      message.error('Không thể gửi tin nhắn. Vui lòng thử lại.')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInputChange = (e) => {
    setInputMessage(e.target.value)
    
    // Send typing indicator
    if (isAuthenticated && isConnected) {
      chatService.sendWebSocketMessage({
        type: 'typing',
        isTyping: e.target.value.length > 0
      })
    }
  }

  const renderWelcomeMessage = () => (
    <div className="welcome-message">
      <div className="welcome-icon">
        <RobotOutlined />
      </div>
      <div className="welcome-content">
        <Text strong>Chào mừng bạn đến với hệ thống hỗ trợ!</Text>
        <Text type="secondary">
          Chúng tôi ở đây để giúp bạn. Hãy gửi tin nhắn để bắt đầu cuộc trò chuyện.
        </Text>
      </div>
    </div>
  )

  const renderLoginPrompt = () => (
    <div className="login-prompt">
      <div className="login-icon">
        <UserOutlined />
      </div>
      <div className="login-content">
        <Text strong>Đăng nhập để sử dụng chat</Text>
        <Text type="secondary">
          Vui lòng đăng nhập để có thể gửi tin nhắn và nhận hỗ trợ từ chúng tôi.
        </Text>
      </div>
    </div>
  )

  return (
    <Card className="chat-window" ref={chatContainerRef}>
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar">
            <RobotOutlined />
          </div>
          <div className="chat-title">
            <Text strong>Hỗ trợ khách hàng</Text>
            <div className="chat-status">
              <div className={`status-indicator ${isConnected ? 'online' : 'offline'}`}></div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {isConnected ? 'Đang hoạt động' : 'Không kết nối'}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="chat-messages">
        {loading ? (
          <div className="chat-loading">
            <Spin size="small" />
            <Text type="secondary">Đang tải tin nhắn...</Text>
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-empty">
            {isAuthenticated ? renderWelcomeMessage() : renderLoginPrompt()}
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Đang nhập...
                </Text>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="chat-input">
        <div className="input-container">
          <TextArea
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={isAuthenticated ? "Nhập tin nhắn..." : "Đăng nhập để gửi tin nhắn"}
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={!isAuthenticated}
            className="message-input"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            loading={sending}
            disabled={!inputMessage.trim() || !isAuthenticated}
            className="send-button"
          />
        </div>
        {!isAuthenticated && (
          <div className="login-hint">
            <Text type="secondary" style={{ fontSize: '11px' }}>
              💡 Đăng nhập để sử dụng tính năng chat
            </Text>
          </div>
        )}
      </div>
    </Card>
  )
}

export default ChatWindow
