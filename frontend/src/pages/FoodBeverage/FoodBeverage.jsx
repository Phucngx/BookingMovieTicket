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
  Badge,
  Empty,
  Tag,
  Tooltip,
  message
} from 'antd';
import { 
  LeftOutlined,
  PlusOutlined,
  MinusOutlined,
  ShoppingCartOutlined,
  CoffeeOutlined,
  FireOutlined,
  StarOutlined,
  HeartOutlined,
  HeartFilled
} from '@ant-design/icons';
import './FoodBeverage.css';

const { Title, Text } = Typography;

const FoodBeverage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie, showtime, selectedSeats, totalPrice } = location.state || {};
  
  const [cart, setCart] = useState([]);
  const [currentStep, setCurrentStep] = useState(2);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Dữ liệu đồ ăn và thức uống - cải thiện với thông tin chi tiết hơn
  const foodItems = [
    {
      id: 1,
      name: 'Bắp rang bơ',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop',
      category: 'food',
      description: 'Bắp rang bơ thơm ngon, giòn tan',
      rating: 4.8,
      popular: true,
      discount: 10
    },
    {
      id: 2,
      name: 'Bắp rang phô mai',
      price: 55000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop',
      category: 'food',
      description: 'Bắp rang phô mai béo ngậy',
      rating: 4.9,
      popular: true,
      discount: 0
    },
    {
      id: 3,
      name: 'Khoai tây chiên',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop',
      category: 'food',
      description: 'Khoai tây chiên giòn rụm',
      rating: 4.6,
      popular: false,
      discount: 15
    },
    {
      id: 4,
      name: 'Hot dog',
      price: 65000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop',
      category: 'food',
      description: 'Hot dog với xúc xích và rau củ',
      rating: 4.7,
      popular: true,
      discount: 0
    }
  ];

  const beverageItems = [
    {
      id: 5,
      name: 'Coca Cola',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop',
      category: 'beverage',
      description: 'Nước ngọt Coca Cola mát lạnh',
      rating: 4.5,
      popular: true,
      discount: 0
    },
    {
      id: 6,
      name: 'Nước cam',
      price: 30000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop',
      category: 'beverage',
      description: 'Nước cam tươi nguyên chất',
      rating: 4.8,
      popular: false,
      discount: 20
    },
    {
      id: 7,
      name: 'Cà phê sữa',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop',
      category: 'beverage',
      description: 'Cà phê sữa đậm đà',
      rating: 4.9,
      popular: true,
      discount: 0
    },
    {
      id: 8,
      name: 'Trà sữa trân châu',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop',
      category: 'beverage',
      description: 'Trà sữa trân châu ngọt ngào',
      rating: 4.7,
      popular: true,
      discount: 0
    }
  ];

  const allItems = [...foodItems, ...beverageItems];

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
    message.success(`Đã thêm ${item.name} vào giỏ hàng!`);
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    message.info('Đã xóa sản phẩm khỏi giỏ hàng');
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

  const toggleFavorite = (itemId) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getGrandTotal = () => {
    return totalPrice + getCartTotal();
  };

  const handleContinue = () => {
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

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!movie || !showtime || !selectedSeats) {
    return null;
  }

  return (
    <div className="food-beverage">
      {/* Enhanced Progress Bar */}
      <div className="progress-container">
        <div className="progress-header">
          <Title level={4} className="progress-title">
            Đặt vé xem phim - Bước 2/4
          </Title>
          <Text type="secondary">Chọn đồ ăn và thức uống</Text>
        </div>
        <Progress
          percent={50}
          showInfo={false}
          strokeColor="#1890ff"
          trailColor="#f0f0f0"
          size="small"
          className="progress-bar"
        />
        <div className="progress-steps">
          <div className="step completed">
            <div className="step-icon">✓</div>
            <span>Chọn ghế</span>
          </div>
          <div className="step active">
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
          {/* Left Side - Food & Beverage Items */}
          <Col xs={24} lg={16}>
            {/* Search and Filter Section */}
            <div className="search-filter-section">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Tìm kiếm đồ ăn, thức uống..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="filter-buttons">
                <Button
                  type={selectedCategory === 'all' ? 'primary' : 'default'}
                  size="small"
                  onClick={() => setSelectedCategory('all')}
                >
                  Tất cả
                </Button>
                <Button
                  type={selectedCategory === 'food' ? 'primary' : 'default'}
                  size="small"
                  onClick={() => setSelectedCategory('food')}
                >
                  Đồ ăn
                </Button>
                <Button
                  type={selectedCategory === 'beverage' ? 'primary' : 'default'}
                  size="small"
                  onClick={() => setSelectedCategory('beverage')}
                >
                  Thức uống
                </Button>
              </div>
            </div>

            <div className="items-container">
              {/* Food Section */}
              <div className="section">
                <Title level={4} className="section-title">
                  <FireOutlined className="section-icon" /> 
                  Đồ ăn
                  <span className="section-count">({foodItems.length})</span>
                </Title>
                <Row gutter={[16, 16]}>
                  {filteredItems.filter(item => item.category === 'food').map((item) => (
                    <Col xs={24} sm={12} md={8} key={item.id}>
                      <Card 
                        className={`item-card ${item.popular ? 'popular' : ''}`}
                        hoverable
                        bodyStyle={{ padding: '16px' }}
                        cover={
                          <div className="item-image-container">
                            <img 
                              alt={item.name} 
                              src={item.image}
                              className="item-image"
                            />
                            {item.discount > 0 && (
                              <div className="discount-badge">
                                -{item.discount}%
                              </div>
                            )}
                            {item.popular && (
                              <div className="popular-badge">
                                <StarOutlined /> Phổ biến
                              </div>
                            )}
                            <Button
                              type="text"
                              icon={favorites.includes(item.id) ? <HeartFilled /> : <HeartOutlined />}
                              className={`favorite-btn ${favorites.includes(item.id) ? 'favorited' : ''}`}
                              onClick={() => toggleFavorite(item.id)}
                            />
                          </div>
                        }
                      >
                        <div className="item-content">
                          <div className="item-info">
                            <Title level={5} className="item-name">{item.name}</Title>
                            <Text className="item-description">{item.description}</Text>
                            <div className="item-rating">
                              <StarOutlined className="star-icon" />
                              <span>{item.rating}</span>
                            </div>
                            <div className="item-price-section">
                              {item.discount > 0 && (
                                <Text delete className="original-price">
                                  {item.price.toLocaleString('vi-VN')} ₫
                                </Text>
                              )}
                              <Text strong className="item-price">
                                {item.discount > 0 
                                  ? ((item.price * (100 - item.discount)) / 100).toLocaleString('vi-VN')
                                  : item.price.toLocaleString('vi-VN')
                                } ₫
                              </Text>
                            </div>
                          </div>
                          <Button
                            type="primary"
                            shape="circle"
                            size="large"
                            icon={<PlusOutlined />}
                            className="add-btn"
                            onClick={() => addToCart(item)}
                          />
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>

              {/* Beverage Section */}
              <div className="section">
                <Title level={4} className="section-title">
                  <CoffeeOutlined className="section-icon" /> 
                  Thức uống
                  <span className="section-count">({beverageItems.length})</span>
                </Title>
                <Row gutter={[16, 16]}>
                  {filteredItems.filter(item => item.category === 'beverage').map((item) => (
                    <Col xs={24} sm={12} md={8} key={item.id}>
                      <Card 
                        className={`item-card ${item.popular ? 'popular' : ''}`}
                        hoverable
                        bodyStyle={{ padding: '16px' }}
                        cover={
                          <div className="item-image-container">
                            <img 
                              alt={item.name} 
                              src={item.image}
                              className="item-image"
                            />
                            {item.discount > 0 && (
                              <div className="discount-badge">
                                -{item.discount}%
                              </div>
                            )}
                            {item.popular && (
                              <div className="popular-badge">
                                <StarOutlined /> Phổ biến
                              </div>
                            )}
                            <Button
                              type="text"
                              icon={favorites.includes(item.id) ? <HeartFilled /> : <HeartOutlined />}
                              className={`favorite-btn ${favorites.includes(item.id) ? 'favorited' : ''}`}
                              onClick={() => toggleFavorite(item.id)}
                            />
                          </div>
                        }
                      >
                        <div className="item-content">
                          <div className="item-info">
                            <Title level={5} className="item-name">{item.name}</Title>
                            <Text className="item-description">{item.description}</Text>
                            <div className="item-rating">
                              <StarOutlined className="star-icon" />
                              <span>{item.rating}</span>
                            </div>
                            <div className="item-price-section">
                              {item.discount > 0 && (
                                <Text delete className="original-price">
                                  {item.price.toLocaleString('vi-VN')} ₫
                                </Text>
                              )}
                              <Text strong className="item-price">
                                {item.discount > 0 
                                  ? ((item.price * (100 - item.discount)) / 100).toLocaleString('vi-VN')
                                  : item.price.toLocaleString('vi-VN')
                                } ₫
                              </Text>
                            </div>
                          </div>
                          <Button
                            type="primary"
                            shape="circle"
                            size="large"
                            icon={<PlusOutlined />}
                            className="add-btn"
                            onClick={() => addToCart(item)}
                          />
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
                    <ShoppingCartOutlined className="cart-icon" />
                    <span>Giỏ hàng</span>
                    {cart.length > 0 && (
                      <Badge count={cart.length} size="small" className="cart-badge" />
                    )}
                  </Space>
                }
                className="cart-card"
                bodyStyle={{ padding: '16px' }}
              >
                {cart.length === 0 ? (
                  <Empty 
                    description="Giỏ hàng trống"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    className="empty-cart"
                  />
                ) : (
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-info">
                          <img src={item.image} alt={item.name} className="cart-item-image" />
                          <div className="cart-item-details">
                            <Text strong className="cart-item-name">{item.name}</Text>
                            <Text type="secondary" className="cart-item-price">
                              {item.discount > 0 
                                ? ((item.price * (100 - item.discount)) / 100).toLocaleString('vi-VN')
                                : item.price.toLocaleString('vi-VN')
                              } ₫
                            </Text>
                          </div>
                        </div>
                        <div className="cart-item-actions">
                          <Space size="small">
                            <Button
                              size="small"
                              icon={<MinusOutlined />}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="quantity-btn"
                            />
                            <InputNumber
                              size="small"
                              min={1}
                              value={item.quantity}
                              onChange={(value) => updateQuantity(item.id, value)}
                              style={{ width: 50 }}
                              className="quantity-input"
                            />
                            <Button
                              size="small"
                              icon={<PlusOutlined />}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="quantity-btn"
                            />
                          </Space>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Order Summary */}
              <Card title="Tổng đơn hàng" className="summary-card">
                <div className="summary-row">
                  <Text>Vé xem phim:</Text>
                  <Text>{totalPrice.toLocaleString('vi-VN')} ₫</Text>
                </div>
                <div className="summary-row">
                  <Text>Đồ ăn & thức uống:</Text>
                  <Text>{getCartTotal().toLocaleString('vi-VN')} ₫</Text>
                </div>
                <Divider style={{ margin: '12px 0' }} />
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
                  disabled={cart.length === 0}
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
