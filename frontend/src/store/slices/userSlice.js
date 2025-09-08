import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService, tokenUtils } from '../../services/authService'

// Async thunk để lấy thông tin user
export const fetchUserInfo = createAsyncThunk(
  'user/fetchUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getUserInfo()
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk để khôi phục trạng thái đăng nhập
export const restoreAuth = createAsyncThunk(
  'user/restoreAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = tokenUtils.getToken()
      if (token) {
        const userInfo = await authService.getUserInfo()
        return { token, userInfo }
      }
      return null
    } catch (error) {
      // Nếu token không hợp lệ, xóa nó
      tokenUtils.removeToken()
      return rejectWithValue(error.message)
    }
  }
)

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ username, password }, { rejectWithValue, dispatch }) => {
    try {
      // Gọi API đăng nhập
      const loginResponse = await authService.login(username, password)
      
      if (loginResponse.code === 1000 && loginResponse.data?.accessToken) {
        // Lưu token
        tokenUtils.setToken(loginResponse.data.accessToken)
        
        // Lấy thông tin user
        const userInfo = await authService.getUserInfo()
        
        return {
          token: loginResponse.data.accessToken,
          userInfo: userInfo
        }
      } else {
        throw new Error('Đăng nhập thất bại')
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  userInfo: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Đăng xuất
    logout: (state) => {
      state.userInfo = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      // Xóa token khỏi localStorage
      tokenUtils.removeToken()
    },
    
    // Xóa lỗi
    clearError: (state) => {
      state.error = null
    },
    
    // Khôi phục trạng thái từ localStorage (sync)
    restoreAuthState: (state) => {
      const token = tokenUtils.getToken()
      if (token) {
        state.token = token
        state.isAuthenticated = true
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.userInfo = action.payload.userInfo
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      
      // Fetch user info cases
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false
        state.userInfo = action.payload
        state.error = null
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Restore auth cases
      .addCase(restoreAuth.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(restoreAuth.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.token = action.payload.token
          state.userInfo = action.payload.userInfo
          state.isAuthenticated = true
        }
        state.error = null
      })
      .addCase(restoreAuth.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.token = null
        state.userInfo = null
      })
  }
})

export const { logout, clearError, restoreAuthState } = userSlice.actions
export default userSlice.reducer
