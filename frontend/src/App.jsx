import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import Header from './components/Header/Header'
import Home from './pages/Home/Home'
import NowShowing from './pages/Movies/NowShowing'
import Schedule from './pages/Schedule/Schedule'
import Community from './pages/Community/Community'
import MovieDetail from './pages/MovieDetail/MovieDetail'
import SeatSelection from './pages/SeatSelection/SeatSelection'
import FoodBeverage from './pages/FoodBeverage/FoodBeverage'
import Payment from './pages/Payment/Payment'
import TicketInfo from './pages/TicketInfo/TicketInfo'
import './App.css'

const { Content } = Layout

function App() {
  return (
    <Router>
      <Layout className="app">
        <Header />
        <Content className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dang-chieu" element={<NowShowing />} />
            <Route path="/lich-chieu" element={<Schedule />} />
            <Route path="/community" element={<Community />} />
            <Route path="/phim/:id" element={<MovieDetail />} />
            <Route path="/chon-ghe" element={<SeatSelection />} />
            <Route path="/bap-nuoc" element={<FoodBeverage />} />
            <Route path="/thanh-toan" element={<Payment />} />
            <Route path="/thong-tin-ve" element={<TicketInfo />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  )
}

export default App
