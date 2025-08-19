import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Row, 
  Col, 
  Button, 
  Card, 
  Progress,
  InputNumber,
  Space,
  Divider,
  Badge
} from 'antd';
import { 
  LeftOutlined,
  PlusOutlined,
  MinusOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import './FoodBeverage.css';

const { Title, Text } = Typography;

const FoodBeverage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie, showtime, selectedSeats, totalPrice } = location.state || {};
  
  const [cart, setCart] = useState([]);
  const [currentStep, setCurrentStep] = useState(2);

  // Dữ liệu đồ ăn và thức uống
  const foodItems = [
    {
      id: 1,
      name: 'Bắp rang bơ',
      description: 'Bắp rang bơ thơm ngon, giòn tan',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop',
      category: 'food',
      available: true
    },
    {
      id: 2,
      name: 'Bắp rang phô mai',
      description: 'Bắp rang phô mai béo ngậy',
      price: 55000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop',
      category: 'food',
      available: true
    },
    {
      id: 3,
      name: 'Hot dog',
      description: 'Hot dog thịt bò với sốt đặc biệt',
      price: 65000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop',
      category: 'food',
      available: true
    },
    {
      id: 4,
      name: 'Khoai tây chiên',
      description: 'Khoai tây chiên giòn rụm',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop',
      category: 'food',
      available: true
    }
  ];

  const beverageItems = [
    {
      id: 5,
      name: 'Coca Cola',
      description: 'Nước ngọt Coca Cola 500ml',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop',
      category: 'beverage',
      available: true
    },
    {
      id: 6,
      name: 'Pepsi',
      description: 'Nước ngọt Pepsi 500ml',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop',
      category: 'beverage',
      available: true
    },
    {
      id: 7,
      name: 'Nước cam',
      description: 'Nước cam tươi 350ml',
      price: 30000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop',
      category: 'beverage',
      available: true
    },
    {
      id: 8,
      name: 'Cà phê sữa',
      description: 'Cà phê sữa đặc Việt Nam',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop',
      category: 'beverage',
      available: true
    }
  ];

  useEffect(() => {
    if (!movie || !showtime || !selectedSeats) {
      navigate('/');
    }
  }, [movie, showtime, selectedSeats, navigate]);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(prevCart => 
        prevCart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart(prevCart => [...prevCart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(prevCart => 
        prevCart.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getGrandTotal = () => {
    return totalPrice + getCartTotal();
  };

  const handleContinue = () => {
    // Chuyển sang bước tiếp theo: Thanh toán
    navigate('/thanh-toan', {
      state: {
        movie,
        showtime,
        selectedSeats,
        totalPrice,
        cart,
        foodTotal: getCartTotal(),
        grandTotal: getGrandTotal()
      }
    });
  };

  if (!movie || !showtime || !selectedSeats) {
    return null;
  }

  return (
    <div className="food-beverage">
      {/* Progress Bar */}
      <div className="progress-container">
        <Progress
          percent={50}
          showInfo={false}
          strokeColor="#ff4d4f"
          trailColor="#f0f0f0"
        />
        <div className="progress-steps">
          <div className="step completed">Chọn ghế</div>
          <div className="step active">Bắp nước</div>
          <div className="step">Thanh toán</div>
          <div className="step">Thông tin vé</div>
        </div>
      </div>

      <div className="container">
        <Row gutter={24}>
          {/* Left Side - Food & Beverage Items */}
          <Col xs={24} lg={16}>
            <div className="items-container">
              {/* Food Section */}
              <div className="section">
                <Title level={3} className="section-title">
                  🍿 Đồ ăn
                </Title>
                <Row gutter={[16, 16]}>
                  {foodItems.map((item) => (
                    <Col xs={24} sm={12} key={item.id}>
                      <Card 
                        className="item-card"
                        hoverable
                        cover={
                          <div className="item-image-container">
                            <img 
                              alt={item.name} 
                              src={item.image}
                              className="item-image"
                            />
                            <Button
                              type="primary"
                              shape="circle"
                              icon={<PlusOutlined />}
                              className="add-to-cart-btn"
                              onClick={() => addToCart(item)}
                            />
                          </div>
                        }
                      >
                        <div className="item-info">
                          <Title level={5} className="item-name">{item.name}</Title>
                          <Text type="secondary" className="item-description">
                            {item.description}
                          </Text>
                          <div className="item-price">
                            <Text strong className="price-text">
                              {item.price.toLocaleString('vi-VN')} ₫
                            </Text>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>

              {/* Beverage Section */}
              <div className="section">
                <Title level={3} className="section-title">
                  🥤 Thức uống
                </Title>
                <Row gutter={[16, 16]}>
                  {beverageItems.map((item) => (
                    <Col xs={24} sm={12} key={item.id}>
                      <Card 
                        className="item-card"
                        hoverable
                        cover={
                          <div className="item-image-container">
                            <img 
                              alt={item.name} 
                              src={item.image}
                              className="item-image"
                            />
                            <Button
                              type="primary"
                              shape="circle"
                              icon={<PlusOutlined />}
                              className="add-to-cart-btn"
                              onClick={() => addToCart(item)}
                            />
                          </div>
                        }
                      >
                        <div className="item-info">
                          <Title level={5} className="item-name">{item.name}</Title>
                          <Text type="secondary" className="item-description">
                            {item.description}
                          </Text>
                          <div className="item-price">
                            <Text strong className="price-text">
                              {item.price.toLocaleString('vi-VN')} ₫
                            </Text>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </Col>

          {/* Right Side - Cart & Summary */}
          <Col xs={24} lg={8}>
            <div className="cart-summary">
              {/* Cart */}
              <Card 
                title={
                  <Space>
                    <ShoppingCartOutlined />
                    <span>Giỏ hàng</span>
                    {cart.length > 0 && (
                      <Badge count={cart.length} size="small" />
                    )}
                  </Space>
                }
                className="cart-card"
              >
                {cart.length === 0 ? (
                  <div className="empty-cart">
                    <Text type="secondary">Giỏ hàng trống</Text>
                    <Text type="secondary">Hãy chọn đồ ăn và thức uống</Text>
                  </div>
                ) : (
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-info">
                          <img src={item.image} alt={item.name} className="cart-item-image" />
                          <div className="cart-item-details">
                            <Text strong>{item.name}</Text>
                            <Text type="secondary">
                              {item.price.toLocaleString('vi-VN')} ₫
                            </Text>
                          </div>
                        </div>
                        <div className="cart-item-actions">
                          <Space>
                            <Button
                              size="small"
                              icon={<MinusOutlined />}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            />
                            <InputNumber
                              size="small"
                              min={1}
                              value={item.quantity}
                              onChange={(value) => updateQuantity(item.id, value)}
                              style={{ width: 60 }}
                            />
                            <Button
                              size="small"
                              icon={<PlusOutlined />}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            />
                          </Space>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Order Summary */}
              <Card title="TỔNG ĐƠN HÀNG" className="summary-card">
                <div className="summary-row">
                  <Text>Vé xem phim:</Text>
                  <Text>{totalPrice.toLocaleString('vi-VN')} ₫</Text>
                </div>
                <div className="summary-row">
                  <Text>Đồ ăn & thức uống:</Text>
                  <Text>{getCartTotal().toLocaleString('vi-VN')} ₫</Text>
                </div>
                <Divider />
                <div className="summary-row total">
                  <Text strong>Tổng cộng:</Text>
                  <Text strong className="grand-total">
                    {getGrandTotal().toLocaleString('vi-VN')} ₫
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

export default FoodBeverage;
