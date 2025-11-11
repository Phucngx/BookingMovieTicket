import React, { useEffect, useState } from 'react'
import { Button, Badge, Tooltip } from 'antd'
import { MessageOutlined, CloseOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { toggleChatWindow, getUnreadCount } from '../../store/slices/chatSlice'
import ChatWindow from '../ChatWindow'
import './ChatWidget.css'

const ChatWidget = () => {
  const dispatch = useDispatch()
  const { userInfo, isAuthenticated } = useSelector(state => state.user)
  const { chatWindowOpen, unreadCount, isConnected } = useSelector(state => state.chat)
  
  const [isVisible, setIsVisible] = useState(false)

  // Hiển thị chat widget cho tất cả user (trừ admin)
  const shouldShowChat = !isAuthenticated || userInfo?.roleName !== 'ADMIN'

  useEffect(() => {
    if (shouldShowChat) {
      setIsVisible(true)
      // Lấy số tin nhắn chưa đọc khi component mount (chỉ khi đã đăng nhập)
      if (isAuthenticated) {
        dispatch(getUnreadCount())
      }
    } else {
      setIsVisible(false)
    }
  }, [shouldShowChat, dispatch, isAuthenticated])

  const handleToggleChat = () => {
    dispatch(toggleChatWindow())
    // ChatWindow sẽ tự xử lý việc khởi tạo conversation khi mở
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="chat-widget">
      {/* Chat Window */}
      {chatWindowOpen && <ChatWindow />}
      
      {/* Chat Button */}
      <Tooltip 
        title={chatWindowOpen ? "Đóng chat" : "Mở chat hỗ trợ"} 
        placement="left"
      >
        <Badge 
          count={unreadCount} 
          size="small"
          offset={[-5, 5]}
          style={{ 
            backgroundColor: '#ff4d4f',
            display: unreadCount > 0 ? 'block' : 'none'
          }}
        >
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={chatWindowOpen ? <CloseOutlined /> : <MessageOutlined />}
            onClick={handleToggleChat}
            className={`chat-toggle-btn ${chatWindowOpen ? 'active' : ''}`}
            style={{
              backgroundColor: isConnected ? '#52c41a' : '#1890ff',
              borderColor: isConnected ? '#52c41a' : '#1890ff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              width: '56px',
              height: '56px',
              fontSize: '20px'
            }}
          />
        </Badge>
      </Tooltip>
      
      {/* Connection Status Indicator */}
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        <div className="status-dot"></div>
        <span className="status-text">
          {isConnected ? 'Đã kết nối' : 'Mất kết nối'}
        </span>
      </div>
    </div>
  )
}

export default ChatWidget
