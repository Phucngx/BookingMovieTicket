import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { roleService } from '../../services/roleService'

// Async thunks
export const fetchAllRoles = createAsyncThunk(
  'roles/fetchAllRoles',
  async ({ page = 1, size = 100 } = {}, { rejectWithValue }) => {
    try {
      console.log('Fetching all roles with page:', page, 'size:', size)
      const response = await roleService.getAllRoles({ page, size })
      console.log('Role service response:', response)
      
      // Kiểm tra response format
      if (response.code === 1000 && response.data) {
        console.log('Returning roles data:', response.data)
        return {
          content: response.data?.content || [],
          totalElements: response.data?.totalElements || 0,
          totalPages: response.data?.totalPages || 0,
          currentPage: response.data?.pageable?.pageNumber || 0,
          size: response.data?.size || size,
          first: response.data?.first || false,
          last: response.data?.last || false
        }
      } else {
        throw new Error('Response format không đúng')
      }
    } catch (error) {
      console.error('Fetch all roles error:', error)
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  roles: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  pageSize: 100,
  totalPages: 0,
  first: true,
  last: true
}

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearRoles: (state) => {
      state.roles = []
      state.total = 0
      state.currentPage = 1
      state.totalPages = 0
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all roles
      .addCase(fetchAllRoles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllRoles.fulfilled, (state, action) => {
        state.loading = false
        state.roles = action.payload.content
        state.total = action.payload.totalElements
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage + 1 // API trả về 0-based, UI dùng 1-based
        state.pageSize = action.payload.size
        state.first = action.payload.first
        state.last = action.payload.last
        state.error = null
      })
      .addCase(fetchAllRoles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearError, clearRoles } = roleSlice.actions
export default roleSlice.reducer
