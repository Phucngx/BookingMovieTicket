import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Typography, 
  Row, 
  Col, 
  Button, 
  Tag, 
  Divider, 
  List, 
  Avatar, 
  Space, 
  Card,
  Tabs,
  Rate,
  message,
  Modal
} from 'antd';
import { 
  PlayCircleOutlined, 
  ClockCircleOutlined, 
  UserOutlined, 
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  StarOutlined,
  LikeOutlined,
  ShareAltOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { fetchMovieDetails } from '../../store/slices/moviesSlice';
import AuthModal from '../../components/AuthModal/AuthModal';
import BookingSelector from '../../components/BookingSelector';
import TheaterList from '../../components/TheaterList';
import './MovieDetail.css';

const { Title, Text, Paragraph } = Typography;

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedMovie, loading, error } = useSelector((state) => state.movies);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const bookingSectionRef = useRef(null);

  console.log("selectedMovie", selectedMovie);


  useEffect(() => {
    if (id) {
      dispatch(fetchMovieDetails(id));
    }
  }, [id, dispatch]);

  // Listen for authentication state changes
  const { isAuthenticated } = useSelector((state) => state.user);
  
  useEffect(() => {
    if (isAuthenticated && authModalVisible) {
      setAuthModalVisible(false);
      // Refetch movie details after successful login
      if (id) {
        dispatch(fetchMovieDetails(id));
      }
    }
  }, [isAuthenticated, authModalVisible, id, dispatch]);


  if (loading) {
    return (
      <div className="movie-detail-loading">
        <Title level={2}>Đang tải...</Title>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-detail-error">
        <Title level={2}>Có lỗi xảy ra</Title>
        <Text type="danger">{error}</Text>
        {error.includes('đăng nhập') ? (
          <div style={{ marginTop: 16 }}>
            <Button type="primary" onClick={() => setAuthModalVisible(true)}>
              Đăng nhập
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
          </div>
        ) : (
          <Button type="primary" onClick={() => navigate('/')}>
            Về trang chủ
          </Button>
        )}
        <AuthModal 
          visible={authModalVisible}
          onCancel={() => setAuthModalVisible(false)}
        />
      </div>
    );
  }

  if (!selectedMovie) {
    return (
      <div className="movie-detail-not-found">
        <Title level={2}>Không tìm thấy phim</Title>
        <Button type="primary" onClick={() => navigate('/')}>
          Về trang chủ
        </Button>
      </div>
    );
  }

  const handleBookTicket = (showtime) => {
    setSelectedShowtime(showtime);
    setIsBookingModalVisible(true);
  };

  const handleConfirmBooking = () => {
    message.success(`Đã đặt vé thành công cho suất ${selectedShowtime.time} tại ${selectedShowtime.cinema}`);
    setIsBookingModalVisible(false);
    setSelectedShowtime(null);
  };

  const handleBookNowClick = () => {
    setActiveTab('3');
    // Cuộn xuống phần booking sau khi chuyển tab
    setTimeout(() => {
      if (bookingSectionRef.current) {
        bookingSectionRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const getGenreColor = (genreName) => {
    const colors = {
      'Hành động': 'red',
      'Hài': 'orange',
      'Lãng mạn': 'pink',
      'Kinh dị': 'purple',
      'Hoạt hình': 'blue',
      'Drama': 'green',
      'Tài liệu': 'cyan'
    };
    return colors[genreName] || 'default';
  };

  const getLanguageText = (language) => {
    const languages = {
      'Vietnamese': 'Tiếng Việt',
      'Japanese': 'Tiếng Nhật',
      'English': 'Tiếng Anh',
      'Korean': 'Tiếng Hàn'
    };
    return languages[language] || language;
  };

  const tabItems = [
    {
      key: '1',
      label: 'Thông tin',
      children: (
        <div className="movie-info-section">
          <Title level={3}>Tóm tắt</Title>
          <Paragraph className="movie-description">
            {selectedMovie.description}
          </Paragraph>
          
          <Divider />
          
          <Title level={3}>Thông tin chi tiết</Title>
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <div className="info-item">
                <ClockCircleOutlined className="info-icon" />
                <div className="info-content">
                  <Text strong>Thời lượng:</Text>
                  <Text>{selectedMovie.durationMinutes} phút</Text>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div className="info-item">
                <UserOutlined className="info-icon" />
                <div className="info-content">
                  <Text strong>Đạo diễn:</Text>
                  <Text>{selectedMovie.director?.name}</Text>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div className="info-item">
                <TeamOutlined className="info-icon" />
                <div className="info-content">
                  <Text strong>Diễn viên:</Text>
                  <Text>{selectedMovie.actors?.map(actor => actor.name).join(', ')}</Text>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div className="info-item">
                <CalendarOutlined className="info-icon" />
                <div className="info-content">
                  <Text strong>Ngày khởi chiếu:</Text>
                  <Text>{selectedMovie.releaseDate}</Text>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: '2',
      label: 'Trailer',
      children: (
        <div className="trailer-section">
          <Title level={3}>Trailer chính thức</Title>
          <div className="trailer-container">
            {selectedMovie.trailerUrl ? (
              <iframe
                src={selectedMovie.trailerUrl}
                title={`Trailer ${selectedMovie.title}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="trailer-iframe"
              />
            ) : (
              <Text type="secondary">Chưa có trailer</Text>
            )}
          </div>
        </div>
      )
    },
    {
      key: '3',
      label: 'Mua vé',
      children: (
        <div className="booking-section" ref={bookingSectionRef}>
          <Title level={3}>Mua vé trực tuyến</Title>
          
          <BookingSelector />
          <TheaterList movie={selectedMovie} />
        </div>
      )
    }
  ];

  return (
    <div className="movie-detail">
      {/* Hero Section với Banner */}
      <div className="movie-hero" style={{ backgroundImage: `url(${selectedMovie.bannerUrl})` }}>
        <div className="hero-overlay">
          <div className="container">
            <Row gutter={24} align="middle">
              <Col xs={24} md={10}>
                <div className="movie-poster-container-detail">
                  <img 
                    src={selectedMovie.posterUrl} 
                    alt={selectedMovie.title} 
                    className="movie-poster-large"
                  />
                </div>
              </Col>
              <Col xs={24} md={14}>
                <div className="movie-hero-info">
                  <Title level={1} className="movie-title-hero">
                    {selectedMovie.title}
                  </Title>
                  
                  <div className="movie-meta-hero">
                    <Space size="large">
                      {selectedMovie.rating && (
                        <div className="rating-container">
                          <Rate disabled defaultValue={selectedMovie.rating / 20} />
                          <Text className="rating-text">{selectedMovie.rating}%</Text>
                        </div>
                      )}
                      {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                        <Tag color={getGenreColor(selectedMovie.genres[0].genreName)} className="genre-tag">
                          {selectedMovie.genres[0].genreName}
                        </Tag>
                      )}
                      <Tag color="blue" className="language-tag">
                        {getLanguageText(selectedMovie.language)}
                      </Tag>
                    </Space>
                  </div>

                  <div className="movie-actions">
                    <Space size="middle">
                      <Button 
                        type="primary" 
                        size="large" 
                        icon={<PlayCircleOutlined />}
                        className="book-now-btn"
                        onClick={handleBookNowClick}
                      >
                        Mua vé ngay
                      </Button>
                      {/* <Button 
                        size="large" 
                        icon={<HeartOutlined />}
                        className="favorite-btn"
                      >
                        Yêu thích
                      </Button> */}
                      <Button 
                        size="large" 
                        icon={<ShareAltOutlined />}
                        className="share-btn"
                      >
                        Chia sẻ
                      </Button>
                    </Space>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              className="movie-detail-tabs"
              items={tabItems}
            />
          </Col>

          <Col xs={24} lg={8}>
            <div className="movie-sidebar">
              <Card title="Thông tin nhanh" className="sidebar-card">
                <div className="sidebar-info">
                  <div className="info-row">
                    <Text strong>Thể loại:</Text>
                    {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                      <Tag color={getGenreColor(selectedMovie.genres[0].genreName)}>
                        {selectedMovie.genres[0].genreName}
                      </Tag>
                    )}
                  </div>
                  <div className="info-row">
                    <Text strong>Ngôn ngữ:</Text>
                    <Text>{getLanguageText(selectedMovie.language)}</Text>
                  </div>
                  <div className="info-row">
                    <Text strong>Thời lượng:</Text>
                    <Text>{selectedMovie.durationMinutes} phút</Text>
                  </div>
                  <div className="info-row">
                    <Text strong>Khởi chiếu:</Text>
                    <Text>{selectedMovie.releaseDate}</Text>
                  </div>
                  <div className="info-row">
                    <Text strong>Quốc gia:</Text>
                    <Text>{selectedMovie.country}</Text>
                  </div>
                  {selectedMovie.rating && (
                    <div className="info-row">
                      <Text strong>Đánh giá:</Text>
                      <div className="rating-display">
                        <Rate disabled defaultValue={selectedMovie.rating / 20} />
                        <Text className="rating-percentage">{selectedMovie.rating}%</Text>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card title="Thông tin đạo diễn" className="sidebar-card">
                {selectedMovie.director && (
                  <div className="director-info">
                    <Text strong>{selectedMovie.director.name}</Text>
                    <br />
                    <Text type="secondary">Quốc tịch: {selectedMovie.director.nationality}</Text>
                    <br />
                    <Text type="secondary">Sinh: {selectedMovie.director.birthDate}</Text>
                  </div>
                )}
              </Card>
            </div>
          </Col>
        </Row>
      </div>

      {/* Booking Modal */}
      <Modal
        title="Xác nhận đặt vé"
        open={isBookingModalVisible}
        onOk={handleConfirmBooking}
        onCancel={() => setIsBookingModalVisible(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        className="booking-modal"
      >
        {selectedShowtime && (
          <div className="booking-details">
            <div className="booking-movie">
              <img src={selectedMovie.posterUrl} alt={selectedMovie.title} className="booking-poster" />
              <div className="booking-movie-info">
                <Title level={4}>{selectedMovie.title}</Title>
                <Text type="secondary">{selectedMovie.durationMinutes} phút</Text>
              </div>
            </div>
            
            <Divider />
            
            <div className="booking-showtime">
              <div className="booking-info-row">
                <Text strong>Suất chiếu:</Text>
                <Text>{selectedShowtime.time}</Text>
              </div>
              <div className="booking-info-row">
                <Text strong>Rạp:</Text>
                <Text>{selectedShowtime.cinema}</Text>
              </div>
              <div className="booking-info-row">
                <Text strong>Phòng:</Text>
                <Text>{selectedShowtime.hall}</Text>
              </div>
              <div className="booking-info-row">
                <Text strong>Loại:</Text>
                <Tag color="blue">{selectedShowtime.type}</Tag>
              </div>
              <div className="booking-info-row">
                <Text strong>Giá vé:</Text>
                <Text strong className="booking-price">
                  {parseInt(selectedShowtime.price).toLocaleString('vi-VN')}đ
                </Text>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <AuthModal 
        visible={authModalVisible}
        onCancel={() => setAuthModalVisible(false)}
      />
    </div>
  );
};

export default MovieDetail;
