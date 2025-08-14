import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  movies: [
    {
      id: 1,
      title: 'Mang Mẹ Đi Bò',
      poster: 'data:image/jpeg;base64,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',
      date: '01/08',
      rating: 68,
      isEarlyShow: false,
      isComingSoon: false,
      genre: 'comedy',
      language: 'vietnamese'
    },
    {
      id: 2,
      title: 'Thanh Gươm Diệt Quỷ',
      poster: 'data:image/jpeg;base64,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',
      date: '15/08',
      rating: null,
      isEarlyShow: true,
      isComingSoon: false,
      genre: 'action',
      language: 'japanese'
    },
    {
      id: 3,
      title: 'Dính Leo',
      poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
      date: '15/08',
      rating: null,
      isEarlyShow: true,
      isComingSoon: false
    },
    {
      id: 4,
      title: 'Zombie Cung Bà',
      poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
      date: '08/08',
      rating: 100,
      isEarlyShow: false,
      isComingSoon: false
    },
    {
      id: 5,
      title: 'Kẻ Vô Danh 2',
      poster: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=600&fit=crop',
      date: '15/08',
      rating: null,
      isEarlyShow: false,
      isComingSoon: true
    },
    {
      id: 6,
      title: 'Conan Movie 27',
      poster: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop',
      date: '25/07',
      rating: 92,
      isEarlyShow: false,
      isComingSoon: false
    },
    {
      id: 7,
      title: 'Tôi Có Bệnh Tình Yêu',
      poster: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&h=600&fit=crop',
      date: '15/08',
      rating: null,
      isEarlyShow: false,
      isComingSoon: true
    },
    {
      id: 8,
      title: 'Ngày Thứ Sáu Đen Tối',
      poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
      date: '15/08',
      rating: null,
      isEarlyShow: false,
      isComingSoon: true
    }
  ],
  selectedMovie: null,
  loading: false,
  error: null
}

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { setSelectedMovie, setLoading, setError } = moviesSlice.actions
export default moviesSlice.reducer
