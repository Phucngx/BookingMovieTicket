import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { chatService } from '../../services/chatService'
import { logout } from './userSlice'

// Async thunks
export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async ({ type = 'LIVECHAT', participantIds = null }, { rejectWithValue }) => {
    try {
      const response = await chatService.createConversation(type, participantIds)
      // API returns { code, data }
      return { ...response.data, chatType: type }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Lấy conversation theo type (LIVECHAT hoặc CHATBOT)
export const getConversationByType = createAsyncThunk(
  'chat/getConversationByType',
  async (type, { rejectWithValue }) => {
    try {
      const response = await chatService.getConversations(type)
      // API returns { code, data } với data là array of conversations
      const conversations = response.data || []
      // Tìm conversation đầu tiên với type tương ứng
      const conversation = conversations.find(c => c.type === type) || null
      return { conversation, chatType: type }
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
  async (type, { rejectWithValue }) => {
    try {
      const response = await chatService.getConversations(type)
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
  chatType: null, // 'LIVECHAT' hoặc 'CHATBOT'
  chatbotThinking: false, // Trạng thái chatbot đang suy nghĩ
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
        if (!newMessage.me && newMessage.read === false) {
          state.unreadCount += 1
        }
        // Nếu nhận tin nhắn từ bot (không phải từ user), tắt trạng thái thinking
        if (state.chatType === 'CHATBOT' && !newMessage.me) {
          state.chatbotThinking = false
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
        if (!message.me) {
          message.read = true
        }
      })
      state.unreadCount = 0
    },
    markConversationAsRead: (state, action) => {
      const conversationId = action.payload
      state.messages.forEach(m => {
        if (m.conversationId === conversationId) {
          m.read = true
        }
      })
      // Recalculate total unread
      state.unreadCount = state.messages.reduce((acc, m) => acc + ((!m.me && m.read === false) ? 1 : 0), 0)
      // Reset unread for the conversation in list
      const cIdx = state.conversations.findIndex(c => c.id === conversationId)
      if (cIdx !== -1) {
        state.conversations[cIdx].unreadCount = 0
      }
    },
    updateConversationOnNewMessage: (state, action) => {
      const msg = action.payload
      if (!msg?.conversationId) return
      const idx = state.conversations.findIndex(c => c.id === msg.conversationId)
      if (idx === -1) return
      const updated = { ...state.conversations[idx], modifiedDate: msg.createdDate }
      // Move to top
      state.conversations.splice(idx, 1)
      state.conversations.unshift(updated)
    },
    updateConversationUnreadOnIncoming: (state, action) => {
      const msg = action.payload
      if (!msg?.conversationId) return
      const idx = state.conversations.findIndex(c => c.id === msg.conversationId)
      if (idx === -1) return
      // Only count unread from đối phương
      if (msg.read === false && msg.me === false) {
        const prev = state.conversations[idx].unreadCount || 0
        state.conversations[idx].unreadCount = prev + 1
      }
    },
    clearMessages: (state) => {
      state.messages = []
      state.unreadCount = 0
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload
    },
    setChatType: (state, action) => {
      state.chatType = action.payload
    },
    setChatbotThinking: (state, action) => {
      state.chatbotThinking = action.payload
    },
    clearChat: (state) => {
      state.conversationId = null
      state.messages = []
      state.chatType = null
      state.chatbotThinking = false
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
        state.chatType = action.payload?.chatType || state.chatType
        state.error = null
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload
      })
      // Get conversation by type
      .addCase(getConversationByType.pending, (state) => {
        state.loadingConversations = true
        state.error = null
      })
      .addCase(getConversationByType.fulfilled, (state, action) => {
        state.loadingConversations = false
        if (action.payload?.conversation) {
          state.conversationId = action.payload.conversation.id
          state.chatType = action.payload.chatType
        }
        state.error = null
      })
      .addCase(getConversationByType.rejected, (state, action) => {
        state.loadingConversations = false
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
        const normalizeDate = (item) => (
          item.modifiedDate || item.lastMessageDate || item.lastMessageTime || item.lastMessageCreatedDate || item.updatedDate || item.createdDate
        )
        const normalizeUnread = (item) => {
          const val = item.unreadCount ?? item.unread ?? item.unreadMessageCount
          return typeof val === 'number' ? val : 0
        }
        state.conversations = (action.payload || [])
          .map(c => ({
            ...c,
            modifiedDate: normalizeDate(c),
            unreadCount: normalizeUnread(c),
          }))
          .sort((a, b) => {
            const ta = new Date(a.modifiedDate || a.createdDate || 0).getTime()
            const tb = new Date(b.modifiedDate || b.createdDate || 0).getTime()
            return tb - ta
          })
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
        // Nếu là chatbot, hiển thị trạng thái "đang suy nghĩ"
        if (state.chatType === 'CHATBOT') {
          state.chatbotThinking = true
        }
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
        state.chatbotThinking = false
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
  setTyping,
  setChatType,
  setChatbotThinking,
  clearChat
} = chatSlice.actions

export default chatSlice.reducer
