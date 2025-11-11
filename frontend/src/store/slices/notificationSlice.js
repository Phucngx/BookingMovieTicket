import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { notificationService } from '../../services/notificationService'

export const fetchMyNotifications = createAsyncThunk(
  'notification/fetchMyNotifications',
  async (accountId, { rejectWithValue }) => {
    try {
      const response = await notificationService.getMyNotifications(accountId)
      return response.data || []
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const initialState = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    pushNotification(state, action) {
      const n = action.payload
      state.items.unshift({
        title: n.title,
        message: n.message,
        createdDate: n.createdDate || new Date().toISOString(),
        read: false,
      })
      state.unreadCount += 1
    },
    clearUnread(state) {
      state.unreadCount = 0
      state.items = state.items.map(it => ({ ...it, read: true }))
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyNotifications.fulfilled, (state, action) => {
        state.loading = false
        const items = (action.payload || []).slice().sort((a, b) => {
          const ta = new Date(a.createdDate || 0).getTime()
          const tb = new Date(b.createdDate || 0).getTime()
          return tb - ta
        })
        state.items = items
        state.unreadCount = items.reduce((acc, it) => acc + (it.read ? 0 : 1), 0)
      })
      .addCase(fetchMyNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { pushNotification, clearUnread } = notificationSlice.actions
export default notificationSlice.reducer


