import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import Header from './components/Header/Header'
import Home from './pages/Home/Home'
import NowShowing from './pages/Movies/NowShowing'
import Schedule from './pages/Schedule/Schedule'
import Community from './pages/Community/Community'
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
          </Routes>
        </Content>
      </Layout>
    </Router>
  )
}

export default App
