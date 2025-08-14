import { configureStore } from '@reduxjs/toolkit'
import moviesReducer from './slices/moviesSlice'
import cinemasReducer from './slices/cinemasSlice'
import regionsReducer from './slices/regionsSlice'

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    cinemas: cinemasReducer,
    regions: regionsReducer,
  },
})
