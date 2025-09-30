const API_BASE_URL = 'http://localhost:8080/api/v1/chat-service'

// Helper function to get auth token
const getAuthToken = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  return userInfo.token
}

// WebSocket connection
let wsConnection = null
let reconnectAttempts = 0
const maxReconnectAttempts = 5
const reconnectDelay = 3000

export const chatService = {
  // Lấy danh sách tin nhắn
  async getMessages({ page = 1, limit = 50 } = {}) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/messages?page=${page}&limit=${limit}`
      
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
  async sendMessage(messageData) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/messages`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messageData)
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
  connectWebSocket(onMessage, onConnectionChange) {
    try {
      const token = getAuthToken()
      if (!token) {
        console.warn('No auth token available for WebSocket connection')
        return
      }

      const wsUrl = `ws://localhost:8080/ws/chat?token=${token}`
      wsConnection = new WebSocket(wsUrl)

      wsConnection.onopen = () => {
        console.log('WebSocket connected')
        reconnectAttempts = 0
        onConnectionChange(true)
      }

      wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          onMessage(data)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      wsConnection.onclose = () => {
        console.log('WebSocket disconnected')
        onConnectionChange(false)
        this.reconnectWebSocket(onMessage, onConnectionChange)
      }

      wsConnection.onerror = (error) => {
        console.error('WebSocket error:', error)
        onConnectionChange(false)
      }

    } catch (error) {
      console.error('WebSocket connection error:', error)
      onConnectionChange(false)
    }
  },

  // Reconnect WebSocket
  reconnectWebSocket(onMessage, onConnectionChange) {
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++
      console.log(`Attempting to reconnect WebSocket (${reconnectAttempts}/${maxReconnectAttempts})`)
      
      setTimeout(() => {
        this.connectWebSocket(onMessage, onConnectionChange)
      }, reconnectDelay)
    } else {
      console.error('Max reconnection attempts reached')
    }
  },

  // Ngắt kết nối WebSocket
  disconnectWebSocket() {
    if (wsConnection) {
      wsConnection.close()
      wsConnection = null
      reconnectAttempts = 0
    }
  },

  // Gửi tin nhắn qua WebSocket
  sendWebSocketMessage(message) {
    if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
      wsConnection.send(JSON.stringify(message))
      return true
    }
    return false
  },

  // Kiểm tra trạng thái kết nối
  isConnected() {
    return wsConnection && wsConnection.readyState === WebSocket.OPEN
  }
}
