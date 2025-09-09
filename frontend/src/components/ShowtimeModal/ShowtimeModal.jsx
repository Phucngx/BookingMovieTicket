import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Typography, Button, Space, Spin, Empty, message } from 'antd'
import { ClockCircleOutlined, DollarOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { fetchShowtimes, setSelectedShowtime, clearError } from '../../store/slices/showtimesSlice'
import './ShowtimeModal.css'

const { Title, Text } = Typography

const ShowtimeModal = ({ 
  visible, 
  onCancel, 
  theater, 
  movie, 
  date,
  onSelectShowtime 
}) => {
  const dispatch = useDispatch()
  const { showtimes, loading, error } = useSelector((state) => state.showtimes)

  // Fetch showtimes when modal opens
  useEffect(() => {
    if (visible && theater && movie && date) {
      console.log('Fetching showtimes with params:', {
        theaterId: theater.theaterId,
        movieId: movie.id,
        date: date,
        theater: theater,
        movie: movie
      })
      dispatch(fetchShowtimes({
        theaterId: theater.theaterId,
        movieId: movie.id,
        date: date
      }))
    }
  }, [visible, theater, movie, date, dispatch])

  // Clear error when modal closes
  useEffect(() => {
    if (!visible) {
      dispatch(clearError())
    }
  }, [visible, dispatch])

  const handleShowtimeSelect = (showtime) => {
    dispatch(setSelectedShowtime(showtime))
    onSelectShowtime(showtime)
    onCancel()
    message.success('Đã chọn suất chiếu!')
  }

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString)
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return (
    <Modal
      title={
        <div className="showtime-modal-header">
          <VideoCameraOutlined className="modal-icon" />
          <div>
            <Title level={4} className="modal-title">
              Lịch chiếu - {theater?.theaterName}
            </Title>
            <Text type="secondary">
              {movie?.title} • {new Date(date).toLocaleDateString('vi-VN')}
            </Text>
          </div>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      className="showtime-modal"
      centered
    >
      <div className="showtime-modal-content">
        {loading && (
          <div className="loading-container">
            <Spin size="large" />
            <Text type="secondary">Đang tải lịch chiếu...</Text>
          </div>
        )}

        {error && (
          <div className="error-container">
            <Text type="danger">{error}</Text>
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                Rạp: {theater?.theaterName} • Phim: {movie?.title} • Ngày: {new Date(date).toLocaleDateString('vi-VN')}
              </Text>
              <Button 
                type="primary" 
                onClick={() => dispatch(fetchShowtimes({
                  theaterId: theater.theaterId,
                  movieId: movie.id,
                  date: date
                }))}
              >
                Thử lại
              </Button>
            </div>
          </div>
        )}

        {!loading && !error && showtimes.length === 0 && (
          <Empty 
            description="Không có suất chiếu nào cho ngày này"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}

        {!loading && !error && showtimes.length > 0 && (
          <div className="showtimes-container">
            <div className="showtimes-grid">
              {showtimes.map((showtime) => (
                <div 
                  key={showtime.showtimeId} 
                  className="showtime-card"
                  onClick={() => handleShowtimeSelect(showtime)}
                >
                  <div className="showtime-time">
                    <ClockCircleOutlined className="time-icon" />
                    <div className="time-text">
                      <div className="start-time">
                        {formatTime(showtime.startTime)}
                      </div>
                      <div className="end-time">
                        ~ {formatTime(showtime.endTime)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="showtime-price">
                    <DollarOutlined className="price-icon" />
                    <Text className="price-text">
                      {formatPrice(showtime.price)}
                    </Text>
                  </div>
                  
                  <div className="showtime-room">
                    <Text type="secondary" className="room-text">
                      Phòng {showtime.roomId}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ShowtimeModal
