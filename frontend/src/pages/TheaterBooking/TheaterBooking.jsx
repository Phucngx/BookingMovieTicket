import React from 'react'
import { Layout } from 'antd'
import TheaterBookingComponent from '../../components/TheaterBooking'
import './TheaterBooking.css'

const { Content } = Layout

const TheaterBooking = () => {
  return (
    <div className="theater-booking-page">
      <Content className="page-content">
        <div className="container">
          <TheaterBookingComponent />
        </div>
      </Content>
    </div>
  )
}

export default TheaterBooking
