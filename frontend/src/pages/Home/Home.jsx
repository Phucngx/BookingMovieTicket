import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Card, Typography, Button, Space, Statistic, Carousel, Tag } from 'antd'
import { 
  PlayCircleOutlined, 
  CalendarOutlined, 
  EnvironmentOutlined, 
  UserOutlined,
  StarOutlined,
  FireOutlined,
  TrophyOutlined
} from '@ant-design/icons'
import MovieSection from '../../components/MovieSection/MovieSection'
import TheaterBooking from '../../components/TheaterBooking/TheaterBooking'
import './Home.css'

const { Title, Text, Paragraph } = Typography

const Home = () => {
  const navigate = useNavigate()
  // Mock data for featured content
  const featuredMovies = [
    {
      id: 1,
      title: "Avengers: Endgame",
      poster: "https://via.placeholder.com/300x450/ff6b6b/ffffff?text=Avengers",
      rating: 9.2,
      genre: "Action",
      duration: "181 phút"
    },
    {
      id: 2,
      title: "Spider-Man: No Way Home",
      poster: "https://via.placeholder.com/300x450/4ecdc4/ffffff?text=Spider-Man",
      rating: 8.8,
      genre: "Action",
      duration: "148 phút"
    },
    {
      id: 3,
      title: "Dune",
      poster: "https://via.placeholder.com/300x450/45b7d1/ffffff?text=Dune",
      rating: 8.5,
      genre: "Sci-Fi",
      duration: "155 phút"
    }
  ]

  const stats = [
    { title: 'Rạp chiếu phim', value: 50, prefix: <EnvironmentOutlined /> },
    { title: 'Phim đang chiếu', value: 25, prefix: <PlayCircleOutlined /> },
    { title: 'Khách hàng', value: 10000, suffix: '+', prefix: <UserOutlined /> },
    { title: 'Đánh giá trung bình', value: 4.8, suffix: '/5', prefix: <StarOutlined /> }
  ]

  const carouselItems = [
    {
      title: "Trải nghiệm điện ảnh tuyệt vời",
      subtitle: "Công nghệ IMAX 4K, âm thanh Dolby Atmos",
      image: "https://via.placeholder.com/1200x400/667eea/ffffff?text=IMAX+Experience",
      buttonText: "Khám phá ngay"
    },
    {
      title: "Ưu đãi đặc biệt cuối tuần",
      subtitle: "Giảm 30% cho tất cả suất chiếu",
      image: "https://via.placeholder.com/1200x400/f093fb/ffffff?text=Weekend+Special",
      buttonText: "Đặt vé ngay"
    },
    {
      title: "Phim mới ra mắt",
      subtitle: "Cập nhật liên tục những bộ phim hot nhất",
      image: "https://via.placeholder.com/1200x400/4facfe/ffffff?text=New+Releases",
      buttonText: "Xem lịch chiếu"
    }
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Carousel 
          autoplay
          dots={{ className: 'custom-carousel-dots' }}
          arrows={true}
          autoplaySpeed={4000}
          speed={800}
          className="hero-carousel"
        >
          {carouselItems.map((item, index) => (
            <div key={index} className="hero-slide">
              <div 
                className="hero-background" 
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <div className="hero-overlay">
                  <div className="container">
                    <Row align="middle" style={{ minHeight: '500px' }}>
                      <Col xs={24} md={12}>
                        <div className="hero-content">
                          <Title level={1} className="hero-title">
                            {item.title}
                          </Title>
                          <Paragraph className="hero-subtitle">
                            {item.subtitle}
                          </Paragraph>
                          <div className="section-actions">
                            <Button 
                              type="primary" 
                              size="large" 
                              icon={<PlayCircleOutlined />}
                              className="hero-button"
                              onClick={() => {
                                // Handle button click based on button text
                                if (item.buttonText === "Khám phá ngay") {
                                  // Navigate to movies or scroll to movie section
                                  document.querySelector('.movie-section')?.scrollIntoView({ behavior: 'smooth' });
                                } else if (item.buttonText === "Đặt vé ngay") {
                                  // Navigate to booking
                                  document.querySelector('.quick-booking-section')?.scrollIntoView({ behavior: 'smooth' });
                                } else if (item.buttonText === "Xem lịch chiếu") {
                                  // Navigate to schedule
                                  navigate('/lich-chieu');
                                }
                              }}
                            >
                              {item.buttonText}
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <Row gutter={[24, 24]}>
            {stats.map((stat, index) => (
              <Col xs={12} sm={6} key={index}>
                <Card className="stat-card">
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Movie Section */}
      <MovieSection />

      {/* Quick Booking Section */}
      <section className="quick-booking-section">
        <div className="container">
          <TheaterBooking />
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="promo-banner">
        <div className="container">
          <Card className="promo-card">
            <Row align="middle">
              <Col xs={24} md={16}>
                <div className="promo-content">
                  <Title level={3} className="promo-title">
                    <TrophyOutlined className="promo-icon" />
                    Thành viên VIP
                  </Title>
                  <Paragraph className="promo-description">
                    Tích điểm mỗi lần mua vé, đổi quà hấp dẫn và hưởng ưu đãi đặc biệt
                  </Paragraph>
                  <div className="section-actions">
                    <Button 
                      type="primary" 
                      size="large"
                      onClick={() => {
                        // Navigate to profile or membership page
                        navigate('/tai-khoan');
                      }}
                    >
                      Đăng ký ngay
                    </Button>
                    <Button 
                      size="large"
                      onClick={() => {
                        // Show more info about VIP membership
                        alert('Thông tin chi tiết về chương trình thành viên VIP sẽ được cập nhật sớm!');
                      }}
                    >
                      Tìm hiểu thêm
                    </Button>
                  </div>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="promo-image">
                  <img 
                    src="https://via.placeholder.com/300x200/ff9a9e/ffffff?text=VIP+Member" 
                    alt="VIP Member"
                    className="promo-img"
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default Home
