import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import Dashboard from './Dashboard'
import MovieManagement from '../MovieManagement'
import TheaterManagement from '../TheaterManagement'
import TheaterDetail from '../../components/TheaterDetail'
import RoomManagement from '../../components/RoomManagement'
import Users from './Users'
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
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AdminLayout>
  )
}

export default Admin
