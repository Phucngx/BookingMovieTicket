import React from 'react'
import { Typography, Avatar, Tooltip } from 'antd'
import { UserOutlined, RobotOutlined, CheckOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import './ChatMessage.css'

const { Text } = Typography

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user'
  const isRead = message.isRead
  const timestamp = new Date(message.timestamp)

  const formatTime = (date) => {
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: vi 
    })
  }

  const renderMessageStatus = () => {
    if (!isUser) return null

    return (
      <div className="message-status">
        {isRead ? (
          <CheckCircleOutlined className="read-icon" />
        ) : (
          <CheckOutlined className="sent-icon" />
        )}
      </div>
    )
  }

  const renderAvatar = () => {
    if (isUser) {
      return (
        <Avatar 
          size={32} 
          icon={<UserOutlined />} 
          className="user-avatar"
          style={{ backgroundColor: '#1890ff' }}
        />
      )
    } else {
      return (
        <Avatar 
          size={32} 
          icon={<RobotOutlined />} 
          className="bot-avatar"
          style={{ backgroundColor: '#52c41a' }}
        />
      )
    }
  }

  const renderMessageContent = () => {
    // Handle different message types
    if (message.type === 'system') {
      return (
        <div className="system-message">
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {message.content}
          </Text>
        </div>
      )
    }

    // Handle text messages
    if (message.type === 'text' || !message.type) {
      return (
        <div className={`message-bubble ${isUser ? 'user-message' : 'bot-message'}`}>
          <div className="message-text">
            {message.content}
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
        {!isUser && (
          <Tooltip title="Hỗ trợ viên" placement="top">
            {renderAvatar()}
          </Tooltip>
        )}
        
        <div className="message-content">
          {renderMessageContent()}
        </div>
        
        {isUser && (
          <Tooltip title="Bạn" placement="top">
            {renderAvatar()}
          </Tooltip>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
