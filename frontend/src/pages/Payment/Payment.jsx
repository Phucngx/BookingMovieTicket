import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Typography, 
  Row, 
  Col, 
  Button, 
  Card, 
  Progress,
  Form,
  Input,
  Radio,
  Space,
  Divider,
  message,
  Result,
  Alert
} from 'antd';
import { 
  LeftOutlined,
  CreditCardOutlined,
  BankOutlined,
  WalletOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  HomeOutlined
} from '@ant-design/icons';
import './Payment.css';
import { bookingService } from '../../services/bookingService';
import { setLastBooking } from '../../store/slices/bookingsSlice';
import { clearSelectedSeats } from '../../store/slices/seatSlice';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const reduxShowtime = useSelector((state) => state.showtimes.selectedShowtime);
  const reduxSeats = useSelector((state) => state.seats.selectedSeats);
  const foodsSelections = useSelector((state) => state.foods.selections);
  const foodsArray = Object.values(foodsSelections || {});

  const {
    movie,
    showtime,
    selectedSeats,
    totalPrice,
    cart,
    foodTotal,
    grandTotal,
    paymentMethod: statePaymentMethod
  } = location.state || {
    movie: reduxShowtime?.movie,
    showtime: reduxShowtime,
    selectedSeats: reduxSeats || [],
    totalPrice: (reduxSeats || []).length > 0 ? 0 : 0,
    cart: foodsArray,
    foodTotal: foodsArray.reduce((s, i) => s + i.price * i.quantity, 0),
    grandTotal: (reduxSeats || []).length > 0 ? 0 + foodsArray.reduce((s, i) => s + i.price * i.quantity, 0) : foodsArray.reduce((s, i) => s + i.price * i.quantity, 0)
  };
  
  const [paymentMethod, setPaymentMethod] = useState(statePaymentMethod || 'zalopay');
  const [paymentError, setPaymentError] = useState(null);

  const seatLabels = (selectedSeats || []).map(seat => {
    if (typeof seat === 'object' && seat !== null) {
      if (seat.code) return seat.code
      const rowLetter = typeof seat.rowIndex === 'number' ? String.fromCharCode(65 + seat.rowIndex) : ''
      return `${rowLetter}${seat.seatNumber}`
    }
    return String(seat)
  });
  const [loading, setLoading] = useState(false);

  // Remove redirect-to-home; show lightweight placeholder if missing
  // useEffect(() => {
  //   if (!movie || !showtime) {
  //     navigate('/');
  //   }
  // }, [movie, showtime, navigate]);

  const { userInfo, token } = useSelector((state) => state.user);

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      const accountId = userInfo?.data?.accountId || userInfo?.accountId || userInfo?.id;
      const showtimeId = showtime?.id || showtime?.showtimeId;
      const seatIds = (selectedSeats || []).map(s => (typeof s === 'object' ? s.seatId : s));
      const foodIds = (cart || []).flatMap(item => Array(item.quantity).fill(item.id));

      if (!accountId || !showtimeId || seatIds.length === 0) {
        throw new Error('Thiếu thông tin đặt vé');
      }

      const response = await bookingService.createBooking({
        accountId,
        showtimeId,
        seatIds,
        foodIds,
        token
      });

      if (response?.code === 1000 && response?.data?.qrUrl) {
        // Lưu thông tin booking vào Redux
        dispatch(setLastBooking(response.data))
        window.location.href = response.data.qrUrl;
        return;
      }

      throw new Error('Tạo đơn đặt vé thất bại');
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError({
        title: 'Thanh toán thất bại',
        message: error.message || 'Có lỗi xảy ra trong quá trình thanh toán',
        details: 'Vui lòng kiểm tra lại thông tin và thử lại'
      });
    } finally {
      setLoading(false);
    }
  };

  // Payment Error Screen
  if (paymentError) {
    return (
      <div className="payment">
        <div className="container">
          <div className="payment-error-container">
            <Result
              status="error"
              icon={<CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '64px' }} />}
              title={
                <div className="error-title">
                  <Title level={2} style={{ color: '#ff4d4f', margin: 0 }}>
                    {paymentError.title}
                  </Title>
                </div>
              }
              subTitle={
                <div className="error-content">
                  <Alert
                    message={paymentError.message}
                    description={paymentError.details}
                    type="error"
                    showIcon
                    style={{ marginBottom: 24 }}
                  />
                  
                  <Card className="error-actions-card">
                    <div className="error-actions">
                      <Title level={4} style={{ marginBottom: 16 }}>
                        Bạn có thể thử các cách sau:
                      </Title>
                      
                      <div className="error-suggestions">
                        <div className="suggestion-item">
                          <div className="suggestion-icon">🔄</div>
                          <div className="suggestion-text">
                            <Text strong>Thử lại thanh toán</Text>
                            <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                              Kiểm tra kết nối mạng và thử lại
                            </Text>
                          </div>
                        </div>
                        
                        <div className="suggestion-item">
                          <div className="suggestion-icon">💳</div>
                          <div className="suggestion-text">
                            <Text strong>Kiểm tra phương thức thanh toán</Text>
                            <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                              Đảm bảo thông tin thẻ/tài khoản chính xác
                            </Text>
                          </div>
                        </div>
                        
                        <div className="suggestion-item">
                          <div className="suggestion-icon">📞</div>
                          <div className="suggestion-text">
                            <Text strong>Liên hệ hỗ trợ</Text>
                            <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                              Hotline: 1900 6017 (24/7)
                            </Text>
                          </div>
                        </div>
                      </div>
                      
                      <Divider />
                      
                      <Space size="large" wrap>
                        <Button 
                          type="primary" 
                          size="large"
                          icon={<ReloadOutlined />}
                          onClick={() => {
                            setPaymentError(null);
                            setLoading(false);
                          }}
                        >
                          Thử lại thanh toán
                        </Button>
                        
                        <Button 
                          size="large"
                          icon={<LeftOutlined />}
                          onClick={() => {
                            setPaymentError(null);
                            navigate('/seat-selection');
                          }}
                        >
                          Quay lại chọn ghế
                        </Button>
                        
                        <Button 
                          size="large"
                          icon={<HomeOutlined />}
                          onClick={() => {
                            setPaymentError(null);
                            navigate('/');
                          }}
                        >
                          Về trang chủ
                        </Button>
                      </Space>
                    </div>
                  </Card>
                </div>
              }
            />
          </div>
        </div>
      </div>
    );
  }

  if (!movie || !showtime) {
    return (
      <div className="payment">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Title level={4}>Đang tải thông tin đặt vé...</Title>
            <Text>Vui lòng quay lại bước trước nếu trang không tự cập nhật.</Text>
            <div style={{ marginTop: 16 }}>
              <Button onClick={() => navigate(-1)}>Quay lại</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment">
      {/* Enhanced Progress Bar */}
      <div className="progress-container">
        <div className="progress-header">
          <Title level={4} className="progress-title">
            Đặt vé xem phim - Bước 3/4
          </Title>
          <Text type="secondary">Thanh toán</Text>
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
          <div className="step active">
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
        <Row gutter={[32, 32]}>
          {/* Left Side - Payment Form */}
          <Col xs={24} lg={16}>
            <div className="payment-form-container">
              <Title level={3} className="section-title">
                💳 Thông tin thanh toán
              </Title>
              
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="payment-form"
              >
                {/* Personal Information */}
                <Card title="👤 Thông tin cá nhân" className="form-card">
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="fullName"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                      >
                        <Input 
                          prefix={<UserOutlined />} 
                          placeholder="Nhập họ và tên đầy đủ"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                          { required: true, message: 'Vui lòng nhập số điện thoại!' },
                          { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                        ]}
                      >
                        <Input 
                          prefix={<PhoneOutlined />} 
                          placeholder="Nhập số điện thoại"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: 'Vui lòng nhập email!' },
                          { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                      >
                        <Input 
                          prefix={<MailOutlined />} 
                          placeholder="Nhập địa chỉ email"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="address"
                        label="Địa chỉ"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                      >
                        <TextArea 
                          placeholder="Nhập địa chỉ chi tiết"
                          rows={3}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                {/* Payment Method */}
                <Card title="💳 Phương thức thanh toán" className="form-card">
                  <Form.Item
                    name="paymentMethod"
                    initialValue={paymentMethod}
                  >
                    <Radio.Group 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="payment-methods"
                    >
                      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Radio value="zalopay" className="payment-method-option">
                          <div className="payment-method-content">
                            <WalletOutlined className="payment-icon" />
                            <div className="payment-method-info">
                              <Text strong>ZaloPay</Text>
                              <Text type="secondary">Thanh toán qua ví ZaloPay</Text>
                            </div>
                          </div>
                        </Radio>
                        
                        <Radio value="bank_transfer" className="payment-method-option" disabled>
                          <div className="payment-method-content">
                            <BankOutlined className="payment-icon" />
                            <div className="payment-method-info">
                              <Text strong>Chuyển khoản ngân hàng</Text>
                              <Text type="secondary">Chuyển khoản qua internet banking</Text>
                            </div>
                          </div>
                        </Radio>
                        
                        <Radio value="e_wallet" className="payment-method-option" disabled>
                          <div className="payment-method-content">
                            <WalletOutlined className="payment-icon" />
                            <div className="payment-method-info">
                              <Text strong>Ví điện tử</Text>
                              <Text type="secondary">Momo, ZaloPay, VNPay</Text>
                            </div>
                          </div>
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </Card>

                {/* Submit Button */}
                <div className="form-actions">
                  <Button 
                    type="primary" 
                    size="large"
                    htmlType="submit"
                    loading={loading}
                    className="submit-btn"
                    block
                  >
                    Xác nhận thanh toán
                  </Button>
                </div>
              </Form>
            </div>
          </Col>

          {/* Right Side - Order Summary */}
          <Col xs={24} lg={8}>
            <div className="order-summary">
              <Title level={4} className="summary-title">
                📋 Tóm tắt đơn hàng
              </Title>
              
              {/* Movie Info */}
              <Card className="summary-card movie-summary">
                <div className="movie-info-payment">
                  <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
                  <div className="movie-details">
                    <Text strong className="movie-title">{movie.title}</Text>
                    <Text type="secondary">Rạp: {showtime.theater.theaterName}</Text>
                    <Text type="secondary"> Suất chiếu: {showtime.time} - {showtime.date} </Text>
                    <Text type="secondary">Ghế: {seatLabels.join(', ')}</Text>
                  </div>
                </div>
              </Card>

              {/* Food & Beverage Summary */}
              {cart && cart.length > 0 && (
                <Card title="🍿 Đồ ăn & thức uống" className="summary-card">
                  <div className="food-summary">
                    {cart.map((item) => (
                      <div key={item.id} className="food-summary-item">
                        <Text>{item.name} x{item.quantity}</Text>
                        <Text strong>
                          {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                        </Text>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Total Summary */}
              <Card title="💰 Tổng đơn hàng" className="summary-card total-summary">
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
                  <Divider style={{ margin: '12px 0' }} />
                  <div className="total-row grand-total">
                    <Text strong>Tổng cộng:</Text>
                    <Text strong className="final-total">
                      {grandTotal.toLocaleString('vi-VN')} ₫
                    </Text>
                  </div>
                </div>
              </Card>

              {/* Back Button */}
              <Button 
                icon={<LeftOutlined />} 
                size="large"
                onClick={() => navigate(-1)}
                className="back-btn"
                block
              >
                Quay lại
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Payment;
