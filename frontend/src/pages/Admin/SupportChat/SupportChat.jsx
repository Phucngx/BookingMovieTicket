import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, List, Avatar, Input, Button, Spin, Typography, Empty, Badge, notification, Popover } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { fetchConversations, setSelectedConversation, fetchMessages, sendMessage } from '../../../store/slices/chatSlice'
import { chatService } from '../../../services/chatService'
import ChatMessage from '../../../components/ChatMessage'

const { Text } = Typography
const { TextArea } = Input

const SupportChat = () => {
  const dispatch = useDispatch()
  const { conversations, loadingConversations, selectedConversationId, messages, loading, sending } = useSelector(s => s.chat)
  const { isAuthenticated } = useSelector(s => s.user)

  const [inputMessage, setInputMessage] = useState('')
  const [showSuggestionButton, setShowSuggestionButton] = useState(true)
  const [openSuggestions, setOpenSuggestions] = useState(false)
  const [suggestions] = useState([
    'Xin chào, mình có thể hỗ trợ gì cho bạn?',
    'Vui lòng cung cấp mã đặt vé hoặc số điện thoại.',
    'Bạn muốn đổi lịch chiếu hay hoàn tiền ạ?',
    'Bạn gặp lỗi ở bước thanh toán hay chọn ghế?',
  ])
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  useEffect(() => {
    dispatch(fetchConversations())
  }, [dispatch])

  // Load hidden state for suggestion feature
  useEffect(() => {
    try {
      const hidden = localStorage.getItem('admin_support_suggestions_hidden') === '1'
      setShowSuggestionButton(!hidden)
    } catch (_) {}
  }, [])

  // Connect Socket.IO on mount and clean up on unmount
  useEffect(() => {
    const handleIncoming = (msg) => {
      try {
        if (!msg) return
        // Always update admin conversation ordering and unread counts
        dispatch({ type: 'chat/updateConversationOnNewMessage', payload: msg })
        dispatch({ type: 'chat/updateConversationUnreadOnIncoming', payload: msg })
        // Append to pane only if message belongs to selected conversation
        if (selectedConversationId && msg.conversationId === selectedConversationId) {
          dispatch({ type: 'chat/addMessage', payload: msg })
          chatService.emitMarkAsRead(selectedConversationId)
          dispatch({ type: 'chat/markConversationAsRead', payload: selectedConversationId })
        } else {
          // If the message is not for the currently opened conversation, show a toast
          if (msg && (msg.me === false || msg.sender === 'other' || msg.isMine === false)) {
            const content = (msg?.message || msg?.content || '').toString().trim()
            notification.open({
              message: 'Tin nhắn mới',
              description: content || 'Bạn có tin nhắn mới',
              placement: 'bottomRight',
            })
          }
        }
      } catch (_) {}
    }
    const handleStatus = (connected) => {
      try { dispatch({ type: 'chat/setConnectionStatus', payload: connected }) } catch (_) {}
    }
    chatService.connectSocketIO(handleIncoming, handleStatus)
    return () => chatService.disconnectSocketIO()
  }, [dispatch, selectedConversationId])

  useEffect(() => {
    if (selectedConversationId) {
      dispatch(fetchMessages())
      // mark as read when a conversation is opened/selected
      chatService.emitMarkAsRead(selectedConversationId)
      dispatch({ type: 'chat/markConversationAsRead', payload: selectedConversationId })
    }
  }, [dispatch, selectedConversationId])

  useEffect(() => {
    try {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
      }
    } catch (_) {}
  }, [messages])

  const handleSelectConversation = (id) => {
    if (id === selectedConversationId) {
      dispatch(fetchMessages())
      // Still mark as read for the same conversation
      chatService.emitMarkAsRead(id)
      dispatch({ type: 'chat/markConversationAsRead', payload: id })
      return
    }
    dispatch(setSelectedConversation(id))
    chatService.emitMarkAsRead(id)
    dispatch({ type: 'chat/markConversationAsRead', payload: id })
  }

  const handleSend = async () => {
    const text = inputMessage.trim()
    if (!text || !selectedConversationId) return
    await dispatch(sendMessage(text))
    setInputMessage('')
  }

  const handleSuggestionClick = (text) => {
    setInputMessage(text)
    setOpenSuggestions(false)
  }

  const handleHideSuggestions = () => {
    try { localStorage.setItem('admin_support_suggestions_hidden', '1') } catch (_) {}
    setShowSuggestionButton(false)
    setOpenSuggestions(false)
  }

  return (
    <div style={{ display: 'flex', gap: 16, height: '75vh', overflow: 'hidden' }}>
      <Card 
        title="Cuộc trò chuyện" 
        style={{ width: 360, height: '100%', overflow: 'hidden' }} 
        bodyStyle={{ padding: 0, height: '100%', overflowY: 'auto' }}
      >
        {loadingConversations ? (
          <div style={{ padding: 16, textAlign: 'center' }}>
            <Spin size="small" />
          </div>
        ) : conversations.length === 0 ? (
          <div style={{ padding: 16 }}>
            <Empty description="Không có cuộc trò chuyện" />
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={conversations}
            renderItem={(item) => {
              const isActive = item.id === selectedConversationId
              return (
                <List.Item
                  onClick={() => handleSelectConversation(item.id)}
                  style={{ cursor: 'pointer', background: isActive ? '#e6f7ff' : 'transparent', paddingLeft: 16, paddingRight: 16 }}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.conversationAvatar || undefined}>{(item.conversationName || 'U')[0]}</Avatar>}
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 600 }}>{item.conversationName || 'Người dùng'}</span>
                        {item.unreadCount > 0 && (
                          <Badge count={item.unreadCount} overflowCount={99} style={{ backgroundColor: '#f5222d' }} />
                        )}
                      </div>
                    }
                    description={
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {new Date(item.modifiedDate || item.createdDate).toLocaleString()}
                      </Text>
                    }
                  />
                </List.Item>
              )
            }}
          />
        )}
      </Card>

      <Card 
        title={selectedConversationId ? 'Tin nhắn' : 'Chọn một cuộc trò chuyện'} 
        style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column' }} 
        bodyStyle={{ display: 'flex', flexDirection: 'column', padding: 0, height: '100%', overflow: 'hidden' }}
      >
        <div ref={messagesContainerRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16 }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: 8 }}>
              <Spin size="small" />
            </div>
          )}
          {!loading && messages.length === 0 && selectedConversationId && (
            <div style={{ padding: 16 }}>
              <Empty description="Chưa có tin nhắn" />
            </div>
          )}
          {messages.map((m, idx) => (
            <ChatMessage
              key={m.id || `${m.conversationId || 'conv'}-${m.createdDate || 'time'}-${idx}`}
              message={m}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div style={{ borderTop: '1px solid #f0f0f0', padding: 12, display: 'flex', gap: 8, flexShrink: 0, background: '#fff' }}>
          {showSuggestionButton && (
            <Popover
              open={openSuggestions}
              onOpenChange={setOpenSuggestions}
              trigger={['click']}
              placement="topLeft"
              overlayStyle={{ maxWidth: 360 }}
              content={
                <div style={{ maxWidth: 340 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text strong style={{ fontSize: 12 }}>Gợi ý nhanh</Text>
                    <Button size="small" type="text" onClick={handleHideSuggestions} style={{ color: '#8c8c8c' }}>Ẩn</Button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSuggestionClick(s)}
                        style={{
                          border: 'none',
                          background: 'linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 100%)',
                          color: '#1677ff',
                          padding: '6px 10px',
                          borderRadius: 14,
                          fontSize: 12,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              }
            >
              <Button size="middle">Gợi ý</Button>
            </Popover>
          )}
          <TextArea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onPressEnter={(e) => { if (!e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder={selectedConversationId ? 'Nhập tin nhắn...' : 'Chọn cuộc trò chuyện để nhắn'}
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={!selectedConversationId}
            style={{ resize: 'none' }}
          />
          <Button type="primary" icon={<SendOutlined />} onClick={handleSend} disabled={!inputMessage.trim() || !selectedConversationId} loading={sending}>
            Gửi
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default SupportChat


