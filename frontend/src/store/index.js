import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import movieListReducer from './slices/movieListSlice'
import moviesReducer from './slices/moviesSlice'
import theatersReducer from './slices/theatersSlice'
import showtimesReducer from './slices/showtimesSlice'
import regionsReducer from './slices/regionsSlice'
import cinemasReducer from './slices/cinemasSlice'
import seatReducer from './slices/seatSlice'
import foodsReducer from './slices/foodsSlice'
import bookingsReducer from './slices/bookingsSlice'
import chatReducer from './slices/chatSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    movieList: movieListReducer,
    movies: moviesReducer,
    theaters: theatersReducer,
    showtimes: showtimesReducer,
    regions: regionsReducer,
    cinemas: cinemasReducer,
    seats: seatReducer,
    foods: foodsReducer,
    bookings: bookingsReducer,
    chat: chatReducer,
  },
})
