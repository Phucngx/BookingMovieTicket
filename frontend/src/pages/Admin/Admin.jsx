import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import Dashboard from './Dashboard'
import MovieManagement from '../MovieManagement'
import TheaterManagement from '../TheaterManagement'
import ShowtimeManagement from '../ShowtimeManagement'
import BookingManagement from '../BookingManagement'
import TheaterDetail from '../../components/TheaterDetail'
import RoomManagement from '../../components/RoomManagement'
import AccountManagement from './Users'
import AccountDetail from '../../components/AccountDetail'
import Settings from './Settings'

const Admin = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/movies" element={<MovieManagement />} />
        <Route path="/theaters" element={<TheaterManagement />} />
        <Route path="/theaters/:theaterId" element={<TheaterDetail />} />
        <Route path="/theaters/:theaterId/rooms" element={<RoomManagement />} />
        <Route path="/showtimes" element={<ShowtimeManagement />} />
        <Route path="/bookings" element={<BookingManagement />} />
        <Route path="/users" element={<AccountManagement />} />
        <Route path="/accounts/:accountId" element={<AccountDetail />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AdminLayout>
  )
}

export default Admin
