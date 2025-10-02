import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { movieService } from '../../services/movieService'
import { theaterService } from '../../services/theaterService'
import { showtimeManagementService } from '../../services/showtimeManagementService'

// Async thunks sử dụng lại các service đã có
export const fetchMoviesForWizard = createAsyncThunk(
  'showtimeWizard/fetchMoviesForWizard',
  async ({ page = 1, size = 100 } = {}, { rejectWithValue }) => {
    try {
      const response = await movieService.getMoviesForAdmin(page, size)
      if (response.code === 1000 && response.data) {
        return response.data
      } else {
        throw new Error('Response format không đúng')
      }
    } catch (error) {
      console.error('Fetch movies for wizard error:', error)
      return rejectWithValue(error.message)
    }
  }
)

export const fetchTheatersForWizard = createAsyncThunk(
  'showtimeWizard/fetchTheatersForWizard',
  async ({ page = 1, size = 100 } = {}, { rejectWithValue }) => {
    try {
      const response = await theaterService.getAllTheaters({ page, size })
      if (response.code === 1000 && response.data) {
        return response.data
      } else {
        throw new Error('Response format không đúng')
      }
    } catch (error) {
      console.error('Fetch theaters for wizard error:', error)
      return rejectWithValue(error.message)
    }
  }
)

