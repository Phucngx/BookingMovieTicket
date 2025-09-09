import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { showtimeService } from '../../services/showtimeService'

// Async thunk để lấy lịch chiếu
export const fetchShowtimes = createAsyncThunk(
  'showtimes/fetchShowtimes',
  async ({ theaterId, movieId, date }, { rejectWithValue }) => {
    try {
      const response = await showtimeService.getShowtimes(theaterId, movieId, date)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  showtimes: [],
  selectedShowtime: null,
  loading: false,
  error: null,
  currentRequest: null // { theaterId, movieId, date }
}

const showtimesSlice = createSlice({
  name: 'showtimes',
  initialState,
  reducers: {
    // Set selected showtime
    setSelectedShowtime: (state, action) => {
      state.selectedShowtime = action.payload
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null
    },
    
    // Reset showtimes
    resetShowtimes: (state) => {
      state.showtimes = []
      state.selectedShowtime = null
      state.currentRequest = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch showtimes cases
      .addCase(fetchShowtimes.pending, (state, action) => {
        state.loading = true
        state.error = null
        state.currentRequest = action.meta.arg
      })
      .addCase(fetchShowtimes.fulfilled, (state, action) => {
        state.loading = false
        state.showtimes = action.payload.data || []
        state.error = null
      })
      .addCase(fetchShowtimes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.showtimes = []
        state.currentRequest = null
      })
  }
})

export const { setSelectedShowtime, clearError, resetShowtimes } = showtimesSlice.actions
export default showtimesSlice.reducer
