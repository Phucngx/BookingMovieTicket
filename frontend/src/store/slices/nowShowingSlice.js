import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { movieService } from '../../services/movieService'

export const fetchNowShowingMovies = createAsyncThunk(
  'nowShowing/fetchNowShowingMovies',
  async ({ page = 1, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await movieService.getNowShowing(page, size)
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

const nowShowingSlice = createSlice({
  name: 'nowShowing',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    reset: (state) => {
      state.movies = []
      state.pagination = {
        current: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0
      }
      state.error = null
      state.loading = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNowShowingMovies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNowShowingMovies.fulfilled, (state, action) => {
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
      .addCase(fetchNowShowingMovies.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.movies = []
      })
  }
})

export const { clearError, reset } = nowShowingSlice.actions
export default nowShowingSlice.reducer


