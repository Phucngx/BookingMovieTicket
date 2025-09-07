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
import { setSelectedMovie } from '../../store/slices/moviesSlice';
import './MovieDetail.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { movies } = useSelector((state) => state.movies);
  
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const bookingSectionRef = useRef(null);
  const movie = movies.find(m => m.id === parseInt(id));

  useEffect(() => {
    if (movie) {
      dispatch(setSelectedMovie(movie));
    }
  }, [movie, dispatch]);

  if (!movie) {
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

  const getGenreColor = (genre) => {
    const colors = {
      action: 'red',
      comedy: 'orange',
      romance: 'pink',
      horror: 'purple',
      animation: 'blue',
      drama: 'green'
    };
    return colors[genre] || 'default';
  };

  const getLanguageText = (language) => {
    const languages = {
      vietnamese: 'Tiếng Việt',
      japanese: 'Tiếng Nhật',
      english: 'Tiếng Anh',
      korean: 'Tiếng Hàn'
    };
    return languages[language] || language;
  };

  return (
    <div className="movie-detail">
      {/* Hero Section với Banner */}
      <div className="movie-hero" style={{ backgroundImage: `url(${movie.banner})` }}>
        <div className="hero-overlay">
          <div className="container">
            <Row gutter={24} align="middle">
              <Col xs={24} md={8}>
                <div className="movie-poster-container">
                  <img 
                    src={movie.poster} 
                    alt={movie.title} 
                    className="movie-poster-large"
                  />
                  <div className="movie-badges">
                    {movie.isEarlyShow && (
                      <Tag color="green" className="movie-badge">
                        CHIẾU SỚM
                      </Tag>
                    )}
                    {movie.isComingSoon && (
                      <Tag color="blue" className="movie-badge">
                        SẮP CHIẾU
                      </Tag>
                    )}
                  </div>
                </div>
              </Col>
              <Col xs={24} md={16}>
                <div className="movie-hero-info">
                  <Title level={1} className="movie-title-hero">
                    {movie.title}
                  </Title>
                  
                  <div className="movie-meta-hero">
                    <Space size="large">
                      {movie.rating && (
                        <div className="rating-container">
                          <Rate disabled defaultValue={movie.rating / 20} />
                          <Text className="rating-text">{movie.rating}%</Text>
                        </div>
                      )}
                      <Tag color={getGenreColor(movie.genre)} className="genre-tag">
                        {movie.genre?.toUpperCase()}
                      </Tag>
                      <Tag color="blue" className="language-tag">
                        {getLanguageText(movie.language)}
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
                      <Button 
                        size="large" 
                        icon={<HeartOutlined />}
                        className="favorite-btn"
                      >
                        Yêu thích
                      </Button>
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
            >
              <TabPane tab="Thông tin" key="1">
                <div className="movie-info-section">
                  <Title level={3}>Tóm tắt</Title>
                  <Paragraph className="movie-description">
                    {movie.description}
                  </Paragraph>
                  
                  <Divider />
                  
                  <Title level={3}>Thông tin chi tiết</Title>
                  <Row gutter={24}>
                    <Col xs={24} sm={12}>
                      <div className="info-item">
                        <ClockCircleOutlined className="info-icon" />
                        <div className="info-content">
                          <Text strong>Thời lượng:</Text>
                          <Text>{movie.duration}</Text>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div className="info-item">
                        <UserOutlined className="info-icon" />
                        <div className="info-content">
                          <Text strong>Đạo diễn:</Text>
                          <Text>{movie.director}</Text>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div className="info-item">
                        <TeamOutlined className="info-icon" />
                        <div className="info-content">
                          <Text strong>Diễn viên:</Text>
                          <Text>{movie.cast?.join(', ')}</Text>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div className="info-item">
                        <CalendarOutlined className="info-icon" />
                        <div className="info-content">
                          <Text strong>Ngày khởi chiếu:</Text>
                          <Text>{movie.date}</Text>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </TabPane>

              <TabPane tab="Trailer" key="2">
                <div className="trailer-section">
                  <Title level={3}>Trailer chính thức</Title>
                  <div className="trailer-container">
                    <iframe
                      src={movie.trailer}
                      title={`Trailer ${movie.title}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="trailer-iframe"
                    />
                  </div>
                </div>
              </TabPane>

                             <TabPane tab="Mua vé" key="3">
                 <div className="booking-section" ref={bookingSectionRef}>
                   <Title level={3}>Mua vé trực tuyến</Title>
                   
                   {movie.locations && movie.locations.length > 0 ? (
                     <div className="booking-container">
                       {/* Chọn địa điểm */}
                       <div className="location-selector">
                         <Title level={4}>Chọn địa điểm</Title>
                         <div className="location-options">
                           {movie.locations.map((location) => (
                             <Button
                               key={location.id}
                               type={selectedLocation?.id === location.id ? 'primary' : 'default'}
                               className="location-option"
                               onClick={() => setSelectedLocation(location)}
                             >
                               {location.name}
                             </Button>
                           ))}
                         </div>
                       </div>

                       {selectedLocation && (
                         <>
                           {/* Chọn ngày */}
                           <div className="date-selector">
                             <Title level={4}>Chọn ngày</Title>
                             <div className="date-options">
                               {selectedLocation.cinemas[0]?.showtimes.map((showtime) => (
                                 <Button
                                   key={showtime.id}
                                   type={selectedDate?.id === showtime.id ? 'primary' : 'default'}
                                   className="date-option"
                                   onClick={() => setSelectedDate(showtime)}
                                 >
                                   <div className="date-text">
                                     <div className="date-number">{showtime.date}</div>
                                     <div className="date-day">{showtime.day}</div>
                                   </div>
                                 </Button>
                               ))}
                             </div>
                           </div>

                           {/* Danh sách rạp */}
                           <div className="cinemas-list">
                             {selectedLocation.cinemas.map((cinema) => (
                               <div key={cinema.id} className="cinema-item">
                                 <div className="cinema-header">
                                   <Title level={5} className="cinema-name">
                                     {cinema.name}
                                   </Title>
                                   <Text type="secondary" className="cinema-count">
                                     {cinema.showtimes.length} ngày
                                   </Text>
                                 </div>
                                 
                                 <div className="cinema-address">
                                   <Text type="secondary">{cinema.address}</Text>
                                   <div className="cinema-actions">
                                     <Button type="link" size="small">
                                       Thông tin rạp
                                     </Button>
                                     <Button type="link" size="small">
                                       Bản đồ
                                     </Button>
                                   </div>
                                 </div>

                                 {selectedDate && (
                                   <div className="showtimes-grid">
                                     <div className="showtime-type">
                                       <Text strong>{selectedDate.times[0]?.type}</Text>
                                     </div>
                                     <div className="times-grid">
                                                                               {selectedDate.times.map((timeSlot) => (
                                          <Button
                                            key={timeSlot.time}
                                            type="default"
                                            className="time-slot"
                                            onClick={() => navigate('/chon-ghe', {
                                              state: {
                                                movie: movie,
                                                showtime: {
                                                  time: timeSlot.time,
                                                  price: timeSlot.price,
                                                  type: timeSlot.type,
                                                  cinema: selectedLocation.cinemas[0].name,
                                                  date: selectedDate.date,
                                                  day: selectedDate.day
                                                }
                                              }
                                            })}
                                            disabled={!timeSlot.available}
                                          >
                                            <div className="time-text">{timeSlot.time}</div>
                                            <div className="time-price">{parseInt(timeSlot.price).toLocaleString('vi-VN')}K</div>
                                          </Button>
                                        ))}
                                     </div>
                                   </div>
                                 )}
                               </div>
                             ))}
                           </div>

                           
                         </>
                       )}
                     </div>
                   ) : (
                     <div className="no-showtimes">
                       <Text type="secondary">Chưa có lịch chiếu cho phim này</Text>
                     </div>
                   )}
                 </div>
               </TabPane>
            </Tabs>
          </Col>

          <Col xs={24} lg={8}>
            <div className="movie-sidebar">
              <Card title="Thông tin nhanh" className="sidebar-card">
                <div className="sidebar-info">
                  <div className="info-row">
                    <Text strong>Thể loại:</Text>
                    <Tag color={getGenreColor(movie.genre)}>{movie.genre}</Tag>
                  </div>
                  <div className="info-row">
                    <Text strong>Ngôn ngữ:</Text>
                    <Text>{getLanguageText(movie.language)}</Text>
                  </div>
                  <div className="info-row">
                    <Text strong>Thời lượng:</Text>
                    <Text>{movie.duration}</Text>
                  </div>
                  <div className="info-row">
                    <Text strong>Khởi chiếu:</Text>
                    <Text>{movie.date}</Text>
                  </div>
                  {movie.rating && (
                    <div className="info-row">
                      <Text strong>Đánh giá:</Text>
                      <div className="rating-display">
                        <Rate disabled defaultValue={movie.rating / 20} />
                        <Text className="rating-percentage">{movie.rating}%</Text>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card title="Phim liên quan" className="sidebar-card">
                <List
                  dataSource={movies.filter(m => m.id !== movie.id).slice(0, 3)}
                  renderItem={(relatedMovie) => (
                    <List.Item 
                      className="related-movie-item"
                      onClick={() => navigate(`/phim/${relatedMovie.id}`)}
                    >
                      <List.Item.Meta
                        avatar={
                          <img 
                            src={relatedMovie.poster} 
                            alt={relatedMovie.title}
                            className="related-movie-poster"
                          />
                        }
                        title={relatedMovie.title}
                        description={
                          <div className="related-movie-meta">
                            <Text type="secondary">{relatedMovie.genre}</Text>
                            {relatedMovie.rating && (
                              <Text type="secondary"> • {relatedMovie.rating}%</Text>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
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
              <img src={movie.poster} alt={movie.title} className="booking-poster" />
              <div className="booking-movie-info">
                <Title level={4}>{movie.title}</Title>
                <Text type="secondary">{movie.duration}</Text>
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
    </div>
  );
};

export default MovieDetail;
