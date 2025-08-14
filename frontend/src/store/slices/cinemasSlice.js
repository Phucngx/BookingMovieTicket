import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cinemas: [
    {
      id: 1,
      name: 'Beta Cinemas',
      logo: 'https://via.placeholder.com/40x40/1890ff/ffffff?text=β',
      locations: [
        { id: 1, name: 'Beta Quang Trung', address: '123 Quang Trung, Q.1' },
        { id: 2, name: 'Beta Trần Quang Khải', address: '456 Trần Quang Khải, Q.1' },
        { id: 3, name: 'Beta Ung Văn Khiêm', address: '789 Ung Văn Khiêm, Q.1' }
      ]
    },
    {
      id: 2,
      name: 'Cinestar',
      logo: 'https://via.placeholder.com/40x40/722ed1/ffffff?text=C',
      locations: [
        { id: 4, name: 'Cinestar Hai Bà Trưng', address: '321 Hai Bà Trưng, Q.1' },
        { id: 5, name: 'Cinestar Quốc Thanh', address: '654 Quốc Thanh, Q.1' },
        { id: 6, name: 'Cinestar Satra Quận 6', address: '987 Satra, Q.6' }
      ]
    },
    {
      id: 3,
      name: 'Dcine',
      logo: 'https://via.placeholder.com/40x40/f5222d/ffffff?text=D',
      locations: [
        { id: 7, name: 'DCINE Bến Thành', address: '147 Bến Thành, Q.1' }
      ]
    },
    {
      id: 4,
      name: 'Mega GS Cinemas',
      logo: 'https://via.placeholder.com/40x40/faad14/ffffff?text=M',
      locations: [
        { id: 8, name: 'Mega GS Thủ Đức', address: '258 Thủ Đức, TP.Thủ Đức' },
        { id: 9, name: 'Mega GS Bình Thạnh', address: '369 Bình Thạnh, Q.Bình Thạnh' }
      ]
    }
  ],
  selectedCinema: null,
  loading: false,
  error: null
}

const cinemasSlice = createSlice({
  name: 'cinemas',
  initialState,
  reducers: {
    setSelectedCinema: (state, action) => {
      state.selectedCinema = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { setSelectedCinema, setLoading, setError } = cinemasSlice.actions
export default cinemasSlice.reducer
