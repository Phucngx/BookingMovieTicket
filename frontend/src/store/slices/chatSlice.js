import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { chatService } from '../../services/chatService'

// Async thunks
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const response = await chatService.getMessages({ page, limit })
      return response.data || []
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await chatService.sendMessage(messageData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const markAsRead = createAsyncThunk(
  'chat/markAsRead',
  async (messageId, { rejectWithValue }) => {
    try {
      await chatService.markAsRead(messageId)
      return messageId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getUnreadCount = createAsyncThunk(
  'chat/getUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatService.getUnreadCount()
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  messages: [],
  unreadCount: 0,
  loading: false,
  sending: false,
  error: null,
  isConnected: false,
  chatWindowOpen: false,
  currentPage: 1,
  hasMore: true
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    toggleChatWindow: (state) => {
      state.chatWindowOpen = !state.chatWindowOpen
    },
    openChatWindow: (state) => {
      state.chatWindowOpen = true
    },
    closeChatWindow: (state) => {
      state.chatWindowOpen = false
    },
    addMessage: (state, action) => {
      const newMessage = action.payload
      const existingIndex = state.messages.findIndex(msg => msg.id === newMessage.id)
      
      if (existingIndex === -1) {
        state.messages.unshift(newMessage)
        if (newMessage.sender !== 'user') {
          state.unreadCount += 1
        }
      }
    },
    updateMessage: (state, action) => {
      const updatedMessage = action.payload
      const index = state.messages.findIndex(msg => msg.id === updatedMessage.id)
      
      if (index !== -1) {
        state.messages[index] = updatedMessage
      }
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload
    },
    markMessageAsRead: (state, action) => {
      const messageId = action.payload
      const message = state.messages.find(msg => msg.id === messageId)
      
      if (message && !message.isRead) {
        message.isRead = true
        if (message.sender !== 'user') {
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      }
    },
    markAllAsRead: (state) => {
      state.messages.forEach(message => {
        if (message.sender !== 'user') {
          message.isRead = true
        }
      })
      state.unreadCount = 0
    },
    clearMessages: (state) => {
      state.messages = []
      state.unreadCount = 0
      state.currentPage = 1
      state.hasMore = true
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false
        const newMessages = action.payload
        
        if (state.currentPage === 1) {
          state.messages = newMessages
        } else {
          state.messages = [...state.messages, ...newMessages]
        }
        
        state.hasMore = newMessages.length === 50 // Assuming 50 is the limit
        state.error = null
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.sending = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false
        const newMessage = action.payload
        state.messages.unshift(newMessage)
        state.error = null
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false
        state.error = action.payload
      })
      
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const messageId = action.payload
        const message = state.messages.find(msg => msg.id === messageId)
        
        if (message && !message.isRead) {
          message.isRead = true
          if (message.sender !== 'user') {
            state.unreadCount = Math.max(0, state.unreadCount - 1)
          }
        }
      })
      
      // Get unread count
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.count || 0
      })
  }
})

export const {
  clearError,
  toggleChatWindow,
  openChatWindow,
  closeChatWindow,
  addMessage,
  updateMessage,
  setConnectionStatus,
  markMessageAsRead,
  markAllAsRead,
  clearMessages,
  setTyping
} = chatSlice.actions

export default chatSlice.reducer
