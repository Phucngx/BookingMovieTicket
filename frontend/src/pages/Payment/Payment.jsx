import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  message
} from 'antd';
import { 
  LeftOutlined,
  CreditCardOutlined,
  BankOutlined,
  WalletOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import './Payment.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { 
    movie, 
    showtime, 
    selectedSeats, 
    totalPrice, 
    cart, 
    foodTotal, 
    grandTotal 
  } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!movie || !showtime || !selectedSeats) {
      navigate('/');
    }
  }, [movie, showtime, selectedSeats, navigate]);

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      // Giả lập xử lý thanh toán
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Tạo thông tin khách hàng
      const customerInfo = {
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        address: values.address
      };

      // Tạo mã giao dịch
      const transactionId = 'TXN' + Date.now().toString().slice(-8);

      message.success('Thanh toán thành công!');
      
      // Chuyển sang trang thông tin vé
      navigate('/thong-tin-ve', {
        state: {
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
        }
      });
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  if (!movie || !showtime || !selectedSeats) {
    return null;
  }

  return (
    <div className="payment">
      {/* Progress Bar - Tối giản */}
      <div className="progress-container">
        <Progress
          percent={75}
          showInfo={false}
          strokeColor="#1890ff"
          trailColor="#f0f0f0"
          size="small"
        />
        <div className="progress-steps">
          <div className="step completed">Chọn ghế</div>
          <div className="step completed">Bắp nước</div>
          <div className="step active">Thanh toán</div>
          <div className="step">Hoàn tất</div>
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
                        <Radio value="credit_card" className="payment-method-option">
                          <div className="payment-method-content">
                            <CreditCardOutlined className="payment-icon" />
                            <div className="payment-method-info">
                              <Text strong>Thẻ tín dụng/ghi nợ</Text>
                              <Text type="secondary">Visa, Mastercard, JCB</Text>
                            </div>
                          </div>
                        </Radio>
                        
                        <Radio value="bank_transfer" className="payment-method-option">
                          <div className="payment-method-content">
                            <BankOutlined className="payment-icon" />
                            <div className="payment-method-info">
                              <Text strong>Chuyển khoản ngân hàng</Text>
                              <Text type="secondary">Chuyển khoản qua internet banking</Text>
                            </div>
                          </div>
                        </Radio>
                        
                        <Radio value="e_wallet" className="payment-method-option">
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
                <div className="movie-info">
                  <img src={movie.poster} alt={movie.title} className="movie-poster" />
                  <div className="movie-details">
                    <Text strong className="movie-title">{movie.title}</Text>
                    <Text type="secondary">{showtime.cinema}</Text>
                    <Text type="secondary">
                      {showtime.time} {showtime.date}/{showtime.day}
                    </Text>
                    <Text type="secondary">Ghế: {selectedSeats.join(', ')}</Text>
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
