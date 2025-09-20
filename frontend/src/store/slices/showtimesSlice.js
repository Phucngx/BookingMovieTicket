import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { showtimeService } from '../../services/showtimeService'

// Async thunk để lấy lịch chiếu theo rạp và ngày
export const fetchShowtimesByDate = createAsyncThunk(
  'showtimes/fetchShowtimesByDate',
  async ({ theaterId, date, token }, { rejectWithValue }) => {
    try {
      console.log('fetchShowtimesByDate - Starting API call:', { theaterId, date })
      const response = await showtimeService.getShowtimesByDate(theaterId, date, token)
      console.log('fetchShowtimesByDate - API response:', response)
      return response
    } catch (error) {
      console.error('fetchShowtimesByDate - API error:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk: lấy lịch chiếu theo rạp + phim + ngày
export const fetchShowtimesByTheaterMovieDate = createAsyncThunk(
  'showtimes/fetchShowtimesByTheaterMovieDate',
  async ({ theaterId, movieId, date, token }, { rejectWithValue }) => {
    try {
      console.log('fetchShowtimesByTheaterMovieDate - Starting API call:', { theaterId, movieId, date })
      const response = await showtimeService.getShowtimesByTheaterMovieDate(theaterId, movieId, date, token)
      console.log('fetchShowtimesByTheaterMovieDate - API response:', response)
      return response
    } catch (error) {
      console.error('fetchShowtimesByTheaterMovieDate - API error:', error)
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  showtimes: [],
  selectedTheater: null,
  selectedDate: null,
  selectedShowtime: null,
  loading: false,
  error: null
}

const showtimesSlice = createSlice({
  name: 'showtimes',
  initialState,
  reducers: {
    // Set selected theater
    setSelectedTheater: (state, action) => {
      console.log('showtimesSlice - setSelectedTheater:', action.payload)
      state.selectedTheater = action.payload
      state.showtimes = [] // Clear showtimes when theater changes
    },
    
    // Set selected date
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload
    },
    
    // Set selected showtime (includes complete info: showtime, movie, theater, date)
    setSelectedShowtime: (state, action) => {
      console.log('showtimesSlice - setSelectedShowtime (complete):', action.payload)
      state.selectedShowtime = action.payload
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null
    },
    
    // Reset showtimes
    resetShowtimes: (state) => {
      state.showtimes = []
      state.selectedTheater = null
      state.selectedDate = null
      state.selectedShowtime = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch showtimes cases
      .addCase(fetchShowtimesByDate.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchShowtimesByDate.fulfilled, (state, action) => {
        console.log('showtimesSlice - fetchShowtimesByDate.fulfilled:', action.payload)
        state.loading = false
        state.showtimes = action.payload.data || []
        state.error = null
        console.log('showtimesSlice - Updated showtimes:', state.showtimes)
      })
      .addCase(fetchShowtimesByDate.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.showtimes = []
      })

      // Fetch showtimes by theater+movie+date cases
      .addCase(fetchShowtimesByTheaterMovieDate.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchShowtimesByTheaterMovieDate.fulfilled, (state, action) => {
        console.log('showtimesSlice - fetchShowtimesByTheaterMovieDate.fulfilled:', action.payload)
        state.loading = false
        // API này trả về mảng các suất chiếu phẳng
        state.showtimes = action.payload.data || []
        state.error = null
      })
      .addCase(fetchShowtimesByTheaterMovieDate.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.showtimes = []
      })
  }
})

export const { setSelectedTheater, setSelectedDate, setSelectedShowtime, clearError, resetShowtimes } = showtimesSlice.actions
export default showtimesSlice.reducer
