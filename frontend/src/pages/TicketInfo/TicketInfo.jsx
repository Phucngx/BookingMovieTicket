import React, { useEffect, useState } from 'react';
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
  Result,
  Tooltip,
  Badge,
  Avatar
} from 'antd';
import { 
  CheckCircleOutlined,
  HomeOutlined,
  ShareAltOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  StarOutlined,
  HeartOutlined,
  DownloadOutlined,
  PrinterOutlined,
  QrcodeOutlined
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

  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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

  const getPaymentMethodIcon = (method) => {
    const icons = {
      credit_card: <CreditCardOutlined />,
      bank_transfer: <CreditCardOutlined />,
      e_wallet: <CreditCardOutlined />
    };
    return icons[method] || <CreditCardOutlined />;
  };

  const handleShareTicket = () => {
    message.success('Đã chia sẻ vé thành công!');
  };

  const handlePrintTicket = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
      message.success('Đã chuẩn bị in vé!');
    }, 1000);
  };

  const handleDownloadTicket = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      message.success('Đã tải xuống vé thành công!');
    }, 1500);
  };

  if (!movie || !showtime || !selectedSeats) {
    return null;
  }

  return (
    <div className="ticket-info">
      {/* Enhanced Progress Bar */}
      <div className="progress-container">
        <div className="progress-header">
          <Title level={4} className="progress-title">
            Đặt vé xem phim - Hoàn tất
          </Title>
          <Text type="secondary">Vé đã được đặt thành công</Text>
        </div>
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
            <span>Hoàn tất</span>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Enhanced Success Result */}
        <Result
          status="success"
          icon={<CheckCircleOutlined className="success-icon" />}
          title="Đặt vé thành công!"
          subTitle="Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Vé đã được gửi đến email của bạn."
          className="success-result"
          extra={[
            <Button 
              key="print" 
              icon={<PrinterOutlined />} 
              onClick={handlePrintTicket}
              loading={isPrinting}
              size="large"
              className="action-btn print-btn"
            >
              In vé
            </Button>,
            <Button 
              key="download" 
              icon={<DownloadOutlined />} 
              onClick={handleDownloadTicket}
              loading={isDownloading}
              size="large"
              className="action-btn download-btn"
            >
              Tải xuống
            </Button>
          ]}
        />

        <Row gutter={[32, 32]}>
          {/* Left Side - Main Content */}
          <Col xs={24} lg={16}>
            {/* Enhanced Movie Ticket Card */}
            <Card 
              title={
                <Space>
                  <FileTextOutlined className="card-title-icon" />
                  <span>Thông tin vé xem phim</span>
                  <Badge 
                    status="success" 
                    text="Đã xác nhận" 
                    className="ticket-status"
                  />
                </Space>
              } 
              className="ticket-card main-card"
              bordered={false}
              extra={
                <div className="ticket-actions">
                  <Tooltip title="Xem QR Code">
                    <Button 
                      type="text" 
                      icon={<QrcodeOutlined />} 
                      size="small"
                      className="qr-btn"
                    />
                  </Tooltip>
                  <Tooltip title="Yêu thích">
                    <Button 
                      type="text" 
                      icon={<HeartOutlined />} 
                      size="small"
                      className="favorite-btn"
                    />
                  </Tooltip>
                </div>
              }
            >
              <div className="ticket-header">
                <div className="movie-poster-container">
                  <img src={movie.poster} alt={movie.title} className="movie-poster" />
                  <div className="movie-badge">
                    <Tag color="blue" className="movie-type">{showtime.type}</Tag>
                    <Tag color="green" className="cinema-name">{showtime.cinema}</Tag>
                  </div>
                  <div className="movie-rating">
                    <StarOutlined className="star-icon" />
                    <span className="rating-text">9.2</span>
                  </div>
                </div>
                <div className="movie-info">
                  <Title level={3} className="movie-title">{movie.title}</Title>
                  <div className="movie-meta">
                    <Text type="secondary" className="movie-duration">
                      <ClockCircleOutlined /> {movie.duration} phút
                    </Text>
                    <Text type="secondary" className="movie-language">
                      {movie.language === 'vietnamese' ? 'Tiếng Việt' : movie.language}
                    </Text>
                  </div>
                  <div className="movie-genre">
                    <Tag color="purple">Action</Tag>
                    <Tag color="blue">Adventure</Tag>
                    <Tag color="green">Fantasy</Tag>
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
                      <Text className="detail-value">
                        {showtime.time} {showtime.date}/{showtime.day}
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="detail-item">
                    <UserOutlined className="detail-icon" />
                    <div className="detail-content">
                      <Text strong>Phòng chiếu</Text>
                      <Text className="detail-value">P6 - 2D</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="detail-item">
                    <CalendarOutlined className="detail-icon" />
                    <div className="detail-content">
                      <Text strong>Ghế đã chọn</Text>
                      <Text className="detail-value seats-value">
                        {selectedSeats.join(', ')}
                      </Text>
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

              {/* QR Code Section */}
              <div className="qr-section">
                <Divider className="qr-divider" />
                <div className="qr-content">
                  <div className="qr-placeholder">
                    <QrcodeOutlined className="qr-icon" />
                    <Text className="qr-text">QR Code vé</Text>
                  </div>
                  <div className="qr-info">
                    <Text strong>Mã vé:</Text>
                    <Text className="ticket-code">
                      {transactionId || 'TKT' + Date.now().toString().slice(-8)}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>

            {/* Enhanced Food & Beverage Order */}
            {cart && cart.length > 0 && (
              <Card 
                title={
                  <Space>
                    <span className="food-icon">🍿</span>
                    <span>Đồ ăn & thức uống đã đặt</span>
                    <Badge count={cart.length} size="small" className="food-badge" />
                  </Space>
                } 
                className="food-card main-card"
                bordered={false}
              >
                <div className="food-items">
                  {cart.map((item) => (
                    <div key={item.id} className="food-item">
                      <div className="food-item-info">
                        <Avatar 
                          src={item.image} 
                          size={40} 
                          className="food-avatar"
                        />
                        <div className="food-details">
                          <Text strong className="food-name">{item.name}</Text>
                          <Text type="secondary" className="food-description">
                            {item.description || 'Món ăn ngon'}
                          </Text>
                        </div>
                      </div>
                      <div className="food-quantity-price">
                        <Text type="secondary" className="food-quantity">x{item.quantity}</Text>
                        <Text strong className="food-price">
                          {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                        </Text>
                      </div>
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

            {/* Enhanced Customer Information */}
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
              {/* Enhanced Transaction Summary */}
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
                    <div className="payment-method">
                      {getPaymentMethodIcon(paymentMethod)}
                      <Text>{getPaymentMethodText(paymentMethod)}</Text>
                    </div>
                  </div>
                  <div className="transaction-row">
                    <Text>Thời gian đặt:</Text>
                    <Text>{new Date().toLocaleString('vi-VN')}</Text>
                  </div>
                  <div className="transaction-row">
                    <Text>Trạng thái:</Text>
                    <Tag color="success" className="status-tag">Đã thanh toán</Tag>
                  </div>
                </div>
              </Card>

              {/* Enhanced Total Summary */}
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

              {/* Enhanced Important Notice */}
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
                  <div className="notice-item">
                    <Text type="secondary">• Có thể sử dụng QR Code để vào rạp</Text>
                  </div>
                </div>
              </Card>

              {/* Enhanced Action Buttons */}
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
