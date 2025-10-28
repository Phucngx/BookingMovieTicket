import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Card, List, Typography, Tag, Space, Button, Empty, Modal, Descriptions, message, Spin } from 'antd'
import { EnvironmentOutlined, PhoneOutlined, UserOutlined, VideoCameraOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { theaterService } from '../../services/theaterService'
import ShowtimeModal from '../ShowtimeModal'
import './TheaterList.css'

const { Title, Text } = Typography

const TheaterList = ({ movie, onTheaterSelect, selectedTheater }) => {
  const { theaters, selectedCity, selectedDate, loading, error } = useSelector((state) => state.theaters)
  const [showtimeModalVisible, setShowtimeModalVisible] = useState(false)
  const [internalSelectedTheater, setInternalSelectedTheater] = useState(null)
  const [theaterDetailModalVisible, setTheaterDetailModalVisible] = useState(false)
  const [theaterDetail, setTheaterDetail] = useState(null)
  const [theaterDetailLoading, setTheaterDetailLoading] = useState(false)

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
    if (onTheaterSelect) {
      onTheaterSelect(theater)
    } else {
      setInternalSelectedTheater(theater)
      setShowtimeModalVisible(true)
    }
  }

  const handleSelectShowtime = (showtime) => {
    // Handle showtime selection - can navigate to seat selection or booking
    console.log('Selected showtime:', showtime)
    console.log('Selected theater:', selectedTheater)
    console.log('Movie:', movie)
    console.log('Date:', selectedDate)
  }

  const handleTheaterInfoClick = async (theater) => {
    try {
      setTheaterDetailLoading(true)
      setTheaterDetailModalVisible(true)
      const response = await theaterService.getTheaterDetail(theater.theaterId)
      if (response.code === 1000 && response.data) {
        setTheaterDetail(response.data)
      } else {
        message.error('Không thể lấy thông tin rạp phim')
      }
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi tải thông tin rạp')
    } finally {
      setTheaterDetailLoading(false)
    }
  }

  const handleTheaterDetailClose = () => {
    setTheaterDetailModalVisible(false)
    setTheaterDetail(null)
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
                    type={selectedTheater?.theaterId === theater.theaterId ? "primary" : "default"}
                    icon={<VideoCameraOutlined />}
                    className="book-button"
                    onClick={() => handleShowtimeClick(theater)}
                  >
                    {selectedTheater?.theaterId === theater.theaterId ? "Đã chọn" : "Xem lịch chiếu"}
                  </Button>
                  <Button 
                    type="default"
                    icon={<InfoCircleOutlined />}
                    onClick={() => handleTheaterInfoClick(theater)}
                  >
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
        theater={internalSelectedTheater}
        movie={movie}
        date={selectedDate}
        onSelectShowtime={handleSelectShowtime}
      />

      {/* Theater Detail Modal */}
      <Modal
        title={
          <Space>
            <InfoCircleOutlined />
            Thông tin rạp phim
          </Space>
        }
        open={theaterDetailModalVisible}
        onCancel={handleTheaterDetailClose}
        footer={[
          <Button key="close" onClick={handleTheaterDetailClose}>
            Đóng
          </Button>
        ]}
        width={600}
        destroyOnClose
      >
        <Spin spinning={theaterDetailLoading}>
          {theaterDetail && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Tên rạp">
                <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                  {theaterDetail.theaterName}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <EnvironmentOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
                    <Text>{theaterDetail.address}</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px', marginLeft: '24px' }}>
                    {theaterDetail.district}, {theaterDetail.city}
                  </Text>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
                  <Text>{theaterDetail.phone}</Text>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Quản lý">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <UserOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
                  <Text>{theaterDetail.managerName}</Text>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Số phòng chiếu">
                <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                  {theaterDetail.totalRooms} phòng
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          )}
        </Spin>
      </Modal>
    </Card>
  )
}

export default TheaterList
