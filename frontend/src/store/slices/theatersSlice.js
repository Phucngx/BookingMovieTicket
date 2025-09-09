import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { theaterService } from '../../services/theaterService'

// Async thunk để lấy danh sách rạp theo thành phố
export const fetchTheaters = createAsyncThunk(
  'theaters/fetchTheaters',
  async (city, { rejectWithValue }) => {
    try {
      const response = await theaterService.getTheaters(city)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  theaters: [],
  selectedCity: null,
  selectedDate: null,
  loading: false,
  error: null
}

const theatersSlice = createSlice({
  name: 'theaters',
  initialState,
  reducers: {
    // Set selected city
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload
      state.theaters = [] // Clear theaters when city changes
    },
    
    // Set selected date
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null
    },
    
    // Reset theaters
    resetTheaters: (state) => {
      state.theaters = []
      state.selectedCity = null
      state.selectedDate = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch theaters cases
      .addCase(fetchTheaters.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTheaters.fulfilled, (state, action) => {
        state.loading = false
        state.theaters = action.payload.data || []
        state.error = null
      })
      .addCase(fetchTheaters.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.theaters = []
      })
  }
})

export const { setSelectedCity, setSelectedDate, clearError, resetTheaters } = theatersSlice.actions
export default theatersSlice.reducer
