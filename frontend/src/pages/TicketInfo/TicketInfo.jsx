import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Row, 
  Col, 
  Button, 
  Card, 
  Progress,
  Space,
  Divider,
  Tag,
  message,
  Result
} from 'antd';
import { 
  CheckCircleOutlined,
  HomeOutlined,
  ShareAltOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CreditCardOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import './TicketInfo.css';

const { Title, Text } = Typography;

const TicketInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    movie, 
    showtime, 
    selectedSeats, 
    totalPrice, 
    cart, 
    foodTotal, 
    grandTotal, 
    customerInfo, 
    paymentMethod, 
    transactionId 
  } = location.state || {};

  useEffect(() => {
    if (!movie || !showtime || !selectedSeats) {
      navigate('/');
    }
  }, [movie, showtime, selectedSeats, navigate]);

  const getPaymentMethodText = (method) => {
    const methods = {
      credit_card: 'Thẻ tín dụng/ghi nợ',
      bank_transfer: 'Chuyển khoản ngân hàng',
      e_wallet: 'Ví điện tử'
    };
    return methods[method] || method;
  };

  const handleShareTicket = () => {
    message.success('Đang chia sẻ vé...');
    setTimeout(() => {
      message.success('Đã chia sẻ vé thành công!');
    }, 2000);
  };

  if (!movie || !showtime || !selectedSeats) {
    return null;
  }

  return (
    <div className="ticket-info">
      {/* Progress Bar */}
      <div className="progress-container">
        <Progress
          percent={100}
          showInfo={false}
          strokeColor="#52c41a"
          trailColor="#f0f0f0"
          strokeWidth={6}
        />
        <div className="progress-steps">
          <div className="step completed">
            <div className="step-icon">✓</div>
            <span>Chọn ghế</span>
          </div>
          <div className="step completed">
            <div className="step-icon">✓</div>
            <span>Bắp nước</span>
          </div>
          <div className="step completed">
            <div className="step-icon">✓</div>
            <span>Thanh toán</span>
          </div>
          <div className="step active">
            <div className="step-icon">✓</div>
            <span>Thông tin vé</span>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Success Result */}
        <Result
          status="success"
          icon={<CheckCircleOutlined className="success-icon-large" />}
          title="Đặt vé thành công!"
          subTitle="Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Vé đã được gửi đến email của bạn."
          className="success-result"
        />

        <Row gutter={[32, 32]}>
          {/* Left Side - Main Content */}
          <Col xs={24} lg={16}>
            {/* Movie Ticket Card */}
            <Card 
              title={
                <Space>
                  <FileTextOutlined className="card-title-icon" />
                  <span>Thông tin vé xem phim</span>
                </Space>
              } 
              className="ticket-card main-card"
              bordered={false}
            >
              <div className="ticket-header">
                <div className="movie-poster-container">
                  <img src={movie.poster} alt={movie.title} className="movie-poster" />
                  <div className="movie-badge">
                    <Tag color="blue" className="movie-type">{showtime.type}</Tag>
                    <Tag color="green" className="cinema-name">{showtime.cinema}</Tag>
                  </div>
                </div>
                <div className="movie-info">
                  <Title level={3} className="movie-title">{movie.title}</Title>
                  <div className="movie-meta">
                    <Text type="secondary">
                      <ClockCircleOutlined /> {movie.duration} • {movie.language === 'vietnamese' ? 'Tiếng Việt' : movie.language}
                    </Text>
                  </div>
                </div>
              </div>
              
              <Divider className="ticket-divider" />
              
              <Row gutter={[24, 16]} className="ticket-details-grid">
                <Col xs={24} sm={12}>
                  <div className="detail-item">
                    <ClockCircleOutlined className="detail-icon" />
                    <div className="detail-content">
                      <Text strong>Suất chiếu</Text>
                      <Text className="detail-value">{showtime.time} {showtime.date}/{showtime.day}</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="detail-item">
                    <UserOutlined className="detail-icon" />
                    <div className="detail-content">
                      <Text strong>Phòng chiếu</Text>
                      <Text className="detail-value">P6</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="detail-item">
                    <CalendarOutlined className="detail-icon" />
                    <div className="detail-content">
                      <Text strong>Ghế đã chọn</Text>
                      <Text className="detail-value seats-value">{selectedSeats.join(', ')}</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="detail-item">
                    <CreditCardOutlined className="detail-icon" />
                    <div className="detail-content">
                      <Text strong>Giá vé</Text>
                      <Text className="detail-value price-value">
                        {totalPrice.toLocaleString('vi-VN')} ₫
                      </Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Food & Beverage Order */}
            {cart && cart.length > 0 && (
              <Card 
                title={
                  <Space>
                    <span className="food-icon">🍿</span>
                    <span>Đồ ăn & thức uống đã đặt</span>
                  </Space>
                } 
                className="food-card main-card"
                bordered={false}
              >
                <div className="food-items">
                  {cart.map((item) => (
                    <div key={item.id} className="food-item">
                      <div className="food-item-info">
                        <Text strong className="food-name">{item.name}</Text>
                        <Text type="secondary" className="food-quantity">x{item.quantity}</Text>
                      </div>
                      <Text strong className="food-price">
                        {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                      </Text>
                    </div>
                  ))}
                </div>
                <Divider className="food-divider" />
                <div className="food-total">
                  <Text strong>Tổng cộng:</Text>
                  <Text strong className="food-total-amount">
                    {foodTotal.toLocaleString('vi-VN')} ₫
                  </Text>
                </div>
              </Card>
            )}

            {/* Customer Information */}
            {customerInfo && (
              <Card 
                title={
                  <Space>
                    <UserOutlined className="card-title-icon" />
                    <span>Thông tin khách hàng</span>
                  </Space>
                } 
                className="customer-card main-card"
                bordered={false}
              >
                <Row gutter={[24, 16]}>
                  <Col xs={24} sm={12}>
                    <div className="customer-detail">
                      <Text strong>Họ và tên:</Text>
                      <Text className="customer-value">{customerInfo.fullName}</Text>
                    </div>
                    <div className="customer-detail">
                      <Text strong>Số điện thoại:</Text>
                      <Text className="customer-value">{customerInfo.phone}</Text>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div className="customer-detail">
                      <Text strong>Email:</Text>
                      <Text className="customer-value">{customerInfo.email}</Text>
                    </div>
                    <div className="customer-detail">
                      <Text strong>Địa chỉ:</Text>
                      <Text className="customer-value">{customerInfo.address}</Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            )}
          </Col>

          {/* Right Side - Summary & Actions */}
          <Col xs={24} lg={8}>
            <div className="summary-sidebar">
              {/* Transaction Summary */}
              <Card 
                title={
                  <Space>
                    <CreditCardOutlined className="card-title-icon" />
                    <span>Tóm tắt giao dịch</span>
                  </Space>
                } 
                className="summary-card"
                bordered={false}
              >
                <div className="transaction-details">
                  <div className="transaction-row">
                    <Text>Mã giao dịch:</Text>
                    <Text strong className="transaction-id">
                      {transactionId || 'TKT' + Date.now().toString().slice(-6)}
                    </Text>
                  </div>
                  <div className="transaction-row">
                    <Text>Phương thức thanh toán:</Text>
                    <Text>{getPaymentMethodText(paymentMethod)}</Text>
                  </div>
                  <div className="transaction-row">
                    <Text>Thời gian đặt:</Text>
                    <Text>{new Date().toLocaleString('vi-VN')}</Text>
                  </div>
                </div>
              </Card>

              {/* Total Summary */}
              <Card 
                title={
                  <Space>
                    <span className="money-icon">💰</span>
                    <span>Tổng đơn hàng</span>
                  </Space>
                } 
                className="summary-card total-card"
                bordered={false}
              >
                <div className="total-breakdown">
                  <div className="total-row">
                    <Text>Vé xem phim:</Text>
                    <Text>{totalPrice.toLocaleString('vi-VN')} ₫</Text>
                  </div>
                  {cart && cart.length > 0 && (
                    <div className="total-row">
                      <Text>Đồ ăn & thức uống:</Text>
                      <Text>{foodTotal.toLocaleString('vi-VN')} ₫</Text>
                    </div>
                  )}
                  <Divider className="total-divider" />
                  <div className="total-row grand-total">
                    <Text strong>Tổng cộng:</Text>
                    <Text strong className="final-total">
                      {grandTotal.toLocaleString('vi-VN')} ₫
                    </Text>
                  </div>
                </div>
              </Card>

              {/* Important Notice */}
              <Card 
                title={
                  <Space>
                    <span className="info-icon">ℹ️</span>
                    <span>Lưu ý quan trọng</span>
                  </Space>
                } 
                className="notice-card"
                bordered={false}
              >
                <div className="notice-list">
                  <div className="notice-item">
                    <Text type="secondary">• Vé đã được gửi đến email của bạn</Text>
                  </div>
                  <div className="notice-item">
                    <Text type="secondary">• Vui lòng đến rạp trước giờ chiếu 15 phút</Text>
                  </div>
                  <div className="notice-item">
                    <Text type="secondary">• Mang theo CMND/CCCD để xác nhận</Text>
                  </div>
                  <div className="notice-item">
                    <Text type="secondary">• Không thể hoàn vé sau khi đặt</Text>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="action-buttons">
                <Button 
                  icon={<ShareAltOutlined />}
                  size="large"
                  onClick={handleShareTicket}
                  className="action-btn share-btn"
                  block
                >
                  Chia sẻ vé
                </Button>
                
                <Button 
                  type="primary"
                  icon={<HomeOutlined />}
                  size="large"
                  onClick={() => navigate('/')}
                  className="action-btn home-btn"
                  block
                >
                  Về trang chủ
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TicketInfo;
