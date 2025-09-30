import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { movieService } from '../../services/movieService'

// Async thunk để lấy danh sách phim
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async ({ page = 1, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await movieService.getMovies(page, size)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk để lấy chi tiết phim
export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchMovieDetails',
  async (movieId, { rejectWithValue }) => {
    try {
      const response = await movieService.getMovieDetails(movieId)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  movies: [],
  selectedMovie: null,
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  }
}

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    // Xóa lỗi
    clearError: (state) => {
      state.error = null
    },
    
    // Reset movies
    resetMovies: (state) => {
      state.movies = []
      state.pagination = {
        current: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0
      }
    },

    // Set selected movie
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch movies cases
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false
        state.movies = action.payload.data.content || []
        state.pagination = {
          current: action.payload.data.pageable.pageNumber + 1,
          pageSize: action.payload.data.pageable.pageSize,
          total: action.payload.data.totalElements,
          totalPages: action.payload.data.totalPages
        }
        state.error = null
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.movies = []
      })
      // Fetch movie details cases
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loading = false
        state.selectedMovie = action.payload.data
        state.error = null
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.selectedMovie = null
      })
  }
})

export const { clearError, resetMovies, setSelectedMovie } = moviesSlice.actions
export default moviesSlice.reducer