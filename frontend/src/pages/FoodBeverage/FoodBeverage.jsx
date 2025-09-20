import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import { fetchFoods, setSelection, clearSelections } from '../../store/slices/foodsSlice';

const { Title, Text } = Typography;

const FoodBeverage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedShowtime } = useSelector((state) => state.showtimes);
  const reduxSelectedSeats = useSelector((state) => state.seats.selectedSeats);
  const { token } = useSelector((state) => state.user);
  const foodsState = useSelector((state) => state.foods);
  const dispatch = useDispatch();

  const { movie, showtime, selectedSeats, totalPrice } = location.state || {
    movie: selectedShowtime?.movie,
    showtime: selectedShowtime,
    selectedSeats: [],
    totalPrice: 0
  };
  
  const [cart, setCart] = useState([]);
  const [currentStep, setCurrentStep] = useState(2);

  // Combo items
  const allItems = foodsState.items;

  const groupedByType = useMemo(() => {
    return allItems.reduce((acc, item) => {
      const key = item.type;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [allItems]);

// Prefill cart from Redux selections when available
  useEffect(() => {
    const selections = foodsState.selections || {};
    const prefilled = Object.values(selections);
    setCart(prefilled);
  }, [foodsState.selections]);

// Reset food selections on fresh entry unless returning with preserve flag
useEffect(() => {
  if (!location.state?.preserveSelections) {
    setCart([]);
    dispatch(clearSelections());
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  useEffect(() => {
    if (!token) {
      // Không có token: bỏ qua fetch, vẫn cho người dùng tiếp tục
      return;
    }
    dispatch(fetchFoods({ page: 1, size: 20, token }))
      .unwrap()
      .catch((err) => {
        message.error(err || 'Không thể tải danh sách bắp nước');
      });
  }, [dispatch, token]);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    const newQty = existingItem ? existingItem.quantity + 1 : 1;
    dispatch(setSelection({ food: item, quantity: newQty }));
    if (existingItem) {
      setCart(prevCart => 
        prevCart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: newQty }
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
    const foodObj = allItems.find(f => f.id === itemId)
    if (foodObj) {
      dispatch(setSelection({ food: foodObj, quantity }));
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
        movie: selectedShowtime?.movie || movie,
        showtime: selectedShowtime || showtime,
        selectedSeats: reduxSelectedSeats && reduxSelectedSeats.length > 0 ? reduxSelectedSeats : selectedSeats,
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
          {/* Left Side - Foods grouped by type */}
          <Col xs={24} lg={14}>
            {Object.entries(groupedByType).map(([type, items]) => (
              <div key={type} className="combo-section">
                <Title level={4} className="combo-title">{type}</Title>
                <div className="combo-list">
                  {items.map((item) => {
                    const cartItem = cart.find(cartItem => cartItem.id === item.id);
                    const quantity = cartItem ? cartItem.quantity : 0;
                    return (
                      <div key={item.id} className="combo-item">
                        <div className="combo-info">
                          <div className="combo-name">{item.name}</div>
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
            ))}
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
                {cart.length > 0 && (
                  <div className="price-breakdown">
                    {cart.map((item) => (
                      <div key={item.id} className="price-item">
                        <Text>x{item.quantity} {item.name} </Text>
                        <Text> - {(item.price * item.quantity).toLocaleString('vi-VN')} ₫</Text>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </Col>
        </Row>

        {/* Action Buttons */}
        <div className="action-buttons">
          <Button 
            icon={<LeftOutlined />} 
            size="large"
            onClick={() => navigate('/seat-selection', { state: { preserveSelections: true } })}
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
