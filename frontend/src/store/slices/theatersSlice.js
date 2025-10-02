import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { theaterService } from '../../services/theaterService'

// Async thunks
export const fetchTheaters = createAsyncThunk(
  'theaters/fetchTheaters',
  async (city, { rejectWithValue }) => {
    try {
      const response = await theaterService.getTheaters(city)
      return response.data || []
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchAllTheaters = createAsyncThunk(
  'theaters/fetchAllTheaters',
  async ({ page = 1, size = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await theaterService.getAllTheaters({ page, size })
      return {
        content: response.data?.content || [],
        totalElements: response.data?.totalElements || 0,
        totalPages: response.data?.totalPages || 0,
        currentPage: response.data?.pageable?.pageNumber || 0
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const addTheater = createAsyncThunk(
  'theaters/addTheater',
  async (theaterData, { rejectWithValue }) => {
    try {
      const response = await theaterService.createTheater(theaterData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateTheater = createAsyncThunk(
  'theaters/updateTheater',
  async ({ theaterId, theaterData }, { rejectWithValue }) => {
    try {
      const response = await theaterService.updateTheater(theaterId, theaterData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteTheater = createAsyncThunk(
  'theaters/deleteTheater',
  async (theaterId, { rejectWithValue }) => {
    try {
      await theaterService.deleteTheater(theaterId)
      return theaterId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchTheaterById = createAsyncThunk(
  'theaters/fetchTheaterById',
  async (theaterId, { rejectWithValue }) => {
    try {
      console.log('Fetching theater by ID:', theaterId)
      const response = await theaterService.getTheaterById(theaterId)
      console.log('Theater service response:', response)
      
      // Kiểm tra response format
      if (response.code === 1000 && response.data) {
        console.log('Returning theater data:', response.data)
        return response.data
      } else {
        throw new Error('Response format không đúng')
      }
    } catch (error) {
      console.error('Fetch theater by ID error:', error)
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  theaters: [],
  currentTheater: null,
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  pageSize: 10,
  selectedCity: null,
  selectedDate: null
}

const theatersSlice = createSlice({
  name: 'theaters',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload
    },
    clearCurrentTheater: (state) => {
      state.currentTheater = null
    },
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch theaters
      .addCase(fetchTheaters.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTheaters.fulfilled, (state, action) => {
        state.loading = false
        state.theaters = action.payload
        state.error = null
      })
      .addCase(fetchTheaters.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch all theaters
      .addCase(fetchAllTheaters.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllTheaters.fulfilled, (state, action) => {
        state.loading = false
        state.theaters = action.payload.content
        state.total = action.payload.totalElements
        state.currentPage = action.payload.currentPage + 1 // API trả về 0-based, UI dùng 1-based
        state.error = null
      })
      .addCase(fetchAllTheaters.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Add theater
      .addCase(addTheater.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addTheater.fulfilled, (state, action) => {
        state.loading = false
        state.theaters.push(action.payload)
        state.total += 1
        state.error = null
      })
      .addCase(addTheater.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Update theater
      .addCase(updateTheater.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateTheater.fulfilled, (state, action) => {
        state.loading = false
        const index = state.theaters.findIndex(theater => theater.theaterId === action.payload.theaterId)
        if (index !== -1) {
          state.theaters[index] = action.payload
        }
        state.error = null
      })
      .addCase(updateTheater.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Delete theater
      .addCase(deleteTheater.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteTheater.fulfilled, (state, action) => {
        state.loading = false
        state.theaters = state.theaters.filter(theater => theater.theaterId !== action.payload)
        state.total -= 1
        state.error = null
      })
      .addCase(deleteTheater.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch theater by ID
      .addCase(fetchTheaterById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTheaterById.fulfilled, (state, action) => {
        state.loading = false
        state.currentTheater = action.payload
        state.error = null
      })
      .addCase(fetchTheaterById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearError, setCurrentPage, setPageSize, clearCurrentTheater, setSelectedCity, setSelectedDate } = theatersSlice.actions
export default theatersSlice.reducer