export const fetchRoomsByTheater = createAsyncThunk(
  'showtimeWizard/fetchRoomsByTheater',
  async (theaterId, { rejectWithValue }) => {
    try {
      const response = await theaterService.getRoomsByTheaterId(theaterId)
      if (response.code === 1000 && response.data) {
        return response.data
      } else {
        throw new Error('Response format không đúng')
      }
    } catch (error) {
      console.error('Fetch rooms by theater error:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Fetch existing showtimes for Step 2 timeline
export const fetchExistingShowtimes = createAsyncThunk(
  'showtimeWizard/fetchExistingShowtimes',
  async ({ theaterId, movieId, date }, { rejectWithValue }) => {
    try {
      const response = await showtimeManagementService.getShowtimesByTheaterMovieDate({
        theaterId,
        movieId,
        date
      })
      if (response.code === 1000 && response.data) {
        return response.data
      } else {
        throw new Error('Response format không đúng')
      }
    } catch (error) {
      console.error('Fetch existing showtimes error:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Create new showtime
export const createShowtime = createAsyncThunk(
  'showtimeWizard/createShowtime',
  async ({ movieId, roomId, startTime, endTime, price }, { rejectWithValue }) => {
    try {
      const response = await showtimeManagementService.createShowtime({
        movieId,
        roomId,
        startTime,
        endTime,
        price
      })
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

const initialState = {
  // Wizard steps
  currentStep: 1,
  totalSteps: 2, // Step 1: Select movie/theater/room/date, Step 2: Set times/price
  
  // Step 1 data - lưu trữ thông tin admin chọn
  selectedMovieId: null,
  selectedMovie: null,
  selectedTheaterId: null,
  selectedTheater: null,
  selectedRoomId: null,
  selectedRoom: null,
  selectedDate: null,
  
  // Step 2 data - timeline và time selection
  selectedStartTime: null,
  selectedEndTime: null,
  selectedPrice: null,
  existingShowtimes: [], // Danh sách suất chiếu đã có
  timeSlots: [], // Generated time slots for timeline
  
  // API data
  movies: [],
  theaters: [],
  rooms: [],
  
  // Loading states
  moviesLoading: false,
  theatersLoading: false,
  roomsLoading: false,
  existingShowtimesLoading: false,
  createShowtimeLoading: false,
  
  // Error states
  moviesError: null,
  theatersError: null,
  roomsError: null,
  existingShowtimesError: null,
  createShowtimeError: null,
  
  // Modal state
  wizardVisible: false
}

const showtimeWizardSlice = createSlice({
  name: 'showtimeWizard',
  initialState,
  reducers: {
    // Wizard navigation
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload
    },
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        state.currentStep += 1
      }
    },
    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1
      }
    },
    
    // Step 1 actions - lưu thông tin admin chọn vào Redux
    setSelectedMovie: (state, action) => {
      const movie = action.payload
      state.selectedMovieId = movie.id
      state.selectedMovie = movie
    },
    setSelectedTheater: (state, action) => {
      const theater = action.payload
      state.selectedTheaterId = theater.theaterId
      state.selectedTheater = theater
      // Clear room selection when theater changes
      state.selectedRoomId = null
      state.selectedRoom = null
      state.rooms = []
    },
    setSelectedRoom: (state, action) => {
      const room = action.payload
      state.selectedRoomId = room.roomId
      state.selectedRoom = room
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload
    },
    
    // Step 2 actions - timeline time selection
    setSelectedTimeSlot: (state, action) => {
      const { startTime, endTime } = action.payload
      state.selectedStartTime = startTime
      state.selectedEndTime = endTime
    },
    setSelectedPrice: (state, action) => {
      state.selectedPrice = action.payload
    },
    clearTimeSelection: (state) => {
      state.selectedStartTime = null
      state.selectedEndTime = null
      state.selectedPrice = null
    },
    
    // Modal actions
    openWizard: (state) => {
      state.wizardVisible = true
      state.currentStep = 1
    },
    closeWizard: (state) => {
      state.wizardVisible = false
      // Xử lý xóa Redux khi thoát ra - reset tất cả dữ liệu
      state.currentStep = 1
      state.selectedMovieId = null
      state.selectedMovie = null
      state.selectedTheaterId = null
      state.selectedTheater = null
      state.selectedRoomId = null
      state.selectedRoom = null
      state.selectedDate = null
      state.selectedStartTime = null
      state.selectedEndTime = null
      state.selectedPrice = null
      state.existingShowtimes = []
      state.timeSlots = []
      state.rooms = []
      state.moviesError = null
      state.theatersError = null
      state.roomsError = null
      state.existingShowtimesError = null
      state.createShowtimeError = null
    },
    
    // Clear errors
    clearErrors: (state) => {
      state.moviesError = null
      state.theatersError = null
      state.roomsError = null
      state.existingShowtimesError = null
      state.createShowtimeError = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch movies
      .addCase(fetchMoviesForWizard.pending, (state) => {
        state.moviesLoading = true
        state.moviesError = null
      })
      .addCase(fetchMoviesForWizard.fulfilled, (state, action) => {
        state.moviesLoading = false
        state.movies = action.payload.content || []
        state.moviesError = null
      })
      .addCase(fetchMoviesForWizard.rejected, (state, action) => {
        state.moviesLoading = false
        state.moviesError = action.payload
        state.movies = []
      })
      
      // Fetch theaters
      .addCase(fetchTheatersForWizard.pending, (state) => {
        state.theatersLoading = true
        state.theatersError = null
      })
      .addCase(fetchTheatersForWizard.fulfilled, (state, action) => {
        state.theatersLoading = false
        state.theaters = action.payload.content || []
        state.theatersError = null
      })
      .addCase(fetchTheatersForWizard.rejected, (state, action) => {
        state.theatersLoading = false
        state.theatersError = action.payload
        state.theaters = []
      })
      
      // Fetch rooms by theater
      .addCase(fetchRoomsByTheater.pending, (state) => {
        state.roomsLoading = true
        state.roomsError = null
      })
      .addCase(fetchRoomsByTheater.fulfilled, (state, action) => {
        state.roomsLoading = false
        state.rooms = action.payload || []
        state.roomsError = null
      })
      .addCase(fetchRoomsByTheater.rejected, (state, action) => {
        state.roomsLoading = false
        state.roomsError = action.payload
        state.rooms = []
      })
      
      // Fetch existing showtimes
      .addCase(fetchExistingShowtimes.pending, (state) => {
        state.existingShowtimesLoading = true
        state.existingShowtimesError = null
      })
      .addCase(fetchExistingShowtimes.fulfilled, (state, action) => {
        state.existingShowtimesLoading = false
        state.existingShowtimes = action.payload || []
        state.existingShowtimesError = null
        console.log('Existing showtimes loaded successfully:', action.payload)
      })
      .addCase(fetchExistingShowtimes.rejected, (state, action) => {
        state.existingShowtimesLoading = false
        state.existingShowtimesError = action.payload || 'Không thể tải danh sách suất chiếu'
        state.existingShowtimes = [] // Clear existing data on error
        console.error('Failed to load existing showtimes:', action.payload)
      })
      
      // Create showtime
      .addCase(createShowtime.pending, (state) => {
        state.createShowtimeLoading = true
        state.createShowtimeError = null
      })
      .addCase(createShowtime.fulfilled, (state, action) => {
        state.createShowtimeLoading = false
        state.createShowtimeError = null
        // Reset wizard after successful creation
        state.wizardVisible = false
        state.currentStep = 1
        state.selectedMovieId = null
        state.selectedMovie = null
        state.selectedTheaterId = null
        state.selectedTheater = null
        state.selectedRoomId = null
        state.selectedRoom = null
        state.selectedDate = null
        state.selectedStartTime = null
        state.selectedEndTime = null
        state.selectedPrice = null
        state.existingShowtimes = []
        state.timeSlots = []
        state.rooms = []
      })
      .addCase(createShowtime.rejected, (state, action) => {
        state.createShowtimeLoading = false
        state.createShowtimeError = action.payload
      })
  }
})

export const {
  setCurrentStep,
  nextStep,
  prevStep,
  setSelectedMovie,
  setSelectedTheater,
  setSelectedRoom,
  setSelectedDate,
  setSelectedTimeSlot,
  setSelectedPrice,
  clearTimeSelection,
  openWizard,
  closeWizard,
  clearErrors
} = showtimeWizardSlice.actions

export default showtimeWizardSlice.reducer
