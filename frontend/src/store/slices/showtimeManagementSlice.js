import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { showtimeManagementService } from '../../services/showtimeManagementService'
import { movieService } from '../../services/movieService'
import { theaterService } from '../../services/theaterService'

// Async thunks
export const fetchAllShowtimes = createAsyncThunk(
  'showtimeManagement/fetchAllShowtimes',
  async ({ page = 1, size = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await showtimeManagementService.getAllShowtimes({ page, size })
      if (response.code === 1000 && response.data) {
        return response.data
      } else {
        throw new Error('Response format không đúng')
      }
    } catch (error) {
      console.error('Fetch all showtimes error:', error)
      return rejectWithValue(error.message)
    }
  }
)

export const createShowtime = createAsyncThunk(
  'showtimeManagement/createShowtime',
  async (showtimeData, { rejectWithValue }) => {
    try {
      const response = await showtimeManagementService.createShowtime(showtimeData)
      if (response.code === 1000 && response.data) {
        return response.data
      } else {
        throw new Error('Response format không đúng')
      }
    } catch (error) {
      console.error('Create showtime error:', error)
      return rejectWithValue(error.message)
    }
  }
)

export const updateShowtime = createAsyncThunk(
  'showtimeManagement/updateShowtime',
  async ({ showtimeId, ...showtimeData }, { rejectWithValue }) => {
    try {
      const response = await showtimeManagementService.updateShowtime(showtimeId, showtimeData)
      if (response.code === 1000 && response.data) {
        return response.data
      } else {
        throw new Error('Response format không đúng')
      }
    } catch (error) {
      console.error('Update showtime error:', error)
      return rejectWithValue(error.message)
    }
  }
)

export const deleteShowtime = createAsyncThunk(
  'showtimeManagement/deleteShowtime',
  async (showtimeId, { rejectWithValue }) => {
    try {
      const response = await showtimeManagementService.deleteShowtime(showtimeId)
      if (response.code === 1000) {
        return showtimeId
      } else {
        throw new Error('Response format không đúng')
      }
    } catch (error) {
      console.error('Delete showtime error:', error)
      return rejectWithValue(error.message)
    }
  }
)

export const fetchShowtimeById = createAsyncThunk(
  'showtimeManagement/fetchShowtimeById',
  async (showtimeId, { rejectWithValue }) => {
    try {
      const response = await showtimeManagementService.getShowtimeById(showtimeId)
      if (response.code === 1000 && response.data) {
        return response.data
      } else {
        throw new Error('Response format không đúng')
      }
    } catch (error) {
      console.error('Fetch showtime by ID error:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Fetch movies for display
export const fetchMoviesForShowtime = createAsyncThunk(
  'showtimeManagement/fetchMoviesForShowtime',
  async ({ page = 1, size = 100 } = {}, { rejectWithValue }) => {
    try {
      const response = await movieService.getMoviesForAdmin(page, size)
      if (response.code === 1000 && response.data) {
        return response.data
      } else {
        throw new Error('Response format không đúng')
      }
    } catch (error) {
      console.error('Fetch movies for showtime error:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Fetch theaters for display
export const fetchTheatersForShowtime = createAsyncThunk(
  'showtimeManagement/fetchTheatersForShowtime',
  async ({ page = 1, size = 100 } = {}, { rejectWithValue }) => {
    try {
      const response = await theaterService.getAllTheaters({ page, size })
      if (response.code === 1000 && response.data) {
        return response.data
      } else {
        throw new Error('Response format không đúng')
      }
    } catch (error) {
      console.error('Fetch theaters for showtime error:', error)
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  showtimes: [],
  currentShowtime: null,
  loading: false,
  error: null,
  // Pagination
  totalElements: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 10,
  first: true,
  last: true,
  // Filters
  filters: {
    movieId: null,
    roomId: null,
    status: null,
    dateRange: null
  },
  // Reference data for display
  movies: [],
  theaters: [],
  moviesLoading: false,
  theatersLoading: false,
  moviesError: null,
  theatersError: null
}

const showtimeManagementSlice = createSlice({
  name: 'showtimeManagement',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        movieId: null,
        roomId: null,
        status: null,
        dateRange: null
      }
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
      // Fetch all showtimes
      .addCase(fetchAllShowtimes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllShowtimes.fulfilled, (state, action) => {
        state.loading = false
        const data = action.payload
        state.showtimes = data.content || []
        state.totalElements = data.totalElements || 0
        state.totalPages = data.totalPages || 0
        state.currentPage = (data.pageable?.pageNumber ?? 0) + 1
        state.pageSize = data.pageable?.pageSize || state.pageSize
        state.first = !!data.first
        state.last = !!data.last
        state.error = null
      })
      .addCase(fetchAllShowtimes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.showtimes = []
      })
      
      // Create showtime
      .addCase(createShowtime.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createShowtime.fulfilled, (state, action) => {
        state.loading = false
        // Add new showtime to the beginning of the list
        state.showtimes.unshift(action.payload)
        state.error = null
      })
      .addCase(createShowtime.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Update showtime
      .addCase(updateShowtime.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateShowtime.fulfilled, (state, action) => {
        state.loading = false
        const updatedShowtime = action.payload
        const index = state.showtimes.findIndex(s => s.showtimeId === updatedShowtime.showtimeId)
        if (index !== -1) {
          state.showtimes[index] = updatedShowtime
        }
        state.error = null
      })
      .addCase(updateShowtime.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Delete showtime
      .addCase(deleteShowtime.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteShowtime.fulfilled, (state, action) => {
        state.loading = false
        const showtimeId = action.payload
        state.showtimes = state.showtimes.filter(s => s.showtimeId !== showtimeId)
        state.totalElements = Math.max(0, state.totalElements - 1)
        state.error = null
      })
      .addCase(deleteShowtime.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch showtime by ID
      .addCase(fetchShowtimeById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchShowtimeById.fulfilled, (state, action) => {
        state.loading = false
        state.currentShowtime = action.payload
        state.error = null
      })
      .addCase(fetchShowtimeById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.currentShowtime = null
      })
      
      // Fetch movies for showtime
      .addCase(fetchMoviesForShowtime.pending, (state) => {
        state.moviesLoading = true
        state.moviesError = null
      })
      .addCase(fetchMoviesForShowtime.fulfilled, (state, action) => {
        state.moviesLoading = false
        state.movies = action.payload.content || []
        state.moviesError = null
      })
      .addCase(fetchMoviesForShowtime.rejected, (state, action) => {
        state.moviesLoading = false
        state.moviesError = action.payload
        state.movies = []
      })
      
      // Fetch theaters for showtime
      .addCase(fetchTheatersForShowtime.pending, (state) => {
        state.theatersLoading = true
        state.theatersError = null
      })
      .addCase(fetchTheatersForShowtime.fulfilled, (state, action) => {
        state.theatersLoading = false
        state.theaters = action.payload.content || []
        state.theatersError = null
      })
      .addCase(fetchTheatersForShowtime.rejected, (state, action) => {
        state.theatersLoading = false
        state.theatersError = action.payload
        state.theaters = []
      })
  }
})

export const { 
  clearError, 
  setFilters, 
  clearFilters, 
  setCurrentPage, 
  setPageSize 
} = showtimeManagementSlice.actions

export default showtimeManagementSlice.reducer
