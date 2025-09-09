import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import movieListReducer from './slices/movieListSlice'
import moviesReducer from './slices/moviesSlice'
import theatersReducer from './slices/theatersSlice'
import showtimesReducer from './slices/showtimesSlice'
import regionsReducer from './slices/regionsSlice'
import cinemasReducer from './slices/cinemasSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    movieList: movieListReducer,
    movies: moviesReducer,
    theaters: theatersReducer,
    showtimes: showtimesReducer,
    regions: regionsReducer,
    cinemas: cinemasReducer,
  },
})
