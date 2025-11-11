const API_BASE_URL = 'http://localhost:8080/api/v1/chat-service'
import { io } from 'socket.io-client'
// UI notifications should be handled at the component level (e.g., AntD notification)

// Helper function to get auth token
const getAuthToken = () => {
  // Prefer token saved by auth slice
  const token = localStorage.getItem('accessToken')
  if (token) return token
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  return userInfo.token
}

// WebSocket connection
let wsConnection = null
let reconnectAttempts = 0
const maxReconnectAttempts = 5
const reconnectDelay = 3000
let socketIO = null
let socketAux = null

// (desktop notification helpers removed; handled by UI if needed)

export const chatService = {
  // Lấy danh sách cuộc trò chuyện của tài khoản hiện tại
  async getConversations(type) {
    try {
      const token = getAuthToken()
      let url = `${API_BASE_URL}/conversations/my-conversations`
      
      // Thêm query parameter type nếu được cung cấp
      if (type) {
        url += `?type=${encodeURIComponent(type)}`
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách cuộc trò chuyện')
      }

      return data
    } catch (error) {
      console.error('Get conversations error:', error)
      throw error
    }
  },
  // Tạo (hoặc lấy) cuộc trò chuyện với admin hoặc bot
  async createConversation(type = 'LIVECHAT', participantIds = null) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/conversations/create`

      // Xác định participantIds dựa trên type
      let participantIdsToUse = participantIds
      if (!participantIdsToUse) {
        if (type === 'CHATBOT') {
          participantIdsToUse = ['22']
        } else {
          participantIdsToUse = ['2'] // LIVECHAT với admin
        }
      }

      const body = {
        type: type,
        participantIds: participantIdsToUse
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể tạo cuộc trò chuyện')
      }

      return data
    } catch (error) {
      console.error('Create conversation error:', error)
      throw error
    }
  },

  // Lấy danh sách tin nhắn theo conversationId
  async getMessages(conversationId) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/messages/get-messages?conversationId=${encodeURIComponent(conversationId)}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách tin nhắn')
      }

      return data
    } catch (error) {
      console.error('Get messages error:', error)
      throw error
    }
  },

  // Gửi tin nhắn
  async sendMessage({ conversationId, message }) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/messages/create`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ conversationId, message })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể gửi tin nhắn')
      }

      return data
    } catch (error) {
      console.error('Send message error:', error)
      throw error
    }
  },

  // Đánh dấu tin nhắn đã đọc
  async markAsRead(messageId) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/messages/${messageId}/read`
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Không thể đánh dấu tin nhắn đã đọc')
      }

      return { success: true }
    } catch (error) {
      console.error('Mark as read error:', error)
      throw error
    }
  },

  // Đánh dấu tất cả tin nhắn đã đọc
  async markAllAsRead() {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/messages/read-all`
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Không thể đánh dấu tất cả tin nhắn đã đọc')
      }

      return { success: true }
    } catch (error) {
      console.error('Mark all as read error:', error)
      throw error
    }
  },

  // Lấy số tin nhắn chưa đọc
  async getUnreadCount() {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/messages/unread-count`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy số tin nhắn chưa đọc')
      }

      return data
    } catch (error) {
      console.error('Get unread count error:', error)
      throw error
    }
  },

  // Kết nối WebSocket
  // connectWebSocket(onMessage, onConnectionChange) {
  //   try {
  //     const token = getAuthToken()
  //     if (!token) {
  //       console.warn('No auth token available for WebSocket connection')
  //       return
  //     }

  //     const wsUrl = `ws://localhost:8080/ws/chat?token=${token}`
  //     wsConnection = new WebSocket(wsUrl)

  //     wsConnection.onopen = () => {
  //       console.log('WebSocket connected')
  //       reconnectAttempts = 0
  //       onConnectionChange(true)
  //     }

  //     wsConnection.onmessage = (event) => {
  //       try {
  //         const data = JSON.parse(event.data)
  //         onMessage(data)
  //       } catch (error) {
  //         console.error('Error parsing WebSocket message:', error)
  //       }
  //     }

  //     wsConnection.onclose = () => {
  //       console.log('WebSocket disconnected')
  //       onConnectionChange(false)
  //       this.reconnectWebSocket(onMessage, onConnectionChange)
  //     }

  //     wsConnection.onerror = (error) => {
  //       console.error('WebSocket error:', error)
  //       onConnectionChange(false)
  //     }

  //   } catch (error) {
  //     console.error('WebSocket connection error:', error)
  //     onConnectionChange(false)
  //   }
  // },

  // Reconnect WebSocket
  // reconnectWebSocket(onMessage, onConnectionChange) {
  //   if (reconnectAttempts < maxReconnectAttempts) {
  //     reconnectAttempts++
  //     console.log(`Attempting to reconnect WebSocket (${reconnectAttempts}/${maxReconnectAttempts})`)
      
  //     setTimeout(() => {
  //       this.connectWebSocket(onMessage, onConnectionChange)
  //     }, reconnectDelay)
  //   } else {
  //     console.error('Max reconnection attempts reached')
  //   }
  // },

  // Ngắt kết nối WebSocket
  // disconnectWebSocket() {
  //   if (wsConnection) {
  //     wsConnection.close()
  //     wsConnection = null
  //     reconnectAttempts = 0
  //   }
  // },

  // Gửi tin nhắn qua WebSocket
  // sendWebSocketMessage(message) {
  //   if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
  //     wsConnection.send(JSON.stringify(message))
  //     return true
  //   }
  //   return false
  // },

  // Kiểm tra trạng thái kết nối
  // isConnected() {
  //   return wsConnection && wsConnection.readyState === WebSocket.OPEN
  // },

  // Socket.IO connection for chat realtime (host: http://localhost:8888)
  connectSocketIO(onMessage, onConnectionChange) {
    try {
      if (socketIO && socketIO.connected) {
        console.log('[Socket.IO] Already connected:', socketIO.id)
        return socketIO
      }
      const token = getAuthToken()
      if (!token) {
        console.warn('[Socket.IO] No token found, skipping connection')
        return null
      }
      socketIO = io('http://localhost:8888', {
        transports: ['websocket'],
        autoConnect: true,
        query: { token },
      })

      socketIO.on('connect', () => {
        console.log('[Socket.IO] connected:', socketIO.id)
        try { onConnectionChange && onConnectionChange(true) } catch (_) {}
      })

      socketIO.on('disconnect', (reason) => {
        console.log('[Socket.IO] disconnected:', reason)
        try { onConnectionChange && onConnectionChange(false) } catch (_) {}
      })

      socketIO.on('connect_error', (err) => {
        console.error('[Socket.IO] connect_error:', err?.message || err)
        try { onConnectionChange && onConnectionChange(false) } catch (_) {}
      })

      socketIO.on('message', (message) => {
        console.log('New message received:', message)
        let payload = message
        try {
          if (typeof message === 'string') {
            payload = JSON.parse(message)
          }
        } catch (_) {}
        try { onMessage && onMessage(payload) } catch (_) {}
        // Do not show UI notifications here; components decide based on their open state
      })

      return socketIO
    } catch (error) {
      console.error('Socket.IO connection error:', error)
      return null
    }
  },

  // Secondary Socket.IO connection (port 8899)
  connectAuxSocket(onMessage, onConnectionChange) {
    try {
      if (socketAux && socketAux.connected) {
        console.log('[AuxSocket] Already connected:', socketAux.id)
        return socketAux
      }
      const token = getAuthToken()
      if (!token) {
        console.warn('[AuxSocket] No token found, skipping connection')
        return null
      }
      socketAux = io('http://localhost:8899', {
        transports: ['websocket'],
        autoConnect: true,
        query: { token },
      })

      socketAux.on('connect', () => {
        console.log('[AuxSocket] connected:', socketAux.id)
        try { onConnectionChange && onConnectionChange(true) } catch (_) {}
      })

      socketAux.on('disconnect', (reason) => {
        console.log('[AuxSocket] disconnected:', reason)
        try { onConnectionChange && onConnectionChange(false) } catch (_) {}
      })

      socketAux.on('connect_error', (err) => {
        console.error('[AuxSocket] connect_error:', err?.message || err)
        try { onConnectionChange && onConnectionChange(false) } catch (_) {}
      })

      socketAux.on('notification', (message) => {
        console.log('New notification received:', message)
        let payload = message
        try {
          if (typeof message === 'string') {
            payload = JSON.parse(message)
          }
        } catch (_) {}
        try { onMessage && onMessage(payload) } catch (_) {}
      })

      return socketAux
    } catch (error) {
      console.error('Aux Socket.IO connection error:', error)
      return null
    }
  },

  disconnectAuxSocket() {
    try {
      if (socketAux) {
        socketAux.removeAllListeners()
        socketAux.disconnect()
        socketAux = null
      }
    } catch (error) {
      console.error('Aux Socket.IO disconnect error:', error)
    }
  },

  disconnectSocketIO() {
    try {
      if (socketIO) {
        socketIO.removeAllListeners()
        socketIO.disconnect()
        socketIO = null
      }
    } catch (error) {
      console.error('Socket.IO disconnect error:', error)
    }
  },
  
  emitMarkAsRead(conversationId) {
    try {
      if (socketIO && socketIO.connected && conversationId) {
        socketIO.emit('markAsRead',  conversationId )
        return true
      }
    } catch (error) {
      console.error('emitMarkAsRead error:', error)
    }
    return false
  },
}
