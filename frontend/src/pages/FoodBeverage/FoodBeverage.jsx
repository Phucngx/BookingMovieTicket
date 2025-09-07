import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Row,
  Col,
  Button, 
  Card,
  Divider,
  message
} from 'antd';
import { 
  LeftOutlined,
  PlusOutlined,
  MinusOutlined
} from '@ant-design/icons';
import './FoodBeverage.css';

const { Title, Text } = Typography;

const FoodBeverage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie, showtime, selectedSeats, totalPrice } = location.state || {
    movie: { title: 'Test Movie' },
    showtime: { price: '100000' },
    selectedSeats: ['A1'],
    totalPrice: 100000
  };
  
  const [cart, setCart] = useState([]);
  const [currentStep, setCurrentStep] = useState(2);

  // Combo items
  const comboItems = [
    {
      id: 13,
      name: 'Beta Combo 69oz',
      price: 68000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&auto=format',
      category: 'combo',
      description: 'TIẾT KIỆM 28K!!! Gồm: 1 Bắp (69oz) + 1 Nước có gaz (22oz)',
      rating: 4.8,
      popular: true,
      discount: 0,
      originalPrice: 96000
    },
    {
      id: 14,
      name: 'Sweet Combo 69oz',
      price: 88000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&auto=format',
      category: 'combo',
      description: 'TIẾT KIỆM 46K!!! Gồm: 1 Bắp (69oz) + 2 Nước có gaz (22oz)',
      rating: 4.9,
      popular: true,
      discount: 0,
      originalPrice: 134000
    },
    {
      id: 15,
      name: 'Family Combo 69oz',
      price: 213000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&auto=format',
      category: 'combo',
      description: 'TIẾT KIỆM 95K!!! Gồm: 2 Bắp (69oz) + 4 Nước có gaz (22oz) + 2 Snack Oishi (80g)',
      rating: 4.7,
      popular: true,
      discount: 0,
      originalPrice: 308000
    }
  ];

  const allItems = [...comboItems];

  useEffect(() => {
    console.log('FoodBeverage - location.state:', location.state);
    console.log('FoodBeverage - movie:', movie);
    console.log('FoodBeverage - showtime:', showtime);
    console.log('FoodBeverage - selectedSeats:', selectedSeats);
    
    if (!movie || !showtime || !selectedSeats) {
      console.log('FoodBeverage - Missing required data, redirecting to home');
      navigate('/');
    }
  }, [movie, showtime, selectedSeats, navigate, location.state]);

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


  // Temporary: Always show the page for debugging
  // if (!movie || !showtime || !selectedSeats) {
  //   return (
  //     <div className="food-beverage">
  //       <div style={{ padding: '50px', textAlign: 'center' }}>
  //         <Title level={2}>Đang tải...</Title>
  //         <Text>Vui lòng chờ trong giây lát</Text>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="food-beverage">
      {/* Enhanced Progress Bar */}
      <div className="progress-container">
        <div className="progress-header">
          <Title level={4} className="progress-title">
            Đặt vé xem phim - Bước 2/4
          </Title>
          <Text type="secondary">Chọn đồ ăn và thức uống (tùy chọn)</Text>
        </div>
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
          {/* Left Side - Combo Selection */}
          <Col xs={24} lg={14}>
            <div className="combo-section">
              <Title level={4} className="combo-title">COMBO</Title>
              <div className="combo-list">
                {comboItems.map((item) => {
                    const cartItem = cart.find(cartItem => cartItem.id === item.id);
                    const quantity = cartItem ? cartItem.quantity : 0;
                    
                    return (
                      <div key={item.id} className="combo-item">
                        <div className="combo-info">
                          <div className="combo-name">{item.name}</div>
                          <div className="combo-description">{item.description}</div>
                          <div className="combo-price">{item.price.toLocaleString('vi-VN')} ₫</div>
                        </div>
                        <div className="quantity-selector">
                          <Button 
                            size="small" 
                            icon={<MinusOutlined />}
                            onClick={() => updateQuantity(item.id, quantity - 1)}
                            disabled={quantity <= 0}
                            className="quantity-btn"
                          />
                          <span className="quantity-display">{quantity}</span>
                          <Button 
                            size="small" 
                            icon={<PlusOutlined />}
                            onClick={() => addToCart(item)}
                            className="quantity-btn"
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </Col>

          {/* Right Side - Order Summary Only */}
          <Col xs={24} lg={10}>
            <div className="right-sidebar">
              {/* Order Summary Card */}
              <Card className="order-summary-card">
                <div className="order-summary-header">
                  <Text className="summary-title">TỔNG ĐƠN HÀNG</Text>
                </div>
                <div className="total-price">
                  <Text className="total-amount">{getGrandTotal().toLocaleString('vi-VN')} ₫</Text>
                </div>
              </Card>
            </div>
          </Col>
        </Row>

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
            {cart.length > 0 ? 'Tiếp tục' : 'Bỏ qua'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoodBeverage;
