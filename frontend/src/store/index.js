import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import movieListReducer from './slices/movieListSlice'
import regionsReducer from './slices/regionsSlice'
import cinemasReducer from './slices/cinemasSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    movieList: movieListReducer,
    regions: regionsReducer,
    cinemas: cinemasReducer,
  },
})
