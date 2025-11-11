import React, { useEffect, useRef, useState } from 'react'
import { Card, Input, Button, Typography, Spin, Empty, message } from 'antd'
import { SendOutlined, UserOutlined, RobotOutlined, CustomerServiceOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { sendMessage, fetchMessages, markAllAsRead, createConversation, getConversationByType, clearChat, setChatType } from '../../store/slices/chatSlice'
import { chatService } from '../../services/chatService'
import ChatMessage from '../ChatMessage'
import './ChatWindow.css'

const { Text } = Typography
const { TextArea } = Input

const ChatWindow = () => {
  const dispatch = useDispatch()
  const { userInfo, isAuthenticated } = useSelector(state => state.user)
  const { messages, loading, sending, isConnected, conversationId, creating, chatType, chatbotThinking, loadingConversations } = useSelector(state => state.chat)
  
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showChatTypeSelection, setShowChatTypeSelection] = useState(false)
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  // Scroll to bottom when new messages arrive
  const firstScrollDoneRef = useRef(false)
  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }

  useEffect(() => {
    if (!firstScrollDoneRef.current) {
      scrollToBottom('auto')
      firstScrollDoneRef.current = true
    } else {
      scrollToBottom('smooth')
    }
  }, [messages])

  // Kiểm tra xem có cần hiển thị selection UI không
  useEffect(() => {
    if (isAuthenticated && !conversationId && !chatType) {
      setShowChatTypeSelection(true)
    } else {
      setShowChatTypeSelection(false)
    }
  }, [isAuthenticated, conversationId, chatType])

  // Load messages khi đã có conversationId (chỉ khi chat window mở)
  useEffect(() => {
    if (isAuthenticated && conversationId && chatType && !showChatTypeSelection) {
      dispatch(fetchMessages())
      dispatch(markAllAsRead())
    }
  }, [dispatch, isAuthenticated, conversationId, chatType, showChatTypeSelection])

  // WebSocket connection
  useEffect(() => {
    if (isAuthenticated) {
      const handleIncoming = (msg) => {
        try {
          // Only append messages for current conversation
          if (!msg) return
          if (msg.conversationId && conversationId && msg.conversationId !== conversationId) return
          // Normalize: ensure boolean me is respected from backend
          // Dispatch to store to render immediately
          dispatch({ type: 'chat/addMessage', payload: msg })
        } catch (_) {}
      }

      const handleStatus = (connected) => {
        try { dispatch({ type: 'chat/setConnectionStatus', payload: connected }) } catch (_) {}
      }

      chatService.connectSocketIO(handleIncoming, handleStatus)
      return () => {
        chatService.disconnectSocketIO()
      }
    }
  }, [dispatch, isAuthenticated, conversationId])

  // Emit markAsRead when user has an active conversation (open chat)
  useEffect(() => {
    if (isAuthenticated && conversationId) {
      chatService.emitMarkAsRead(conversationId)
      dispatch({ type: 'chat/markConversationAsRead', payload: conversationId })
    }
  }, [dispatch, isAuthenticated, conversationId])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để sử dụng tính năng chat')
      return
    }

    try {
      const text = inputMessage.trim()
      setInputMessage('')
      await dispatch(sendMessage(text)).unwrap()
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
    // if (isAuthenticated && isConnected) {
    //   chatService.sendWebSocketMessage({
    //     type: 'typing',
    //     isTyping: e.target.value.length > 0
    //   })
    // }
  }

  // Xử lý khi người dùng chọn loại chat
  const handleSelectChatType = async (type) => {
    try {
      // Xoá tin nhắn hiện tại để tránh hiển thị lẫn khi chuyển nhanh giữa 2 cuộc trò chuyện
      dispatch({ type: 'chat/clearMessages' })
      // Thử lấy conversation theo type
      const result = await dispatch(getConversationByType(type)).unwrap()
      
      if (result?.conversation?.id) {
        // Đã có conversation, useEffect sẽ tự động load messages
        setShowChatTypeSelection(false)
      } else {
        // Chưa có conversation, tạo mới
        await dispatch(createConversation({ type })).unwrap()
        // useEffect sẽ tự động load messages sau khi conversationId được set
        setShowChatTypeSelection(false)
      }
      
      // Đánh dấu đã đọc sẽ được gọi trong useEffect
    } catch (error) {
      message.error('Không thể khởi tạo cuộc trò chuyện. Vui lòng thử lại.')
      console.error('Error selecting chat type:', error)
      setShowChatTypeSelection(true) // Hiển thị lại selection nếu lỗi
    }
  }

  const renderChatTypeSelection = () => (
    <div className="chat-type-selection">
      <div className="selection-header">
        <Text strong style={{ fontSize: '16px' }}>Chọn loại hỗ trợ</Text>
        <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
          Bạn muốn chat với ai?
        </Text>
      </div>
      <div className="selection-options">
        <Button
          type="default"
          size="large"
          icon={<CustomerServiceOutlined />}
          onClick={() => handleSelectChatType('LIVECHAT')}
          loading={loadingConversations && chatType === 'LIVECHAT'}
          className="chat-type-btn"
          style={{
            width: '100%',
            height: '60px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontWeight: 500 }}>Chat với Admin</div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Hỗ trợ trực tiếp từ nhân viên</div>
          </div>
        </Button>
        <Button
          type="default"
          size="large"
          icon={<RobotOutlined />}
          onClick={() => handleSelectChatType('CHATBOT')}
          loading={loadingConversations && chatType === 'CHATBOT'}
          className="chat-type-btn"
          style={{
            width: '100%',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontWeight: 500 }}>Chat với Bot</div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Hỗ trợ tự động 24/7</div>
          </div>
        </Button>
      </div>
    </div>
  )

  const renderWelcomeMessage = () => (
    <div className="welcome-message">
      <div className="welcome-icon">
        {chatType === 'CHATBOT' ? <RobotOutlined /> : <CustomerServiceOutlined />}
      </div>
      <div className="welcome-content">
        <Text strong>
          {chatType === 'CHATBOT' 
            ? 'Chào mừng bạn đến với Chatbot!' 
            : 'Chào mừng bạn đến với hệ thống hỗ trợ!'}
        </Text>
        <Text type="secondary">
          {chatType === 'CHATBOT'
            ? 'Tôi có thể giúp bạn trả lời các câu hỏi. Hãy gửi tin nhắn để bắt đầu!'
            : 'Chúng tôi ở đây để giúp bạn. Hãy gửi tin nhắn để bắt đầu cuộc trò chuyện.'}
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
            {chatType === 'CHATBOT' ? <RobotOutlined /> : <CustomerServiceOutlined />}
          </div>
          <div className="chat-title">
            <Text strong>
              {chatType === 'CHATBOT' ? 'Chatbot hỗ trợ' : 'Hỗ trợ khách hàng'}
            </Text>
            <div className="chat-status">
              <div className={`status-indicator ${isConnected ? 'online' : 'offline'}`}></div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {chatType === 'CHATBOT' 
                  ? 'Sẵn sàng' 
                  : (isConnected ? 'Đang hoạt động' : 'Không kết nối')}
              </Text>
            </div>
            {/* Quick switch between Admin and Chatbot */}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Button
                size="small"
                type={chatType === 'LIVECHAT' ? 'primary' : 'default'}
                onClick={() => handleSelectChatType('LIVECHAT')}
                disabled={!isAuthenticated}
              >
                Admin
              </Button>
              <Button
                size="small"
                type={chatType === 'CHATBOT' ? 'primary' : 'default'}
                onClick={() => handleSelectChatType('CHATBOT')}
                disabled={!isAuthenticated}
              >
                Chatbot
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="chat-messages">
        {showChatTypeSelection ? (
          <div className="chat-empty">
            {renderChatTypeSelection()}
          </div>
        ) : loading ? (
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
            {messages.map((msg, idx) => (
              <ChatMessage key={msg.id || `${msg.conversationId || 'conv'}-${msg.createdDate || 'time'}-${idx}`}
                message={msg}
              />
            ))}
            {(chatbotThinking || isTyping) && (
              <div className="typing-indicator">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <Text type="secondary" className="typing-text">
                  {chatbotThinking ? 'Chatbot đang suy nghĩ...' : 'Đang nhập...'}
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
            placeholder={isAuthenticated ? (conversationId ? "Nhập tin nhắn..." : "Chọn loại chat để bắt đầu") : "Đăng nhập để gửi tin nhắn"}
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={!isAuthenticated || !conversationId || showChatTypeSelection}
            className="message-input"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            loading={sending}
            disabled={!inputMessage.trim() || !isAuthenticated || !conversationId}
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
