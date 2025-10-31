import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, List, Avatar, Input, Button, Spin, Typography, Empty } from 'antd'
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
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  useEffect(() => {
    dispatch(fetchConversations())
  }, [dispatch])

  // Connect Socket.IO on mount and clean up on unmount
  useEffect(() => {
    const handleIncoming = (msg) => {
      try {
        if (!msg) return
        // Only auto-append if it belongs to the selected conversation
        if (selectedConversationId && msg.conversationId !== selectedConversationId) return
        dispatch({ type: 'chat/addMessage', payload: msg })
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
      return
    }
    dispatch(setSelectedConversation(id))
  }

  const handleSend = async () => {
    const text = inputMessage.trim()
    if (!text || !selectedConversationId) return
    await dispatch(sendMessage(text))
    setInputMessage('')
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
                    title={<span style={{ fontWeight: 600 }}>{item.conversationName || 'Người dùng'}</span>}
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


