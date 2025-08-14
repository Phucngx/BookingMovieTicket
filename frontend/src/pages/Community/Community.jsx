import React, { useState } from 'react';
import { Avatar, Button, Tabs, Badge } from 'antd';
import { HeartOutlined, StarFilled, InfoCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import './Community.css';

const { TabPane } = Tabs;

const Community = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Trending movies data
  const trendingMovies = [
    { id: 1, title: 'Thanh Gươm Diệt Quỷ', date: '15.08.2025', image: 'https://via.placeholder.com/150x200/FF6B6B/FFFFFF?text=Thanh+Gươm+Diệt+Quỷ' },
    { id: 2, title: 'Conan Movie 28', date: '25.07.2025', image: 'https://via.placeholder.com/150x200/4ECDC4/FFFFFF?text=Conan+Movie+28' },
    { id: 3, title: 'Kaiju No.8', date: '01.08.2025', image: 'https://via.placeholder.com/150x200/45B7D1/FFFFFF?text=Kaiju+No.8' },
    { id: 4, title: 'Chainsaw Man', date: '10.09.2025', image: 'https://via.placeholder.com/150x200/96CEB4/FFFFFF?text=Chainsaw+Man' },
    { id: 5, title: 'Thám Tử Kiên', date: '30.04.2025', image: 'https://via.placeholder.com/150x200/FFEAA7/FFFFFF?text=Thám+Tử+Kiên' },
    { id: 6, title: 'Mang Mẹ Đi Bỏ', date: '01.08.2025', image: 'https://via.placeholder.com/150x200/DDA0DD/FFFFFF?text=Mang+Mẹ+Đi+Bỏ' },
    { id: 7, title: 'Doraemon Movie', date: '23.05.2025', image: 'https://via.placeholder.com/150x200/98D8C8/FFFFFF?text=Doraemon+Movie' },
    { id: 8, title: 'Toàn Trí Độc Giả', date: '01.08.2025', image: 'https://via.placeholder.com/150x200/F7DC6F/FFFFFF?text=Toàn+Trí+Độc+Giả' }
  ];

  // User activities data
  const userActivities = [
    {
      id: 1,
      userName: 'Thân Thị Thu Hằng',
      action: 'đã đánh giá',
      rating: 7,
      movieTitle: 'Conan Movie 28: Dư Ảnh Của Độc Nhãn',
      timeAgo: '1 giờ trước',
      hasSpoiler: false
    },
    {
      id: 2,
      userName: 'NGUYỄN VŨ VY',
      action: 'đã đánh giá',
      rating: 10,
      movieTitle: 'Conan Movie 28: Dư Ảnh Của Độc Nhãn',
      timeAgo: '4 giờ trước',
      hasSpoiler: false
    },
    {
      id: 3,
      userName: 'Trần thanh tiến',
      action: 'đã đánh giá',
      rating: 10,
      movieTitle: 'Mang Mẹ Đi Bỏ',
      timeAgo: '5 giờ trước',
      hasSpoiler: true,
      moviePoster: 'https://via.placeholder.com/60x80/FF6B6B/FFFFFF?text=Mang+Mẹ+Đi+Bỏ'
    },
    {
      id: 4,
      userName: 'Trương Quang Hải',
      action: 'đã đánh giá',
      rating: 8,
      movieTitle: 'Dính Lẹo',
      timeAgo: '6 giờ trước',
      hasSpoiler: false
    },
    {
      id: 5,
      userName: 'An Vương',
      action: 'đã đánh giá',
      rating: 9,
      movieTitle: 'Zombie Cưng Của Ba',
      timeAgo: '12 giờ trước',
      hasSpoiler: false
    }
  ];

  // Approved critics data
  const approvedCritics = [
    { id: 1, name: 'Bui An', role: 'Phóng viên (HDVietnam)' },
    { id: 2, name: 'Đào Bội Tú', role: 'Phê bình phim tự do' },
    { id: 3, name: 'Đào Diệu Loan', role: 'Phóng viên tự do' },
    { id: 4, name: 'Gwens Nghé', role: 'Phê bình – phân tích phim tự do' },
    { id: 5, name: 'Hanhfm', role: 'Nhà phê bình phim tự do' },
    { id: 6, name: 'Hoàng Cương', role: 'Writer tự do', avatar: 'https://via.placeholder.com/32x32/FF6B6B/FFFFFF?text=HC' }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(trendingMovies.length / 4));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(trendingMovies.length / 4)) % Math.ceil(trendingMovies.length / 4));
  };

  const totalSlides = Math.ceil(trendingMovies.length / 4);

  return (
    <div className="community-page">
      {/* Trending Section */}
      <section className="trending-section">
        <div className="trending-header">
          <h2>Thịnh hành</h2>
          <p>Các phim được yêu thích trong tuần</p>
        </div>
        
        <div className="trending-carousel">
          <button className="carousel-btn prev-btn" onClick={prevSlide}>
            ‹
          </button>
          
          <div className="trending-movies">
            {trendingMovies.slice(currentSlide * 4, (currentSlide * 4) + 4).map((movie) => (
              <div key={movie.id} className="trending-movie-card">
                <div className="movie-poster-container">
                  <img src={movie.image} alt={movie.title} className="movie-poster" />
                  <div className="heart-overlay">
                    <HeartOutlined className="heart-icon" />
                  </div>
                </div>
                <div className="movie-info">
                  <h4 className="movie-title">{movie.title}</h4>
                  <p className="movie-date">{movie.date}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="carousel-btn next-btn" onClick={nextSlide}>
            ›
          </button>
        </div>
        
        {/* Pagination dots */}
        <div className="carousel-dots">
          {Array.from({ length: totalSlides }, (_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="main-content">
        <div className="content-wrapper">
          {/* Left Column - User Activities */}
          <div className="left-column">
            <div className="activities-section">
              <h3>Moveek-er đang làm gì?</h3>
              
              <div className="activities-list">
                {userActivities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <Avatar icon="👤" className="user-avatar" />
                    <div className="activity-content">
                      <div className="activity-header">
                        <span className="user-name">{activity.userName}</span>
                        <span className="activity-action">{activity.action}</span>
                        <span className="rating">
                          {activity.rating}
                          <StarFilled className="star-icon" />
                        </span>
                        <span className="movie-title">{activity.movieTitle}</span>
                      </div>
                      
                      {activity.hasSpoiler && (
                        <div className="spoiler-warning">
                          <InfoCircleOutlined className="info-icon" />
                          <span>Review có hé lộ tình tiết phim. Nhấn để xem nội dung.</span>
                        </div>
                      )}
                      
                      {activity.moviePoster && (
                        <div className="movie-poster-thumbnail">
                          <img src={activity.moviePoster} alt="Movie poster" />
                        </div>
                      )}
                      
                      <span className="time-ago">{activity.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="right-sidebar">
            <Tabs defaultActiveKey="critics" className="sidebar-tabs">
              <TabPane tab="Moveek's Approved Critics" key="critics">
                <div className="critics-list">
                  {approvedCritics.map((critic) => (
                    <div key={critic.id} className="critic-item">
                      <div className="critic-info">
                        {critic.avatar ? (
                          <Avatar src={critic.avatar} className="critic-avatar" />
                        ) : (
                          <Avatar icon="👤" className="critic-avatar" />
                        )}
                        <div className="critic-details">
                          <div className="critic-name">
                            {critic.name}
                            <CheckCircleFilled className="checkmark-icon" />
                          </div>
                          <div className="critic-role">{critic.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabPane>
              
              <TabPane tab="Active Users" key="users">
                <div className="active-users-list">
                  <p>Danh sách người dùng đang hoạt động</p>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community;
