import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { seatService } from '../../services/seatService'

// Async thunk để lấy layout và trạng thái ghế theo showtimeId
export const fetchSeatsByShowtimeId = createAsyncThunk(
  'seats/fetchSeatsByShowtimeId',
  async ({ showtimeId, token }, { rejectWithValue }) => {
    try {
      console.log('fetchSeatsByShowtimeId - Starting API call:', { showtimeId })
      const response = await seatService.getSeatsByShowtimeId(showtimeId, token)
      console.log('fetchSeatsByShowtimeId - API response:', response)
      return response
    } catch (error) {
      console.error('fetchSeatsByShowtimeId - API error:', error)
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  layout: null,
  seats: [],
  selectedSeats: [],
  loading: false,
  error: null
}

const seatSlice = createSlice({
  name: 'seats',
  initialState,
  reducers: {
    // Set selected seats
    setSelectedSeats: (state, action) => {
      console.log('seatSlice - setSelectedSeats:', action.payload)
      // Store full seat objects
      state.selectedSeats = action.payload
    },
    
    // Toggle seat selection
    toggleSeatSelection: (state, action) => {
      const seatId = action.payload
      const existsIndex = state.selectedSeats.findIndex(s => s.seatId === seatId)
      if (existsIndex === -1) {
        const seatObj = state.seats.find(s => s.seatId === seatId)
        if (seatObj) {
          state.selectedSeats.push(seatObj)
        }
      } else {
        state.selectedSeats.splice(existsIndex, 1)
      }
      
      console.log('seatSlice - Updated selectedSeats:', state.selectedSeats)
    },
    
    // Clear selected seats
    clearSelectedSeats: (state) => {
      state.selectedSeats = []
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null
    },
    
    // Reset seats
    resetSeats: (state) => {
      state.layout = null
      state.seats = []
      state.selectedSeats = []
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch seats cases
      .addCase(fetchSeatsByShowtimeId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSeatsByShowtimeId.fulfilled, (state, action) => {
        console.log('seatSlice - fetchSeatsByShowtimeId.fulfilled:', action.payload)
        state.loading = false
        state.layout = action.payload.data.layout
        state.seats = action.payload.data.seats
        state.error = null
        console.log('seatSlice - Updated layout:', state.layout)
        console.log('seatSlice - Updated seats count:', state.seats.length)
      })
      .addCase(fetchSeatsByShowtimeId.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.layout = null
        state.seats = []
      })
  }
})

export const { 
  setSelectedSeats, 
  toggleSeatSelection, 
  clearSelectedSeats, 
  clearError, 
  resetSeats 
} = seatSlice.actions

export default seatSlice.reducer
