import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Card, List, Typography, Tag, Space, Button, Empty, Spin, Image, message } from 'antd'
import { ClockCircleOutlined, DollarOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { setSelectedShowtime } from '../../store/slices/showtimesSlice'
import './ShowtimeList.css'

const { Title, Text } = Typography

const ShowtimeList = ({ showtimes, loading, error, selectedTheater, selectedDate }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // Debug Redux state
  console.log('ShowtimeList - Redux state:', { 
    selectedTheater,
    selectedDate, 
    showtimesCount: showtimes.length,
    loading,
    error,
    showtimes: showtimes.map(item => ({ 
      movieTitle: item.movie?.title,
      showtimesCount: item.showtimes?.length
    }))
  })

  if (loading) {
    return (
      <Card className="showtime-list-card">
        <div className="loading-container">
          <Spin size="small" />
          <Text type="secondary">Đang tải lịch chiếu...</Text>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="showtime-list-card">
        <div className="error-container">
          <Text type="danger">{error}</Text>
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
              Rạp: {selectedTheater?.theaterName} • Ngày: {selectedDate ? new Date(selectedDate).toLocaleDateString('vi-VN') : 'Chưa chọn'}
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

  if (!selectedTheater || !selectedDate) {
    return (
      <Card className="showtime-list-card">
        <Empty 
          description="Vui lòng chọn rạp và ngày để xem lịch chiếu"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    )
  }

  if (showtimes.length === 0) {
    return (
      <Card className="showtime-list-card">
        <Empty 
          description={`Không có lịch chiếu tại ${selectedTheater.theaterName} vào ngày ${new Date(selectedDate).toLocaleDateString('vi-VN')}`}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    )
  }

  const handleShowtimeClick = (showtime, movie) => {
    console.log('Selected showtime:', showtime)
    console.log('Selected movie:', movie)
    console.log('Selected theater:', selectedTheater)
    console.log('Selected date:', selectedDate)
    
    // Tạo object chứa đầy đủ thông tin: showtime, movie, theater, date
    const selectedShowtimeData = {
      // Thông tin showtime
      ...showtime,
      // Thông tin movie
      movie: movie,
      // Thông tin theater
      theater: selectedTheater,
      // Thông tin date
      date: selectedDate
    }
    
    console.log('ShowtimeList - Selected showtime data (complete):', selectedShowtimeData)
    console.log('ShowtimeList - About to dispatch setSelectedShowtime')
    
    // Lưu suất chiếu đã chọn (đầy đủ thông tin) vào Redux
    dispatch(setSelectedShowtime(selectedShowtimeData))
    
    console.log('ShowtimeList - About to navigate to /seat-selection')
    
    // Navigate to seat selection
    navigate('/seat-selection')
    
    message.success('Đã chọn suất chiếu!')
  }

  return (
    <Card className="showtime-list-card">
      <div className="showtime-list-header">
        <Title level={4} className="showtime-list-title">
          Lịch chiếu tại {selectedTheater.theaterName}
        </Title>
        <Text type="secondary">
          Ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
        </Text>
      </div>

      <List
        dataSource={showtimes}
        renderItem={(item) => (
          <List.Item className="movie-showtime-item">
            <div className="movie-showtime-content">
              <div className="movie-info2">
                <div className="movie-poster2">
                  <Image
                    width={60}
                    height={80}
                    src={item.movie.posterUrl}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                  />
                </div>
                
                <div className="movie-details2">
                  <Title level={5} className="movie-title">
                    {item.movie.title}
                  </Title>
                  
                  <div className="movie-meta2">
                    <Space wrap>
                      {item.movie.genres?.map(genre => (
                        <Tag key={genre} color="blue" size="small">
                          {genre}
                        </Tag>
                      ))}
                    </Space>
                    
                    <div className="movie-duration2">
                      <ClockCircleOutlined style={{ marginRight: '4px', color: '#8c8c8c' }} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {item.movie.durationMinutes} phút
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="showtimes-section">
                <div className="showtimes-header">
                  <Text strong>Suất chiếu:</Text>
                </div>
                
                <div className="showtimes-grid">
                  {item.showtimes.map((showtime) => (
                    <Button
                      key={showtime.id}
                      type="default"
                      className="showtime-button"
                      onClick={() => handleShowtimeClick(showtime, item.movie)}
                      disabled={showtime.status !== 'ACTIVE'}
                      title={showtime.status !== 'ACTIVE' ? 'Suất chiếu tạm dừng' : undefined}
                    >
                      <div className="showtime-content">
                        <div className="showtime-time">
                          <ClockCircleOutlined style={{ marginRight: '4px' }} />
                          {showtime.time}
                        </div>
                        <div className="showtime-price">
                          {showtime.price.toLocaleString('vi-VN')} đ
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  )
}

export default ShowtimeList
