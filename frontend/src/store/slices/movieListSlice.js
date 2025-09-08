import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { movieService } from '../../services/movieService'

// Async thunk để lấy danh sách phim (không cần login)
export const fetchMovies = createAsyncThunk(
  'movieList/fetchMovies',
  async ({ page = 1, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await movieService.getMovies(page, size)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk để lấy danh sách phim cho admin (cần login)
export const fetchMoviesForAdmin = createAsyncThunk(
  'movieList/fetchMoviesForAdmin',
  async ({ page = 1, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await movieService.getMoviesForAdmin(page, size)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  movies: [],
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  }
}

const movieListSlice = createSlice({
  name: 'movieList',
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
      // Fetch movies for admin cases
      .addCase(fetchMoviesForAdmin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMoviesForAdmin.fulfilled, (state, action) => {
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
      .addCase(fetchMoviesForAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.movies = []
      })
  }
})

export const { clearError, resetMovies } = movieListSlice.actions
export default movieListSlice.reducer
