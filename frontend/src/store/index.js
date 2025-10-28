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
import accountManagementReducer from './slices/userManagementSlice'
import roleReducer from './slices/roleSlice'
import showtimeManagementReducer from './slices/showtimeManagementSlice'
import showtimeWizardReducer from './slices/showtimeWizardSlice'
import bookingManagementReducer from './slices/bookingManagementSlice'
import nowShowingReducer from './slices/nowShowingSlice'
import comingSoonReducer from './slices/comingSoonSlice'
import otpReducer from './slices/otpSlice'

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
    accountManagement: accountManagementReducer,
    roles: roleReducer,
    showtimeManagement: showtimeManagementReducer,
    showtimeWizard: showtimeWizardReducer,
    bookingManagement: bookingManagementReducer,
    nowShowing: nowShowingReducer,
    comingSoon: comingSoonReducer,
    otp: otpReducer,
  },
})
