import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Card, List, Typography, Tag, Space, Button, Empty } from 'antd'
import { EnvironmentOutlined, PhoneOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons'
import ShowtimeModal from '../ShowtimeModal'
import './TheaterList.css'

const { Title, Text } = Typography

const TheaterList = ({ movie }) => {
  const { theaters, selectedCity, selectedDate, loading, error } = useSelector((state) => state.theaters)
  const [showtimeModalVisible, setShowtimeModalVisible] = useState(false)
  const [selectedTheater, setSelectedTheater] = useState(null)

  // Debug Redux state
  console.log('TheaterList - Redux state:', { 
    selectedCity, 
    selectedDate, 
    theatersCount: theaters.length,
    theaters: theaters.map(t => ({ name: t.theaterName, city: t.city, district: t.district }))
  })

  if (loading) {
    return (
      <Card className="theater-list-card">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <Text type="secondary">Đang tải danh sách rạp...</Text>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="theater-list-card">
        <div className="error-container">
          <Text type="danger">{error}</Text>
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
              Khu vực: {selectedCity} • Ngày: {selectedDate ? new Date(selectedDate).toLocaleDateString('vi-VN') : 'Chưa chọn'}
            </Text>
            <Button 
              type="primary" 
              onClick={() => window.location.reload()}
            >
              Thử lại
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  if (!selectedCity || !selectedDate) {
    return (
      <Card className="theater-list-card">
        <Empty 
          description="Vui lòng chọn thành phố và ngày để xem danh sách rạp"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    )
  }

  if (theaters.length === 0) {
    return (
      <Card className="theater-list-card">
        <Empty 
          description={`Không có rạp nào tại ${selectedCity}`}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    )
  }

  const handleShowtimeClick = (theater) => {
    setSelectedTheater(theater)
    setShowtimeModalVisible(true)
  }

  const handleSelectShowtime = (showtime) => {
    // Handle showtime selection - can navigate to seat selection or booking
    console.log('Selected showtime:', showtime)
    console.log('Selected theater:', selectedTheater)
    console.log('Movie:', movie)
    console.log('Date:', selectedDate)
  }

  return (
    <Card className="theater-list-card">
      <div className="theater-list-header">
        <Title level={4} className="theater-list-title">
          Danh sách rạp tại {selectedCity}
        </Title>
        <Text type="secondary">
          Ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
        </Text>
      </div>

      <List
        dataSource={theaters}
        renderItem={(theater) => (
          <List.Item className="theater-item">
            <div className="theater-content">
              <div className="theater-header">
                <Title level={5} className="theater-name">
                  {theater.theaterName}
                </Title>
                <Tag color="blue" className="theater-tag">
                  {theater.totalRooms} phòng
                </Tag>
              </div>
              
              <div className="theater-info">
                <div className="theater-address">
                  <EnvironmentOutlined className="info-icon" />
                  <Text className="info-text">
                    {theater.address}
                  </Text>
                </div>
                
                <div className="theater-phone">
                  <PhoneOutlined className="info-icon" />
                  <Text className="info-text">
                    {theater.phone}
                  </Text>
                </div>
                
                <div className="theater-manager">
                  <UserOutlined className="info-icon" />
                  <Text className="info-text">
                    {theater.managerName}
                  </Text>
                </div>
              </div>
              
              <div className="theater-actions">
                <Space>
                  <Button 
                    type="primary" 
                    icon={<VideoCameraOutlined />}
                    className="book-button"
                    onClick={() => handleShowtimeClick(theater)}
                  >
                    Xem lịch chiếu
                  </Button>
                  <Button type="default">
                    Thông tin rạp
                  </Button>
                </Space>
              </div>
            </div>
          </List.Item>
        )}
      />

      <ShowtimeModal
        visible={showtimeModalVisible}
        onCancel={() => setShowtimeModalVisible(false)}
        theater={selectedTheater}
        movie={movie}
        date={selectedDate}
        onSelectShowtime={handleSelectShowtime}
      />
    </Card>
  )
}

export default TheaterList
