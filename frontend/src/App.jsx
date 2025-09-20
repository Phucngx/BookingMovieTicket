import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home/Home'
import MovieDetail from './pages/MovieDetail'
import TheaterBooking from './pages/TheaterBooking'
import Profile from './pages/Profile'
import MovieManagement from './pages/MovieManagement'
import TheaterManagement from './pages/TheaterManagement'
import Schedule from './pages/Schedule'
import SeatSelection from './pages/SeatSelection'
import FoodBeverage from './pages/FoodBeverage'
import Payment from './pages/Payment'
import TicketInfo from './pages/TicketInfo'
import Admin from './pages/Admin'
import './App.css'

const { Content } = Layout

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout className="app">
        <Header />
        <Content className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/phim/:id" element={<MovieDetail />} />
            <Route path="/mua-ve-theo-rap" element={<TheaterBooking />} />
            <Route path="/lich-chieu" element={<Schedule />} />
            <Route path="/seat-selection" element={<SeatSelection />} />
            <Route path="/bap-nuoc" element={<FoodBeverage />} />
            <Route path="/thanh-toan" element={<Payment />} />
            <Route path="/payment-result" element={<TicketInfo />} />
            <Route path="/tai-khoan" element={<Profile />} />
            <Route path="/quan-ly-phim" element={<MovieManagement />} />
            <Route path="/quan-ly-rap-phim" element={<TheaterManagement />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </Content>
        <Footer />
      </Layout>
    </Router>
  )
}

export default App
