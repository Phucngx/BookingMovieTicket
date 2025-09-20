import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Modal, Typography, Button, Space, Spin, Empty, message } from 'antd'
import { ClockCircleOutlined, DollarOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { fetchShowtimesByDate, fetchShowtimesByTheaterMovieDate, clearError, setSelectedShowtime } from '../../store/slices/showtimesSlice'
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
  const navigate = useNavigate()
  const { showtimes, loading, error } = useSelector((state) => state.showtimes)
  const { token } = useSelector((state) => state.user)

  // Fetch showtimes when modal opens
  useEffect(() => {
    if (visible && theater && date && token) {
      if (movie?.id) {
        console.log('Fetching showtimes by theater+movie+date with params:', {
          theaterId: theater.theaterId,
          movieId: movie.id,
          date: date
        })
        dispatch(fetchShowtimesByTheaterMovieDate({
          theaterId: theater.theaterId,
          movieId: movie.id,
          date: date,
          token: token
        }))
      } else {
        console.log('Fetching showtimes by theater+date with params:', {
          theaterId: theater.theaterId,
          date: date
        })
        dispatch(fetchShowtimesByDate({
          theaterId: theater.theaterId,
          date: date,
          token: token
        }))
      }
    }
  }, [visible, theater, movie, date, token, dispatch])

  // Clear error when modal closes
  useEffect(() => {
    if (!visible) {
      dispatch(clearError())
    }
  }, [visible, dispatch])

  const handleShowtimeSelect = (showtime, movie) => {
    // Tạo object chứa đầy đủ thông tin: showtime, movie, theater, date
    const selectedShowtimeData = {
      // Thông tin showtime
      ...showtime,
      // Thông tin movie
      movie: movie,
      // Thông tin theater
      theater: theater,
      // Thông tin date
      date: date
    }
    
    console.log('ShowtimeModal - Selected showtime data (complete):', selectedShowtimeData)
    console.log('ShowtimeModal - About to dispatch setSelectedShowtime')
    
    // Lưu suất chiếu đã chọn (đầy đủ thông tin) vào Redux
    dispatch(setSelectedShowtime(selectedShowtimeData))
    
    console.log('ShowtimeModal - About to navigate to /seat-selection')
    
    // Navigate to seat selection
    navigate('/seat-selection')
    
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
                onClick={() => dispatch(fetchShowtimesByDate({
                  theaterId: theater.theaterId,
                  date: date,
                  token: token
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

        {/* Render list when API returns nested by movie (no movie filter) */}
        {!loading && !error && Array.isArray(showtimes) && showtimes[0]?.movie && (
          <div className="showtimes-container">
            {showtimes.map((movieShowtime) => (
              <div key={movieShowtime.movie.id} className="movie-showtime-section">
                <div className="movie-info">
                  <Title level={5}>{movieShowtime.movie.title}</Title>
                  <Text type="secondary">
                    {movieShowtime.movie.genres?.join(', ')} • {movieShowtime.movie.durationMinutes} phút
                  </Text>
                </div>
                <div className="showtimes-grid">
                  {movieShowtime.showtimes.map((showtime) => (
                    <div 
                      key={showtime.id} 
                      className="showtime-card"
                      onClick={() => handleShowtimeSelect(showtime, movieShowtime.movie)}
                    >
                      <div className="showtime-time">
                        <ClockCircleOutlined className="time-icon" />
                        <div className="time-text">{showtime.time}</div>
                      </div>
                      <div className="showtime-price">
                        {/* <DollarOutlined className="price-icon" /> */}
                        <Text className="price-text">{showtime.price.toLocaleString('vi-VN')}</Text>
                      </div>
                      <div className="showtime-room">
                        <Text type="secondary" className="room-text">Phòng {showtime.roomId}</Text>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Render flat list when API returns theater+movie+date shape */}
        {!loading && !error && Array.isArray(showtimes) && !showtimes[0]?.movie && showtimes.length > 0 && (
          <div className="showtimes-container">
            <div className="movie-info">
              <Title level={5}>{movie?.title}</Title>
              <Text type="secondary">{new Date(date).toLocaleDateString('vi-VN')}</Text>
            </div>
            <div className="showtimes-grid">
              {showtimes.map((st) => (
                <div 
                  key={st.showtimeId}
                  className="showtime-card"
                  onClick={() => handleShowtimeSelect({
                    id: st.showtimeId,
                    time: new Date(st.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                    price: st.price,
                    roomId: st.roomId
                  }, movie)}
                >
                  <div className="showtime-time">
                    <ClockCircleOutlined className="time-icon" />
                    <div className="time-text">{new Date(st.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <div className="showtime-price">
                    {/* <DollarOutlined className="price-icon" /> */}
                    <Text className="price-text">{st.price.toLocaleString('vi-VN')}</Text>
                  </div>
                  <div className="showtime-room">
                    <Text type="secondary" className="room-text">Phòng {st.roomId}</Text>
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
