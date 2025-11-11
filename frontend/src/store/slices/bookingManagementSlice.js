import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { bookingService } from '../../services/bookingService'

// Async thunks
export const fetchBookingStats = createAsyncThunk(
  'bookingManagement/fetchBookingStats',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching booking statistics')
      // Fetch only first page to get total count and basic stats quickly
      const response = await bookingService.getAllBookings({ page: 1, size: 10 })
      console.log('Booking stats response:', response)
      
      if (response.code === 1000 && response.data) {
        const totalElements = response.data?.totalElements || 0
        const bookings = response.data?.content || []
        
        // Calculate basic statistics from first page
        const confirmedCount = bookings.filter(b => b.status === 'CONFIRMED').length
        const pendingCount = bookings.filter(b => b.status === 'PENDING').length
        const cancelledCount = bookings.filter(b => b.status === 'CANCELLED').length
        const pageRevenue = bookings
          .filter(b => b.status === 'CONFIRMED')
          .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
        
        // Estimate statistics based on first page sample
        const stats = {
          totalBookings: totalElements,
          confirmedBookings: Math.round((confirmedCount / bookings.length) * totalElements) || 0,
          pendingBookings: Math.round((pendingCount / bookings.length) * totalElements) || 0,
          cancelledBookings: Math.round((cancelledCount / bookings.length) * totalElements) || 0,
          totalRevenue: Math.round((pageRevenue / bookings.length) * totalElements) || 0,
          averageRevenue: 0
        }
        
        stats.averageRevenue = stats.confirmedBookings > 0 
          ? stats.totalRevenue / stats.confirmedBookings 
          : 0
        
        console.log('Calculated estimated stats:', stats)
        return stats
      } else {
        throw new Error('Response format không đúng')
      }
    } catch (error) {
      console.error('Fetch booking stats error:', error)
      return rejectWithValue(error.message)
    }
  }
)

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
  last: true,
  // Statistics state
  stats: {
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    averageRevenue: 0
  },
  statsLoading: false,
  statsError: null
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
      // Fetch booking statistics
      .addCase(fetchBookingStats.pending, (state) => {
        state.statsLoading = true
        state.statsError = null
      })
      .addCase(fetchBookingStats.fulfilled, (state, action) => {
        state.statsLoading = false
        state.stats = action.payload
        state.statsError = null
      })
      .addCase(fetchBookingStats.rejected, (state, action) => {
        state.statsLoading = false
        state.statsError = action.payload
      })
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
