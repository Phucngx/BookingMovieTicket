import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { theaterService } from '../../services/theaterService'

export const fetchFoods = createAsyncThunk(
  'foods/fetchFoods',
  async ({ page = 1, size = 20, token }, { rejectWithValue }) => {
    try {
      const response = await theaterService.getFoods({ page, size, token })
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  items: [],
  page: 1,
  size: 20,
  total: 0,
  loading: false,
  error: null,
  selections: {}
}

const foodsSlice = createSlice({
  name: 'foods',
  initialState,
  reducers: {
    setSelection(state, action) {
      const { food, quantity } = action.payload
      const id = food.id
      if (quantity <= 0) {
        delete state.selections[id]
      } else {
        state.selections[id] = { ...food, quantity }
      }
    },
    clearSelections(state) {
      state.selections = {}
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoods.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFoods.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload
        const content = payload?.data?.content || []
        state.items = content.map((f) => ({
          id: f.foodId,
          name: f.foodName,
          type: f.foodType,
          price: f.price,
          image: f.foodUrl
        }))
        state.total = payload?.data?.totalElements || content.length
      })
      .addCase(fetchFoods.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { setSelection, clearSelections } = foodsSlice.actions
export default foodsSlice.reducer


