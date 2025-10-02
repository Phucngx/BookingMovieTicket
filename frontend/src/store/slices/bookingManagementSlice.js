import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { bookingService } from '../../services/bookingService'

// Async thunks
export const fetchAllBookings = createAsyncThunk(
  'bookingManagement/fetchAllBookings',
  async ({ page = 1, size = 10 } = {}, { rejectWithValue }) => {
    try {
      console.log('Fetching all bookings with page:', page, 'size:', size)
      const response = await bookingService.getAllBookings({ page, size })
      console.log('Booking service response:', response)
      
      // Kiểm tra response format
      if (response.code === 1000 && response.data) {
        console.log('Returning bookings data:', response.data)
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
      console.error('Fetch all bookings error:', error)
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  bookings: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  pageSize: 10,
  totalPages: 0,
  first: true,
  last: true
}

const bookingManagementSlice = createSlice({
  name: 'bookingManagement',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all bookings
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = action.payload.content
        state.total = action.payload.totalElements
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage + 1 // API trả về 0-based, UI dùng 1-based
        state.pageSize = action.payload.size
        state.first = action.payload.first
        state.last = action.payload.last
        state.error = null
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearError, setCurrentPage, setPageSize } = bookingManagementSlice.actions
export default bookingManagementSlice.reducer
