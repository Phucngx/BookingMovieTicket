import React from 'react'
import { Typography } from 'antd'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import './ChatMessage.css'

const { Text } = Typography

const ChatMessage = ({ message }) => {
  const isUser = !!message.me
  const timestamp = message && message.createdDate ? new Date(message.createdDate) : null

  const formatTime = (date) => {
    try {
      if (!date || isNaN(date.getTime())) return ''
      return formatDistanceToNow(date, { addSuffix: true, locale: vi })
    } catch (_) {
      return ''
    }
  }

  const renderMessageStatus = () => null

  const renderAvatar = () => null

  const renderMessageContent = () => {
    // Handle different message types
    if (message.type === 'system') {
      return (
        <div className="system-message">
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {message.message}
          </Text>
        </div>
      )
    }

    // Handle text messages
    if (!message.type || message.type === 'text') {
      return (
        <div className={`message-bubble ${isUser ? 'user-message' : 'bot-message'}`}>
          <div className="message-text">
          {message.message}
          </div>
          <div className="message-meta">
            <Text type="secondary" style={{ fontSize: '11px' }}>
              {formatTime(timestamp)}
            </Text>
            {renderMessageStatus()}
          </div>
        </div>
      )
    }

    // Handle other message types (images, files, etc.)
    return (
      <div className={`message-bubble ${isUser ? 'user-message' : 'bot-message'}`}>
        <div className="message-text">
          <Text type="secondary">Tin nhắn không được hỗ trợ</Text>
        </div>
        <div className="message-meta">
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {formatTime(timestamp)}
          </Text>
          {renderMessageStatus()}
        </div>
      </div>
    )
  }

  if (message.type === 'system') {
    return (
      <div className="chat-message system">
        {renderMessageContent()}
      </div>
    )
  }

  return (
    <div className={`chat-message ${isUser ? 'user' : 'bot'}`}>
      <div className="message-container">
        <div className="message-content">
          {renderMessageContent()}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
