import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Row, 
  Col, 
  Button, 
  Card, 
  Space,
  Divider
} from 'antd';
import { 
  LeftOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import './SeatSelection.css';

const { Title, Text } = Typography;

const SeatSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie, showtime } = location.state || {};
  
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  // Tạo sơ đồ ghế (7 hàng A-G, mỗi hàng 10 ghế)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const seatsPerRow = 10;
  
  // Tạo dữ liệu ghế mẫu
  const generateSeats = () => {
    const seats = [];
    rows.forEach((row, rowIndex) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatId = `${row}${i}`;
        const isAvailable = Math.random() > 0.3; // 70% ghế có sẵn
        const isVIP = rowIndex >= 4; // Hàng E, F, G là VIP
        
        seats.push({
          id: seatId,
          row: row,
          number: i,
          isAvailable: isAvailable,
          isVIP: isVIP,
          isSelected: false
        });
      }
    });
    return seats;
  };

  const [seats, setSeats] = useState(generateSeats());

  useEffect(() => {
    if (!movie || !showtime) {
      navigate('/');
    }
  }, [movie, showtime, navigate]);

  const handleSeatClick = (seatId) => {
    if (!seats.find(s => s.id === seatId)?.isAvailable) return;
    
    setSeats(prevSeats => 
      prevSeats.map(seat => 
        seat.id === seatId 
          ? { ...seat, isSelected: !seat.isSelected }
          : seat
      )
    );
    
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    
    // Chuyển sang bước tiếp theo: Bắp nước
    navigate('/bap-nuoc', {
      state: {
        movie,
        showtime,
        selectedSeats,
        totalPrice: selectedSeats.length * parseInt(showtime.price)
      }
    });
  };

  const getTotalPrice = () => {
    return selectedSeats.length * parseInt(showtime.price);
  };

  if (!movie || !showtime) {
    return null;
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
                {rows.map((row) => (
                  <div key={row} className="seat-row">
                    <div className="row-label">{row}</div>
                    <div className="seats-in-row">
                      {seats
                        .filter(seat => seat.row === row)
                        .map((seat) => (
                          <Button
                            key={seat.id}
                            className={`seat ${seat.isVIP ? 'vip' : 'standard'} ${
                              seat.isSelected ? 'selected' : ''
                            } ${!seat.isAvailable ? 'unavailable' : ''}`}
                            onClick={() => handleSeatClick(seat.id)}
                            disabled={!seat.isAvailable}
                          >
                            {seat.number}
                          </Button>
                        ))}
                    </div>
                  </div>
                ))}
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
                  <img src={movie.poster} alt={movie.title} className="movie-poster" />
                  <div className="movie-details">
                    <Title level={4}>{movie.title}</Title>
                    <Text type="secondary">{showtime.cinema}</Text>
                    <Text type="secondary">Suất {showtime.time} {showtime.date}/{showtime.day}</Text>
                    <Text type="secondary">Phòng chiếu P6 - Ghế {selectedSeats.join(', ')}</Text>
                  </div>
                </div>
              </Card>

              {/* Total Order */}
              <Card title="TỔNG ĐƠN HÀNG" className="summary-card">
                <div className="total-price">
                  <Text strong className="price-amount">
                    {getTotalPrice().toLocaleString('vi-VN')} ₫
                  </Text>
                </div>
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
