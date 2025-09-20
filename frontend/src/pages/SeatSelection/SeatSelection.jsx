import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Typography, 
  Row, 
  Col, 
  Button, 
  Card, 
  Space,
  Divider,
  Spin,
  message
} from 'antd';
import { 
  LeftOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { fetchSeatsByShowtimeId, toggleSeatSelection, clearError, clearSelectedSeats } from '../../store/slices/seatSlice';
import './SeatSelection.css';

const { Title, Text } = Typography;

const SeatSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Lấy dữ liệu từ Redux
  const { selectedShowtime } = useSelector((state) => state.showtimes);
  const { layout, seats, selectedSeats, loading, error } = useSelector((state) => state.seats);
  const { token } = useSelector((state) => state.user);
  
  const [currentStep, setCurrentStep] = useState(1);

  // Debug logs
  console.log('SeatSelection - Component rendered');
  console.log('SeatSelection - selectedShowtime:', selectedShowtime);
  console.log('SeatSelection - token:', token ? 'present' : 'missing');
  console.log('SeatSelection - loading:', loading);
  console.log('SeatSelection - error:', error);

  // Fetch seats when component mounts
  useEffect(() => {
    console.log('SeatSelection - useEffect triggered');
    console.log('SeatSelection - selectedShowtime:', selectedShowtime);
    console.log('SeatSelection - token:', token ? 'present' : 'missing');
    
    if (selectedShowtime && selectedShowtime.id && token) {
      console.log('SeatSelection - Fetching seats for showtime:', selectedShowtime.id);
      dispatch(fetchSeatsByShowtimeId({
        showtimeId: selectedShowtime.id,
        token: token
      }));
    } else if (!selectedShowtime) {
      console.log('SeatSelection - No selectedShowtime, redirecting to home');
      // Redirect to home if no selected showtime
      navigate('/');
    } else {
      console.log('SeatSelection - Missing required data:', {
        selectedShowtime: !!selectedShowtime,
        showtimeId: selectedShowtime?.id,
        token: !!token
      });
    }
  }, [selectedShowtime, token, dispatch, navigate]);

// Clear error on unmount
useEffect(() => {
  return () => {
    dispatch(clearError());
  };
}, [dispatch]);

// Reset selected seats on fresh entry unless returning with preserve flag
useEffect(() => {
  if (!location.state?.preserveSelections) {
    dispatch(clearSelectedSeats());
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [selectedShowtime?.id]);

  const handleSeatClick = (seatId) => {
    const seat = seats.find(s => s.seatId === seatId);
    if (!seat || seat.status !== 'AVAILABLE') {
      message.warning('Ghế này không thể chọn');
      return;
    }
    
    dispatch(toggleSeatSelection(seatId));
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      message.warning('Vui lòng chọn ít nhất một ghế');
      return;
    }
    
    // Chuyển sang bước tiếp theo: Bắp nước
    navigate('/bap-nuoc', {
      state: {
        selectedShowtime,
        selectedSeats,
        totalPrice: getTotalPrice()
      }
    });
  };

  const getTotalPrice = () => {
    if (!selectedSeats.length) return 0;
    return selectedSeats.reduce((total, seat) => total + (seat?.price || 0), 0);
  };

  const getSeatStatus = (seat) => {
    if (selectedSeats.find(s => s.seatId === seat.seatId)) return 'selected';
    if (seat.status === 'BOOKED') return 'sold';
    if (seat.status === 'AVAILABLE') return 'available';
    return 'unavailable';
  };

  const getSeatType = (seat) => {
    return seat.seatType === 'VIP' ? 'vip' : 'standard';
  };

  if (!selectedShowtime) {
    return null;
  }

  if (loading) {
    return (
      <div className="seat-selection">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '20px' }}>
              <Text>Đang tải thông tin ghế...</Text>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seat-selection">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Text type="danger">{error}</Text>
            <div style={{ marginTop: '20px' }}>
              <Button onClick={() => navigate('/')}>Quay về trang chủ</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="seat-selection">
      {/* Enhanced Progress Bar */}
      <div className="progress-container">
        <div className="progress-header">
          <Title level={4} className="progress-title">
            Đặt vé xem phim - Bước 1/4
          </Title>
          <Text type="secondary">Chọn ghế ngồi</Text>
        </div>
        <div className="progress-steps">
          <div className="step active">
            <div className="step-icon">1</div>
            <span>Chọn ghế</span>
          </div>
          <div className="step">
            <div className="step-icon">2</div>
            <span>Bắp nước</span>
          </div>
          <div className="step">
            <div className="step-icon">3</div>
            <span>Thanh toán</span>
          </div>
          <div className="step">
            <div className="step-icon">4</div>
            <span>Hoàn tất</span>
          </div>
        </div>
      </div>

      <div className="container">
        <Row gutter={24}>
          {/* Left Side - Seat Map */}
          <Col xs={24} lg={16}>
            <div className="seat-map-container">
              <Title level={3} className="section-title">Chọn ghế</Title>
              
              {/* Screen */}
              <div className="screen">
                <Text strong>MÀN HÌNH</Text>
              </div>

              {/* Seat Legend */}
              <div className="seat-legend">
                <div className="legend-item">
                  <div className="legend-seat available"></div>
                  <Text>Ghế có sẵn</Text>
                </div>
                <div className="legend-item">
                  <div className="legend-seat selected">
                    <CheckOutlined />
                  </div>
                  <Text>Ghế bạn chọn</Text>
                </div>
                <div className="legend-item">
                  <div className="legend-seat unavailable">
                    <CloseOutlined />
                  </div>
                  <Text>Không thể chọn</Text>
                </div>
                <div className="legend-item">
                  <div className="legend-seat sold"></div>
                  <Text>Đã bán</Text>
                </div>
              </div>

              {/* Seat Map */}
              <div className="seat-map">
                {layout && Array.from({ length: layout.rows }, (_, rowIndex) => {
                  const rowLetter = String.fromCharCode(65 + rowIndex); // A, B, C, D, E, F, G
                  const rowSeats = seats.filter(seat => seat.rowIndex === rowIndex);
                  
                  return (
                    <div key={rowLetter} className="seat-row">
                      <div className="row-label">{rowLetter}</div>
                      <div className="seats-in-row">
                        {Array.from({ length: layout.cols }, (_, colIndex) => {
                          const seat = rowSeats.find(s => s.colIndex === colIndex);
                          
                          if (!seat) {
                            return <div key={colIndex} className="seat-spacer"></div>;
                          }
                          
                          return (
                            <Button
                              key={seat.seatId}
                              className={`seat ${getSeatType(seat)} ${getSeatStatus(seat)}`}
                              onClick={() => handleSeatClick(seat.seatId)}
                              disabled={seat.status !== 'AVAILABLE'}
                            >
                              {seat.seatNumber}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Seat Type Legend */}
              <div className="seat-type-legend">
                <div className="legend-item">
                  <div className="legend-seat standard"></div>
                  <Text>Standard</Text>
                </div>
                <div className="legend-item">
                  <div className="legend-seat vip"></div>
                  <Text>VIP</Text>
                </div>
              </div>
            </div>
          </Col>

          {/* Right Side - Booking Summary */}
          <Col xs={24} lg={8}>
            <div className="booking-summary">
              {/* Ticket Information */}
              <Card title="Thông tin vé" className="summary-card">
                <div className="movie-info">
                  {selectedShowtime.movie?.posterUrl && (
                    <img src={selectedShowtime.movie.posterUrl} alt={selectedShowtime.movie.title} className="movie-poster" />
                  )}
                  <div className="movie-details">
                    <Title level={4}>{selectedShowtime.movie?.title}</Title>
                    <Text type="secondary">Rạp: {selectedShowtime.theater?.theaterName}</Text>
                    <Text type="secondary">Suất: {selectedShowtime.time} - {new Date(selectedShowtime.date).toLocaleDateString('vi-VN')}</Text>
                    <Text type="secondary">Ghế: {selectedSeats.map(seat => seat.code || `${String.fromCharCode(65 + (seat.rowIndex ?? 0))}${seat.seatNumber}`).join(', ')}</Text>
                  </div>
                </div>
              </Card>

              {/* Total Order */}
              <Card title="TỔNG ĐƠN HÀNG" className="summary-card">
                <div className="total-price">
                  <Text strong className="price-amount">
                    {getTotalPrice().toLocaleString('vi-VN')} VND
                  </Text>
                </div>
                {/* {selectedSeats.length > 0 && (
                  <div className="price-breakdown">
                    {selectedSeats.map(seatId => {
                      const seat = seats.find(s => s.seatId === seatId);
                      return seat ? (
                        <div key={seatId} className="price-item">
                          <Text>Ghế {seat.code} ({seat.seatType})</Text>
                          <Text>{seat.price.toLocaleString('vi-VN')} VND</Text>
                        </div>
                      ) : null;
                    })}
                  </div>
                )} */}
              </Card>

              {/* Action Buttons */}
              <div className="action-buttons">
                <Button 
                  icon={<LeftOutlined />} 
                  size="large"
                  onClick={() => navigate(-1)}
                  className="back-btn"
                >
                  Quay lại
                </Button>
                <Button 
                  type="primary" 
                  size="large"
                  onClick={handleContinue}
                  disabled={selectedSeats.length === 0}
                  className="continue-btn"
                >
                  Tiếp tục
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SeatSelection;
