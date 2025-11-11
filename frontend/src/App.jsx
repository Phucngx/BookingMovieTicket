import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { notification as antdNotification } from 'antd'
import { pushNotification } from './store/slices/notificationSlice'
import { chatService } from './services/chatService'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import ScrollToTop from './components/ScrollToTop'
import ChatWidget from './components/ChatWidget'
import Home from './pages/Home/Home'
import MovieDetail from './pages/MovieDetail'
import TheaterBooking from './pages/TheaterBooking'
import Profile from './pages/Profile'
import MovieManagement from './pages/MovieManagement'
import TheaterManagement from './pages/TheaterManagement'
import ShowtimeManagement from './pages/ShowtimeManagement'
import Schedule from './pages/Schedule'
import SeatSelection from './pages/SeatSelection'
import FoodBeverage from './pages/FoodBeverage'
import Payment from './pages/Payment'
import TicketInfo from './pages/TicketInfo'
import Admin from './pages/Admin'
import MyTickets from './pages/MyTickets/MyTickets'
import MovieSearch from './pages/MovieSearch'
import Movies from './pages/Movies'
import NowShowing from './pages/Movies/NowShowing'
import ComingSoon from './pages/Movies/ComingSoon'
import Community from './pages/Community'
import './App.css'

const { Content } = Layout

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, userInfo } = useSelector(state => state.user)

  // Manage secondary websocket (8899) based on login status
  useEffect(() => {
    if (isAuthenticated) {
      chatService.connectAuxSocket((payload) => {
        try {
          // Hiển thị toast cho tất cả user không phải ADMIN
          if ((userInfo?.roleName || '').toUpperCase() !== 'ADMIN' && payload && (payload.title || payload.message)) {
            antdNotification.open({
              message: payload.title || 'Thông báo mới',
              description: payload.message || '',
              placement: 'bottomRight',
              duration: 4,
            })
          }
          dispatch(pushNotification({
            title: payload?.title,
            message: payload?.message,
            createdDate: new Date().toISOString(),
            read: false,
          }))
        } catch (_) {}
      })
      const onUnload = () => {
        try { chatService.disconnectAuxSocket() } catch (_) {}
      }
      window.addEventListener('beforeunload', onUnload)
      return () => {
        window.removeEventListener('beforeunload', onUnload)
        chatService.disconnectAuxSocket()
      }
    } else {
      chatService.disconnectAuxSocket()
    }
  }, [isAuthenticated])

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
            <Route path="/quan-ly-suat-chieu" element={<ShowtimeManagement />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/ve-da-mua" element={<MyTickets />} />
            <Route path="/tim-kiem" element={<MovieSearch />} />
            <Route path="/phim" element={<Movies />} />
            <Route path="/dang-chieu" element={<NowShowing />} />
            <Route path="/sap-chieu" element={<ComingSoon />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </Content>
        <Footer />
        <ChatWidget />
      </Layout>
    </Router>
  )
}

export default App
