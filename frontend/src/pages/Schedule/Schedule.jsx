import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col, Button, Card, Typography, Space, Spin, Select } from 'antd'
import { EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons'
import { setSelectedCity, setSelectedDate, fetchTheaters } from '../../store/slices/theatersSlice'
import { selectRegion, updateRegionTheaterCount } from '../../store/slices/regionsSlice'
import { setSelectedTheater, fetchShowtimesByDate } from '../../store/slices/showtimesSlice'
import TheaterList from '../../components/TheaterList'
import ShowtimeList from '../../components/ShowtimeList'
import './Schedule.css'

const { Title, Text } = Typography

const Schedule = () => {
  console.log('🎯 Schedule component is RENDERING!')
  
  const dispatch = useDispatch()
  const { selectedCity, selectedDate, loading: theatersLoading } = useSelector((state) => state.theaters)
  const { regions, selectedRegion } = useSelector((state) => state.regions)
  const { selectedTheater, showtimes, loading: showtimesLoading, error } = useSelector((state) => state.showtimes)
  const { userInfo, token } = useSelector((state) => state.user)
  
  // Lấy danh sách khu vực từ Redux
  const areas = regions.map(region => region.name)
  
  // Debug log
  console.log('Schedule - Render:', {
    regions,
    areas,
    selectedCity,
    selectedDate,
    selectedTheater,
    theatersLoading,
    showtimesLoading
  })

  // Tạo danh sách ngày từ hôm nay đến 5 ngày tới
  const dates = React.useMemo(() => {
    const datesArray = []
    const today = new Date()
    
    for (let i = 0; i < 6; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      datesArray.push({
        date: date.toISOString().split('T')[0], // YYYY-MM-DD format
        day: date.getDate(),
        dayName: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
        month: date.toLocaleDateString('vi-VN', { month: 'short' }),
        isToday: i === 0
      })
    }
    
    return datesArray
  }, []) // Chỉ tạo một lần

  // Set default values on component mount
  useEffect(() => {
    console.log('Schedule - useEffect for default values:', {
      selectedCity,
      areasLength: areas.length,
      regionsLength: regions.length,
      selectedDate
    })
    
    // Luôn set khu vực mặc định là Hà Nội khi component mount
    if (areas.length > 0 && !selectedCity) {
      const defaultRegion = regions.find(region => region.isSelected) || regions.find(region => region.name === 'Hà Nội') || regions[0]
      console.log('Schedule - Setting default city:', defaultRegion.name)
      dispatch(setSelectedCity(defaultRegion.name))
    }
    if (!selectedDate) {
      console.log('Schedule - Setting default date:', dates[0].date)
      dispatch(setSelectedDate(dates[0].date)) // Default to today
    }
  }, []) // Chỉ chạy một lần khi component mount

  // Fetch theaters when city changes
  useEffect(() => {
    if (selectedCity) {
      console.log('Schedule - Fetching theaters for city:', selectedCity)
      dispatch(fetchTheaters(selectedCity)).then((result) => {
        if (result.payload && result.payload.data) {
          // Cập nhật số rạp thực tế
          dispatch(updateRegionTheaterCount({
            regionName: selectedCity,
            theaterCount: result.payload.data.length
          }))
        }
      })
    } else {
      console.log('Schedule - No selectedCity, skipping API call')
    }
  }, [selectedCity, dispatch])

  // Fetch showtimes when theater and date change
  useEffect(() => {
    if (selectedTheater && selectedDate && token) {
      console.log('Schedule - Fetching showtimes for theater:', selectedTheater.theaterId, 'date:', selectedDate)
      dispatch(fetchShowtimesByDate({ 
        theaterId: selectedTheater.theaterId, 
        date: selectedDate, 
        token 
      }))
    }
  }, [selectedTheater, selectedDate, token, dispatch])

  const handleAreaSelect = (area) => {
    console.log('Schedule - handleAreaSelect called with:', area)
    console.log('Schedule - Current selectedCity:', selectedCity)
    console.log('Schedule - Available regions:', regions)
    
    // Cập nhật selectedCity trong Redux
    dispatch(setSelectedCity(area))
    
    // Cập nhật selectedRegion trong Redux
    const selectedRegionData = regions.find(region => region.name === area)
    console.log('Schedule - Found region data:', selectedRegionData)
    if (selectedRegionData) {
      dispatch(selectRegion(selectedRegionData.id))
    }
    
    // Gọi API ngay lập tức khi chọn khu vực
    console.log('Schedule - Calling API immediately for:', area)
    dispatch(fetchTheaters(area))
  }

  const handleDateSelect = (date) => {
    dispatch(setSelectedDate(date))
  }

  const handleTheaterSelect = (theater) => {
    console.log('Schedule - handleTheaterSelect called with:', theater)
    dispatch(setSelectedTheater(theater))
  }

  return (
    <div className="schedule">
      <div className="schedule-header">
        <Title level={2} className="page-title">Lịch chiếu</Title>
        {/* <Text type="secondary" className="page-subtitle">
          Tìm lịch chiếu phim / rạp nhanh nhất với chỉ 1 bước!
        </Text> */}
      </div>

      <div className="schedule-content">
        <Row gutter={[16, 16]}>
          {/* Column 1: Region Selection */}
          <Col xs={24} md={8} lg={6}>
            <Card className="region-card">
              <div className="selector-header">
                <EnvironmentOutlined className="selector-icon" />
                <Title level={4} className="selector-title">Khu vực</Title>
              </div>
              
              <div className="region-list">
                {regions.map((region) => (
                  <div
                    key={region.id}
                    className={`region-item ${selectedCity === region.name ? 'selected' : ''}`}
                    onClick={() => handleAreaSelect(region.name)}
                  >
                    <span className="region-name">{region.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          </Col>

          {/* Column 2: Theater List */}
          <Col xs={24} md={8} lg={6}>
            <TheaterList 
              onTheaterSelect={handleTheaterSelect}
              selectedTheater={selectedTheater}
            />
          </Col>
          
          {/* Column 3: Showtime List */}
          <Col xs={24} md={8} lg={12}>
            <Card className="showtime-card">
              {/* Date Selection */}
              <div className="date-selector">
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

              {/* Instruction Banner */}
              <div className="instruction-banner">
                <Text type="warning">
                  <CalendarOutlined style={{ marginRight: '8px' }} />
                  Nhấn vào suất chiếu để tiến hành mua vé
                </Text>
              </div>

              {/* Showtime List */}
              <ShowtimeList 
                showtimes={showtimes}
                loading={showtimesLoading}
                error={error}
                selectedTheater={selectedTheater}
                selectedDate={selectedDate}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Schedule