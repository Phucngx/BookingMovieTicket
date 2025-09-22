import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col, Button, Card, Typography, Space, Spin, Select } from 'antd'
import { EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons'
import { setSelectedCity, setSelectedDate, fetchTheaters } from '../../store/slices/theatersSlice'
import './BookingSelector.css'

const { Title, Text } = Typography

const BookingSelector = () => {
  const dispatch = useDispatch()
  const { selectedCity, selectedDate, loading } = useSelector((state) => state.theaters)
  
  // Danh sách tỉnh thành
  const cities = [
    'Hà Nội',
    'TP. Hồ Chí Minh',
    'Bình Dương',
    'Đà Nẵng',
    'Cần Thơ',
    'Đồng Nai',
    'An Giang',
    'Hải Phòng',
    'Nha Trang',
    'Huế',
    'Vũng Tàu',
    'Quảng Ninh',
    'Thái Nguyên',
    'Bắc Ninh',
    'Hải Dương',
    'Nam Định',
    'Thái Bình',
    'Ninh Bình',
    'Thanh Hóa',
    'Nghệ An',
    'Hà Tĩnh',
    'Quảng Bình',
    'Quảng Trị',
    'Quảng Nam',
    'Quảng Ngãi',
    'Bình Định',
    'Phú Yên',
    'Khánh Hòa',
    'Ninh Thuận',
    'Bình Thuận',
    'Lâm Đồng',
    'Bình Phước',
    'Tây Ninh',
    'Bà Rịa - Vũng Tàu',
    'Long An',
    'Tiền Giang',
    'Bến Tre',
    'Trà Vinh',
    'Vĩnh Long',
    'Đồng Tháp',
    'Kiên Giang',
    'Cà Mau',
    'Bạc Liêu',
    'Sóc Trăng',
    'Hậu Giang'
  ]

  // Tạo danh sách ngày từ hôm nay đến 5 ngày tới
  const generateDates = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 0; i < 6; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      dates.push({
        date: date.toISOString().split('T')[0], // YYYY-MM-DD format
        day: date.getDate(),
        dayName: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
        month: date.toLocaleDateString('vi-VN', { month: 'short' }),
        isToday: i === 0
      })
    }
    
    return dates
  }

  const dates = generateDates()

  // Set default values on component mount
  useEffect(() => {
    if (!selectedCity) {
      dispatch(setSelectedCity(cities[0])) // Default to first city
    }
    if (!selectedDate) {
      dispatch(setSelectedDate(dates[0].date)) // Default to today
    }
  }, [dispatch, selectedCity, selectedDate, cities, dates])

  // Fetch theaters when city changes
  useEffect(() => {
    if (selectedCity) {
      dispatch(fetchTheaters(selectedCity))
    }
  }, [selectedCity, dispatch])

  const handleCitySelect = (city) => {
    dispatch(setSelectedCity(city))
  }

  const handleDateSelect = (date) => {
    dispatch(setSelectedDate(date))
  }

  return (
    <div className="booking-selector">
      <Card className="selector-card">
        {/* City Selection */}
        <div className="selector-section">
          <div className="selector-header">
            <EnvironmentOutlined className="selector-icon" />
            <Title level={4} className="selector-title">Chọn tỉnh thành</Title>
          </div>
          
          <Select
            value={selectedCity}
            onChange={handleCitySelect}
            placeholder="Chọn tỉnh thành"
            className="city-select"
            size="large"
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={cities.map(city => ({
              value: city,
              label: city
            }))}
          />
        </div>

        {/* Date Selection */}
        <div className="selector-section">
          <div className="selector-header">
            <CalendarOutlined className="selector-icon" />
            <Title level={4} className="selector-title">Chọn ngày</Title>
          </div>
          
          <div className="dates-grid">
            {dates.map((dateInfo) => (
              <Button
                key={dateInfo.date}
                type={selectedDate === dateInfo.date ? 'primary' : 'default'}
                className={`date-button ${selectedDate === dateInfo.date ? 'selected' : ''} ${dateInfo.isToday ? 'today' : ''}`}
                onClick={() => handleDateSelect(dateInfo.date)}
              >
                <div className="date-content">
                  <div className="date-day">{dateInfo.day}</div>
                  <div className="date-month">{dateInfo.month}</div>
                  <div className="date-name">{dateInfo.dayName}</div>
                  {dateInfo.isToday && <div className="today-label">Hôm nay</div>}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="loading-section">
            <Spin size="small" />
            <Text type="secondary">Đang tải danh sách rạp...</Text>
          </div>
        )}
      </Card>
    </div>
  )
}

export default BookingSelector
