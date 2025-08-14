import React, { useState } from 'react';
import { Button, Dropdown } from 'antd';
import { DownOutlined, HeartOutlined, StarOutlined, CheckOutlined } from '@ant-design/icons';
import './NowShowing.css';

const NowShowing = () => {
  const [popularFilter, setPopularFilter] = useState('Phổ biến');
  const [genreFilter, setGenreFilter] = useState('Thể loại');
  const [languageFilter, setLanguageFilter] = useState('Ngôn ngữ');

  const popularItems = [
    { key: 'popular', label: 'Phổ biến nhất' },
    { key: 'newest', label: 'Mới nhất' },
    { key: 'rating', label: 'Đánh giá cao' },
  ];

  const genreItems = [
    { key: 'action', label: 'Hành động' },
    { key: 'comedy', label: 'Hài hước' },
    { key: 'drama', label: 'Tâm lý' },
    { key: 'horror', label: 'Kinh dị' },
    { key: 'romance', label: 'Tình cảm' },
    { key: 'animation', label: 'Hoạt hình' },
  ];

  const languageItems = [
    { key: 'vietnamese', label: 'Tiếng Việt' },
    { key: 'english', label: 'Tiếng Anh' },
    { key: 'korean', label: 'Tiếng Hàn' },
    { key: 'chinese', label: 'Tiếng Trung' },
    { key: 'japanese', label: 'Tiếng Nhật' },
  ];

  const movies = [
    {
      id: 1,
      title: 'Thanh Gươm D...',
      date: '15/08',
      rating: null,
      label: 'CHIẾU SỚM',
      image: 'https://via.placeholder.com/200x300/4A90E2/FFFFFF?text=Thanh+Gươm+D...',
      isAnimated: true
    },
    {
      id: 2,
      title: 'Mang Mẹ Đi Bỏ',
      date: '01/08',
      rating: '68%',
      label: null,
      image: 'https://via.placeholder.com/200x300/E24A4A/FFFFFF?text=Mang+Mẹ+Đi+Bỏ',
      isAnimated: false
    },
    {
      id: 3,
      title: 'Dính Lẹo',
      date: '15/08',
      rating: null,
      label: 'CHIẾU SỚM',
      image: 'https://via.placeholder.com/200x300/4AE24A/FFFFFF?text=Dính+Lẹo',
      isAnimated: false
    },
    {
      id: 4,
      title: 'Zombie Cung Của Ba',
      date: '08/08',
      rating: '100%',
      label: null,
      image: 'https://via.placeholder.com/200x300/8A4AE2/FFFFFF?text=Zombie+Cung+Của+Ba',
      isAnimated: false
    },
    {
      id: 5,
      title: 'Conan Movie 2...',
      date: '25/07',
      rating: '92%',
      label: null,
      image: 'https://via.placeholder.com/200x300/E2A84A/FFFFFF?text=Conan+Movie+2...',
      isAnimated: true
    },
    {
      id: 6,
      title: 'Chốt Đơn',
      date: '08/08',
      rating: null,
      label: null,
      image: 'https://via.placeholder.com/200x300/4AE2A8/FFFFFF?text=Chốt+Đơn',
      isAnimated: false
    },
    {
      id: 7,
      title: 'JUMBO',
      date: '08/08',
      rating: null,
      label: null,
      image: 'https://via.placeholder.com/200x300/E24A8A/FFFFFF?text=JUMBO',
      isAnimated: true
    },
    {
      id: 8,
      title: 'HỌNG SÚNG',
      date: '08/08',
      rating: null,
      label: null,
      image: 'https://via.placeholder.com/200x300/8AE24A/FFFFFF?text=HỌNG+SÚNG',
      isAnimated: false
    },
    {
      id: 9,
      title: 'Thám Tử Tư: Phía Sau Vết Máu',
      date: '25/07',
      rating: null,
      label: null,
      image: 'https://via.placeholder.com/200x300/4A90E2/FFFFFF?text=Thám+Tử+Tư',
      isAnimated: false
    },
    {
      id: 10,
      title: 'Kaiju No.8: Nhi...',
      date: '25/07',
      rating: null,
      label: null,
      image: 'https://via.placeholder.com/200x300/E24A4A/FFFFFF?text=Kaiju+No.8',
      isAnimated: true
    },
    {
      id: 11,
      title: 'Quỷ Ăn Hồn',
      date: '25/07',
      rating: '60%',
      label: null,
      image: 'https://via.placeholder.com/200x300/4AE24A/FFFFFF?text=Quỷ+Ăn+Hồn',
      isAnimated: false
    },
    {
      id: 12,
      title: 'Phim Xì Trum',
      date: '18/07',
      rating: '83%',
      label: null,
      image: 'https://via.placeholder.com/200x300/8A4AE2/FFFFFF?text=Phim+Xì+Trum',
      isAnimated: true
    },
    {
      id: 13,
      title: 'Superman (2025)',
      date: '11/07',
      rating: '93%',
      label: null,
      image: 'https://via.placeholder.com/200x300/E2A84A/FFFFFF?text=Superman+2025',
      isAnimated: false
    },
    {
      id: 14,
      title: 'Tiếng Ồn Quỷ Dị',
      date: '18/07',
      rating: null,
      label: null,
      image: 'https://via.placeholder.com/200x300/4AE2A8/FFFFFF?text=Tiếng+Ồn+Quỷ+Dị',
      isAnimated: false
    },
    {
      id: 15,
      title: 'Một Nửa Hoàn Hảo',
      date: '04/07',
      rating: '100%',
      label: null,
      image: 'https://via.placeholder.com/200x300/E24A8A/FFFFFF?text=Một+Nửa+Hoàn+Hảo',
      isAnimated: false
    },
    {
      id: 16,
      title: 'Thế Giới Khủng Long',
      date: '04/07',
      rating: '75%',
      label: null,
      image: 'https://via.placeholder.com/200x300/4A90E2/FFFFFF?text=Thế+Giới+Khủng+Long',
      isAnimated: false
    },
    {
      id: 17,
      title: 'F1',
      date: '27/06',
      rating: '78%',
      label: null,
      image: 'https://via.placeholder.com/200x300/E24A4A/FFFFFF?text=F1',
      isAnimated: false
    },
    {
      id: 18,
      title: 'Lilo & Stitch live action',
      date: '23/05',
      rating: '100%',
      label: null,
      image: 'https://via.placeholder.com/200x300/4AE24A/FFFFFF?text=Lilo+Stitch',
      isAnimated: true
    },
    {
      id: 19,
      title: 'Bí Kíp Luyện Rồng',
      date: '13/06',
      rating: '93%',
      label: null,
      image: 'https://via.placeholder.com/200x300/8A4AE2/FFFFFF?text=Bí+Kíp+Luyện+Rồng',
      isAnimated: true
    }
  ];

  return (
    <div className="now-showing-page">
      {/* Banner Section */}
      <div className="banner-section">
        <div className="banner-overlay">
          <h1 className="main-title">Phim đang chiếu</h1>
          <p className="main-description">
            Danh sách các phim hiện đang chiếu rạp trên toàn quốc 14/08/2025. 
            Xem lịch chiếu phim, giá vé tiện lợi, đặt vé nhanh chỉ với 1 bước!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">
          {/* Left Sidebar - Filters */}
          <div className="left-sidebar">
            <div className="filter-section">
              <h3>Bộ lọc</h3>
              
              <Dropdown
                menu={{ items: popularItems, onClick: (e) => setPopularFilter(e.key) }}
                placement="bottomLeft"
                trigger={['click']}
              >
                <Button className="filter-button">
                  {popularFilter} <DownOutlined />
                </Button>
              </Dropdown>

              <Dropdown
                menu={{ items: genreItems, onClick: (e) => setGenreFilter(e.key) }}
                placement="bottomLeft"
                trigger={['click']}
              >
                <Button className="filter-button">
                  {genreFilter} <DownOutlined />
                </Button>
              </Dropdown>

              <Dropdown
                menu={{ items: languageItems, onClick: (e) => setLanguageFilter(e.key) }}
                placement="bottomLeft"
                trigger={['click']}
              >
                <Button className="filter-button">
                  {languageFilter} <DownOutlined />
                </Button>
              </Dropdown>
            </div>
          </div>

          {/* Right Content - Movie Grid */}
          <div className="right-content">
            <div className="movie-grid">
              {movies.map((movie) => (
                <div key={movie.id} className="movie-card">
                  <div className="movie-poster">
                    <img src={movie.image} alt={movie.title} />
                    
                    {/* Special Label */}
                    {movie.label && (
                      <div className="movie-label">{movie.label}</div>
                    )}
                    
                    {/* Top Right Icons */}
                    <div className="movie-icons">
                      <HeartOutlined className="icon heart-icon" />
                      <StarOutlined className="icon star-icon" />
                    </div>
                  </div>
                  
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    <div className="movie-meta">
                      <span className="movie-date">{movie.date}</span>
                      {movie.rating && (
                        <span className="movie-rating">{movie.rating}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="footer-content">
          <div className="footer-columns">
            {/* Company Information */}
            <div className="footer-column company-info">
              <div className="company-logo">
                <div className="logo-square">Mv</div>
                <h3>CÔNG TY TNHH MONET</h3>
              </div>
              <p>SỐ ĐKKD: 0315367026</p>
              <p>Nơi cấp: Sở kế hoạch và đầu tư Tp. Hồ Chí Minh</p>
              <p>Đăng ký lần đầu ngày 01/11/2018</p>
              <p>Địa chỉ: 33 Nguyễn Trung Trực, P.5, Q. Bình Thạnh, Tp. Hồ Chí Minh</p>
              <div className="footer-links">
                <a href="#">Về chúng tôi</a>
                <a href="#">Chính sách bảo mật</a>
                <a href="#">Hỗ trợ</a>
                <a href="#">Liên hệ</a>
              </div>
              <p className="version">v8.1</p>
            </div>

            {/* Partners */}
            <div className="footer-column partners">
              <h3>ĐỐI TÁC</h3>
              <div className="partner-logos">
                <div className="partner-row">
                  <div className="partner-logo">beta cinemas</div>
                  <div className="partner-logo">Mega GS</div>
                  <div className="partner-logo">CNESAR</div>
                  <div className="partner-logo">Dcine</div>
                  <div className="partner-logo">CINEMAX</div>
                  <div className="partner-logo">STARLIGHT</div>
                </div>
                <div className="partner-row">
                  <div className="partner-logo">TOUCH CINEMA</div>
                  <div className="partner-logo">Payoo</div>
                  <div className="partner-logo">MoMo</div>
                  <div className="partner-logo">ZaloPay</div>
                  <div className="partner-logo">DDC</div>
                  <div className="partner-logo">RONGJA CINEW</div>
                </div>
              </div>
            </div>

            {/* Certification */}
            <div className="footer-column certification">
              <div className="cert-badge">
                <CheckOutlined className="check-icon" />
                <span>ĐÃ THÔNG BÁO BỘ CÔNG THƯƠNG</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NowShowing;
