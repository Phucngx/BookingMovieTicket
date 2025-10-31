import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { chatService } from '../../services/chatService'
import { logout } from './userSlice'

// Async thunks
export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatService.createConversation()
      // API returns { code, data }
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { selectedConversationId, conversationId } = getState().chat
      const id = selectedConversationId || conversationId
      if (!id) return []
      const response = await chatService.getMessages(id)
      return response.data || []
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message, { getState, rejectWithValue }) => {
    try {
      const { selectedConversationId, conversationId } = getState().chat
      const id = selectedConversationId || conversationId
      if (!id) throw new Error('Chưa có cuộc trò chuyện')
      const response = await chatService.sendMessage({ conversationId: id, message })
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatService.getConversations()
      return response.data || []
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
  conversationId: null,
  conversations: [],
  selectedConversationId: null,
  messages: [],
  unreadCount: 0,
  loading: false,
  sending: false,
  creating: false,
  loadingConversations: false,
  error: null,
  isConnected: false,
  chatWindowOpen: false,
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
    setSelectedConversation: (state, action) => {
      state.selectedConversationId = action.payload
      state.messages = []
    },
    addMessage: (state, action) => {
      const newMessage = action.payload
      const existingIndex = state.messages.findIndex(msg => msg.id === newMessage.id)
      
      if (existingIndex === -1) {
        state.messages.push(newMessage)
        if (!newMessage.me) {
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
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Create conversation
      .addCase(createConversation.pending, (state) => {
        state.creating = true
        state.error = null
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.creating = false
        state.conversationId = action.payload?.id || state.conversationId
        state.error = null
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload
      })
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false
        const newMessages = action.payload
        state.messages = [...newMessages].sort((a, b) => {
          const ta = new Date(a.createdDate).getTime()
          const tb = new Date(b.createdDate).getTime()
          return ta - tb
        })
        state.error = null
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loadingConversations = true
        state.error = null
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loadingConversations = false
        state.conversations = action.payload
        state.error = null
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loadingConversations = false
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
        const exists = state.messages.some(m => m.id === newMessage?.id)
        if (!exists) {
          state.messages.push(newMessage)
        }
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

      // Reset chat on user logout
      .addCase(logout, () => ({ ...initialState }))
  }
})

export const {
  clearError,
  toggleChatWindow,
  openChatWindow,
  closeChatWindow,
  setSelectedConversation,
  addMessage,
  updateMessage,
  setConnectionStatus,
  markMessageAsRead,
  markAllAsRead,
  clearMessages,
  setTyping
} = chatSlice.actions

export default chatSlice.reducer
