import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import { fetchTicketByBookingId, clearBookingsState } from '../../store/slices/bookingsSlice';
import { tokenUtils } from '../../services/authService';

const { Title, Text } = Typography;

const TicketInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lastBooking, ticket, loading, error } = useSelector((state) => state.bookings);
  const { token } = useSelector((state) => state.user);
  const params = new URLSearchParams(location.search);
  const bookingIdFromUrl = params.get('bookingId');
  const bookingId = bookingIdFromUrl || lastBooking?.bookingId;

  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    const bearer = token || tokenUtils.getToken();
    if (!bearer) return;
    dispatch(fetchTicketByBookingId({ bookingId, token: bearer }))
  }, [bookingId, dispatch, token]);

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

  // Clear booking state when leaving TicketInfo
  useEffect(() => {
    return () => {
      dispatch(clearBookingsState())
    }
  }, [dispatch])

  if (!ticket) {
    return (
      <div className="ticket-info">
        <div className="container">
          <Result status={loading ? 'info' : 'warning'} title={loading ? 'Đang tải thông tin vé...' : (error || 'Không tìm thấy thông tin vé')} />
        </div>
      </div>
    );
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
          subTitle={`Mã đặt vé: BK${ticket.bookingId}. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.`}
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
                <div className="movie-info">
                  <div className="movie-title-section">
                    <Title level={2} className="movie-title">{ticket.movieName}</Title>
                    {/* <div className="movie-badges">
                      <Tag color="blue" className="movie-badge">
                        <CalendarOutlined /> {new Date(ticket.startTime).toLocaleDateString('vi-VN')}
                      </Tag>
                      <Tag color="green" className="movie-badge">
                        <ClockCircleOutlined /> {new Date(ticket.startTime).toLocaleTimeString('vi-VN', { hour12: false })} - {new Date(ticket.endTime).toLocaleTimeString('vi-VN', { hour12: false })}
                      </Tag>
                    </div> */}
                  </div>
                  <div className="theater-section">
                    <div className="theater-info">
                      <div className="theater-details">
                        <div className="theater-item">
                          <HomeOutlined className="theater-icon" />
                          <div className="theater-text">
                            <Text strong className="theater-name">{ticket.theaterName}</Text>
                            <Text type="secondary" className="room-name">Phòng {ticket.roomName}</Text>
                          </div>
                        </div>
                      </div>
                    </div>
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
                        {new Date(ticket.startTime).toLocaleString('vi-VN')}
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="detail-item">
                    <UserOutlined className="detail-icon" />
                    <div className="detail-content">
                      <Text strong>Phòng chiếu</Text>
                      <Text className="detail-value">{ticket.roomName}</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="detail-item">
                    <CalendarOutlined className="detail-icon" />
                    <div className="detail-content">
                      <Text strong>Ghế đã chọn</Text>
                      <Text className="detail-value seats-value">
                        {(ticket.seatNames || []).join(', ')}
                      </Text>
                    </div>
                  </div>
                </Col>
                {typeof ticket.amount !== 'undefined' && (
                  <Col xs={24} sm={12}>
                    <div className="detail-item">
                      <CreditCardOutlined className="detail-icon" />
                      <div className="detail-content">
                        <Text strong>Giá vé</Text>
                        <Text className="detail-value price-value">
                          {(ticket.amount || 0).toLocaleString('vi-VN')} ₫
                        </Text>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>

              {/* QR Code Section */}
              <div className="qr-section">
                <div className="qr-header">
                  <Title level={4} className="qr-title">
                    <QrcodeOutlined /> Mã QR vé
                  </Title>
                  <Text type="secondary">Quét mã QR để vào rạp</Text>
                </div>
                <div className="qr-content">
                  <div className="qr-container">
                    {ticket.qrCode ? (
                      <div className="qr-image-wrapper">
                        <img 
                          src={ticket.qrCode} 
                          alt="QR Code" 
                          className="qr-image"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                        {/* <div className="qr-fallback">
                          <QrcodeOutlined className="qr-icon" />
                          <Text className="qr-text">QR Code vé</Text>
                        </div> */}
                      </div>
                    ) : (
                      <div className="qr-fallback">
                        <QrcodeOutlined className="qr-icon" />
                        <Text className="qr-text">QR Code vé</Text>
                      </div>
                    )}
                  </div>
                  {/* <div className="qr-info">
                    <div className="ticket-id-section">
                      <Text className="ticket-label">Mã vé:</Text>
                      <Text className="ticket-code">
                        {'BK' + String(ticket.bookingId)}
                      </Text>
                    </div>
                    <div className="qr-instructions">
                      <Text type="secondary" className="qr-instruction">
                        • Hiển thị mã QR tại quầy soát vé
                      </Text>
                      <Text type="secondary" className="qr-instruction">
                        • Mã QR có hiệu lực đến giờ chiếu
                      </Text>
                    </div>
                  </div> */}
                </div>
              </div>
            </Card>

            {/* Food & Beverage Order from ticket */}
            {Array.isArray(ticket.foodNames) && ticket.foodNames.length > 0 && (
              <Card 
                title={
                  <Space>
                    <span className="food-icon">🍿</span>
                    <span>Đồ ăn & thức uống đã đặt</span>
                    <Badge count={ticket.foodNames.length} size="small" className="food-badge" />
                  </Space>
                } 
                className="food-card main-card"
                bordered={false}
              >
                <div className="food-items">
                  {ticket.foodNames.map((name, idx) => (
                    <div key={idx} className="food-item">
                      <div className="food-item-info">
                        <Avatar size={40} className="food-avatar">🍽️</Avatar>
                        <div className="food-details">
                          <Text strong className="food-name">{name}</Text>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                    <Text>Mã đặt vé:</Text>
                    <Text strong className="transaction-id">{'BK' + String(ticket.bookingId)}</Text>
                  </div>
                  <div className="transaction-row">
                    <Text>Thời gian đặt:</Text>
                    <Text>{new Date(ticket.createdAt).toLocaleString('vi-VN')}</Text>
                  </div>
                  {typeof ticket.amount !== 'undefined' && (
                    <div className="transaction-row">
                      <Text>Tổng tiền:</Text>
                      <Text strong>{(ticket.amount || 0).toLocaleString('vi-VN')} ₫</Text>
                    </div>
                  )}
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
                    <Text type="secondary">• Vé đã mua không thể hoàn trả</Text>
                  </div>
                  <div className="notice-item">
                    <Text type="secondary">• Vé có thể dùng QR Code để vào rạp</Text>
                  </div>
                  <div className="notice-item">
                    <Text type="secondary">• Vui lòng đến rạp trước giờ chiếu 15 phút</Text>
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
