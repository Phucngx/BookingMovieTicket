import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { bookingService } from '../../services/bookingService'

export const fetchTicketByBookingId = createAsyncThunk(
  'bookings/fetchTicketByBookingId',
  async ({ bookingId, token }, { rejectWithValue }) => {
    try {
      const res = await bookingService.getTicket({ bookingId, token })
      return res
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const initialState = {
  lastBooking: null, // store createBooking response data
  ticket: null,      // store ticket detail data
  loading: false,
  error: null
}

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setLastBooking(state, action) {
      state.lastBooking = action.payload
    },
    clearBookingsState(state) {
      state.lastBooking = null
      state.ticket = null
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTicketByBookingId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTicketByBookingId.fulfilled, (state, action) => {
        state.loading = false
        state.ticket = action.payload?.data || null
      })
      .addCase(fetchTicketByBookingId.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.ticket = null
      })
  }
})

export const { setLastBooking, clearBookingsState } = bookingsSlice.actions
export default bookingsSlice.reducer


