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

export const fetchMyTickets = createAsyncThunk(
  'bookings/fetchMyTickets',
  async ({ accountId, period = 'month', page = 1, size = 10, token }, { rejectWithValue }) => {
    try {
      const res = await bookingService.getMyTickets({ accountId, period, page, size, token })
      return res?.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const initialState = {
  lastBooking: null, // store createBooking response data
  ticket: null,      // store ticket detail data
  loading: false,
  error: null,
  // tickets list state
  myTickets: [],
  ticketsTotal: 0,
  ticketsPage: 1,
  ticketsPageSize: 10,
  ticketsTotalPages: 0,
  ticketsFirst: true,
  ticketsLast: true,
  selectedPeriod: 'month'
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
      state.myTickets = []
      state.ticketsTotal = 0
      state.ticketsPage = 1
      state.ticketsTotalPages = 0
      state.ticketsFirst = true
      state.ticketsLast = true
    },
    setSelectedPeriod(state, action) {
      state.selectedPeriod = action.payload
    },
    clearTickets(state) {
      state.myTickets = []
      state.ticketsTotal = 0
      state.ticketsPage = 1
      state.ticketsTotalPages = 0
      state.ticketsFirst = true
      state.ticketsLast = true
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
      // fetch my tickets
      .addCase(fetchMyTickets.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        state.loading = false
        const data = action.payload || {}
        state.myTickets = data.content || []
        state.ticketsTotal = data.totalElements || 0
        state.ticketsTotalPages = data.totalPages || 0
        state.ticketsPage = (data.pageable?.pageNumber ?? 0) + 1
        state.ticketsPageSize = data.pageable?.pageSize || state.ticketsPageSize
        state.ticketsFirst = !!data.first
        state.ticketsLast = !!data.last
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { setLastBooking, clearBookingsState, setSelectedPeriod, clearTickets } = bookingsSlice.actions
export default bookingsSlice.reducer


