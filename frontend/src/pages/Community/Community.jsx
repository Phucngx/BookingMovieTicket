import React, { useState } from 'react';
import { 
  Avatar, 
  Button, 
  Tabs, 
  Badge, 
  Card, 
  Rate, 
  Tag, 
  Input, 
  Modal, 
  Dropdown,
  Menu,
  Statistic,
  Row,
  Col,
  List
} from 'antd';
import { 
  HeartOutlined, 
  StarFilled, 
  InfoCircleOutlined, 
  CheckCircleFilled,
  MessageOutlined,
  ShareAltOutlined,
  LikeOutlined,
  BookOutlined,
  CalendarOutlined,
  FireOutlined,
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FlagOutlined,
  MoreOutlined
} from '@ant-design/icons';
import './Community.css';

const { TabPane } = Tabs;

const Community = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('trending');
  const [searchValue, setSearchValue] = useState('');
  const [isCreatePostModalVisible, setIsCreatePostModalVisible] = useState(false);

  // Trending movies data
  const trendingMovies = [
    { 
      id: 1, 
      title: 'Demon Slayer: Kimetsu no Yaiba', 
      date: '15.08.2025', 
      image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=400&fit=crop&crop=center',
      rating: 9.2,
      genre: 'Anime',
      views: 125000,
      likes: 8900,
      trending: true
    },
    { 
      id: 2, 
      title: 'Detective Conan: The Scarlet Bullet', 
      date: '25.07.2025', 
      image: 'https://images.unsplash.com/photo-1489599804151-0b0b4a0b0b0b?w=300&h=400&fit=crop&crop=center',
      rating: 8.8,
      genre: 'Mystery',
      views: 98000,
      likes: 7200,
      trending: true
    },
    { 
      id: 3, 
      title: 'Kaiju No.8', 
      date: '01.08.2025', 
      image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=400&fit=crop&crop=center',
      rating: 9.0,
      genre: 'Action',
      views: 156000,
      likes: 11200,
      trending: true
    },
    { 
      id: 4, 
      title: 'Chainsaw Man', 
      date: '10.09.2025', 
      image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=400&fit=crop&crop=center',
      rating: 9.5,
      genre: 'Horror',
      views: 203000,
      likes: 18900,
      trending: true
    },
    { 
      id: 5, 
      title: 'Spider-Man: Across the Spider-Verse', 
      date: '20.08.2025', 
      image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=400&fit=crop&crop=center',
      rating: 9.3,
      genre: 'Animation',
      views: 189000,
      likes: 15600,
      trending: true
    },
    { 
      id: 6, 
      title: 'Oppenheimer', 
      date: '05.08.2025', 
      image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=400&fit=crop&crop=center',
      rating: 8.9,
      genre: 'Drama',
      views: 145000,
      likes: 12300,
      trending: false
    },
    { 
      id: 7, 
      title: 'Barbie', 
      date: '12.08.2025', 
      image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=400&fit=crop&crop=center',
      rating: 8.7,
      genre: 'Comedy',
      views: 167000,
      likes: 14200,
      trending: true
    },
    { 
      id: 8, 
      title: 'Fast X', 
      date: '28.07.2025', 
      image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=400&fit=crop&crop=center',
      rating: 8.4,
      genre: 'Action',
      views: 134000,
      likes: 9800,
      trending: false
    }
  ];

  // Community posts data
  const communityPosts = [
    {
      id: 1,
      user: {
        name: 'Thân Thị Thu Hằng',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        level: 'Expert',
        verified: true
      },
      type: 'review',
      movie: {
        title: 'Detective Conan: The Scarlet Bullet',
        poster: 'https://images.unsplash.com/photo-1489599804151-0b0b4a0b0b0b?w=120&h=180&fit=crop&crop=center',
        rating: 7
      },
      content: 'Phim Conan lần này có cốt truyện khá hay, đặc biệt là phần animation và âm thanh. Tuy nhiên, kết thúc hơi vội vàng. Nhìn chung là một bộ phim đáng xem cho fan Conan.',
      images: ['https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=300&fit=crop&crop=center'],
      likes: 45,
      comments: 12,
      shares: 8,
      timeAgo: '1 giờ trước',
      tags: ['#Conan', '#Anime', '#Mystery'],
      hasSpoiler: false
    },
    {
      id: 2,
      user: {
        name: 'NGUYỄN VŨ VY',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        level: 'Critic',
        verified: true
      },
      type: 'review',
      movie: {
        title: 'Demon Slayer: Kimetsu no Yaiba',
        poster: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=120&h=180&fit=crop&crop=center',
        rating: 10
      },
      content: 'Tuyệt vời! Đây là một trong những phim anime hay nhất từ trước đến nay. Cốt truyện phức tạp, nhân vật phát triển tốt, và animation cực kỳ đẹp mắt.',
      images: ['https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=300&fit=crop&crop=center'],
      likes: 89,
      comments: 23,
      shares: 15,
      timeAgo: '4 giờ trước',
      tags: ['#DemonSlayer', '#Perfect', '#MustWatch'],
      hasSpoiler: false
    },
    {
      id: 3,
      user: {
        name: 'Trần Thanh Tiến',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        level: 'Member',
        verified: false
      },
      type: 'discussion',
      movie: {
        title: 'Spider-Man: Across the Spider-Verse',
        poster: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=120&h=180&fit=crop&crop=center',
        rating: 9
      },
      content: 'Ai đã xem phim Spider-Man này rồi? Mình thấy phần cuối hơi khó hiểu, có ai giải thích giúp mình không? Animation đẹp quá!',
      images: ['https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=300&fit=crop&crop=center'],
      likes: 23,
      comments: 8,
      shares: 3,
      timeAgo: '5 giờ trước',
      tags: ['#SpiderMan', '#Discussion', '#Help'],
      hasSpoiler: true
    },
    {
      id: 4,
      user: {
        name: 'Lê Minh Anh',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        level: 'Expert',
        verified: true
      },
      type: 'review',
      movie: {
        title: 'Oppenheimer',
        poster: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=120&h=180&fit=crop&crop=center',
        rating: 8
      },
      content: 'Phim Oppenheimer thực sự ấn tượng! Diễn xuất của Cillian Murphy xuất sắc, câu chuyện lịch sử được kể một cách hấp dẫn. Đáng xem!',
      images: [],
      likes: 67,
      comments: 15,
      shares: 12,
      timeAgo: '6 giờ trước',
      tags: ['#Oppenheimer', '#Drama', '#History'],
      hasSpoiler: false
    },
    {
      id: 5,
      user: {
        name: 'Phạm Văn Đức',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        level: 'Critic',
        verified: true
      },
      type: 'review',
      movie: {
        title: 'Barbie',
        poster: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=120&h=180&fit=crop&crop=center',
        rating: 9
      },
      content: 'Barbie không chỉ là phim giải trí mà còn mang thông điệp sâu sắc về nữ quyền. Margot Robbie diễn xuất tuyệt vời!',
      images: ['https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=300&fit=crop&crop=center'],
      likes: 112,
      comments: 34,
      shares: 28,
      timeAgo: '8 giờ trước',
      tags: ['#Barbie', '#Feminism', '#Comedy'],
      hasSpoiler: false
    }
  ];

  // Community stats
  const communityStats = {
    totalMembers: 125000,
    activeToday: 8500,
    totalReviews: 45000,
    totalDiscussions: 12000
  };

  // Trending topics
  const trendingTopics = [
    { name: 'Conan Movie 28', posts: 1250, trending: true },
    { name: 'Chainsaw Man', posts: 980, trending: true },
    { name: 'Kaiju No.8', posts: 756, trending: false },
    { name: 'Mang Mẹ Đi Bỏ', posts: 634, trending: false },
    { name: 'Thanh Gươm Diệt Quỷ', posts: 523, trending: true }
  ];

  // Approved critics data
  const approvedCritics = [
    { id: 1, name: 'Bui An', role: 'Phóng viên (HDVietnam)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    { id: 2, name: 'Đào Bội Tú', role: 'Phê bình phim tự do', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
    { id: 3, name: 'Đào Diệu Loan', role: 'Phóng viên tự do', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
    { id: 4, name: 'Gwens Nghé', role: 'Phê bình – phân tích phim tự do', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
    { id: 5, name: 'Hanhfm', role: 'Nhà phê bình phim tự do', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
    { id: 6, name: 'Hoàng Cương', role: 'Writer tự do', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }
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
      {/* Header Section */}
      <div className="community-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="community-title">
              <FireOutlined className="title-icon" />
              Cộng đồng Moveek
            </h1>
            <p className="community-subtitle">
              Nơi chia sẻ đam mê điện ảnh cùng hàng nghìn người yêu phim
            </p>
          </div>
          
          <div className="header-stats">
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Statistic 
                  title="Thành viên" 
                  value={communityStats.totalMembers} 
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="Hoạt động hôm nay" 
                  value={communityStats.activeToday} 
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="Đánh giá" 
                  value={communityStats.totalReviews} 
                  prefix={<StarFilled />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="Thảo luận" 
                  value={communityStats.totalDiscussions} 
                  prefix={<MessageOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
            </Row>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="community-main">
        <div className="main-layout">
          {/* Left Content */}
          <div className="left-content">
            {/* Search and Filter Bar */}
            <div className="search-filter-bar">
              <Input.Search
                placeholder="Tìm kiếm bài viết, phim, người dùng..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                prefix={<SearchOutlined />}
                size="large"
                className="search-input"
              />
              <div className="filter-actions">
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item key="latest">Mới nhất</Menu.Item>
                      <Menu.Item key="popular">Phổ biến</Menu.Item>
                      <Menu.Item key="trending">Thịnh hành</Menu.Item>
                    </Menu>
                  }
                  trigger={['click']}
                >
                  <Button icon={<SortAscendingOutlined />}>
                    Sắp xếp
                  </Button>
                </Dropdown>
                <Button icon={<FilterOutlined />}>
                  Bộ lọc
                </Button>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setIsCreatePostModalVisible(true)}
                >
                  Tạo bài viết
                </Button>
              </div>
            </div>

            {/* Content Tabs */}
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              className="content-tabs"
            >
              <TabPane 
                tab={
                  <span>
                    <FireOutlined />
                    Thịnh hành
                  </span>
                } 
                key="trending"
              >
                {/* Trending Movies Carousel */}
                <div className="trending-section">
                  <div className="section-header">
                    <h3>Phim đang thịnh hành</h3>
                    <p>Các bộ phim được bàn tán nhiều nhất tuần này</p>
        </div>
        
        <div className="trending-carousel">
          <button className="carousel-btn prev-btn" onClick={prevSlide}>
            ‹
          </button>
          
          <div className="trending-movies">
            {trendingMovies.slice(currentSlide * 4, (currentSlide * 4) + 4).map((movie) => (
                        <Card 
                          key={movie.id} 
                          className="trending-movie-card"
                          hoverable
                          cover={
                <div className="movie-poster-container">
                              <img src={movie.image} alt={movie.title} />
                              {movie.trending && (
                                <div className="trending-badge">
                                  <FireOutlined />
                                  Trending
                                </div>
                              )}
                              <div className="movie-overlay">
                                <Button type="primary" shape="circle" icon={<HeartOutlined />} />
                  </div>
                </div>
                          }
                        >
                <div className="movie-info">
                  <h4 className="movie-title">{movie.title}</h4>
                            <div className="movie-meta">
                              <Rate disabled defaultValue={movie.rating / 2} />
                              <span className="rating-text">{movie.rating}/10</span>
                            </div>
                            <div className="movie-stats">
                              <span><EyeOutlined /> {movie.views.toLocaleString()}</span>
                              <span><HeartOutlined /> {movie.likes.toLocaleString()}</span>
                </div>
                            <Tag color="blue">{movie.genre}</Tag>
              </div>
                        </Card>
            ))}
          </div>
          
          <button className="carousel-btn next-btn" onClick={nextSlide}>
            ›
          </button>
        </div>
        
        <div className="carousel-dots">
          {Array.from({ length: totalSlides }, (_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
                </div>
              </TabPane>

              <TabPane 
                tab={
                  <span>
                    <MessageOutlined />
                    Thảo luận
                        </span>
                } 
                key="discussions"
              >
                <div className="posts-section">
                  <List
                    itemLayout="vertical"
                    dataSource={communityPosts}
                    renderItem={(post) => (
                      <List.Item className="post-item">
                        <Card className="post-card">
                          <div className="post-header">
                            <div className="user-info">
                              <Avatar src={post.user.avatar} size={40} />
                              <div className="user-details">
                                <div className="user-name">
                                  {post.user.name}
                                  {post.user.verified && <CheckCircleFilled className="verified-icon" />}
                                  <Tag color="gold" size="small">{post.user.level}</Tag>
                                </div>
                                <span className="post-time">{post.timeAgo}</span>
                              </div>
                            </div>
                            <Dropdown
                              overlay={
                                <Menu>
                                  <Menu.Item key="edit" icon={<EditOutlined />}>Chỉnh sửa</Menu.Item>
                                  <Menu.Item key="delete" icon={<DeleteOutlined />}>Xóa</Menu.Item>
                                  <Menu.Item key="report" icon={<FlagOutlined />}>Báo cáo</Menu.Item>
                                </Menu>
                              }
                              trigger={['click']}
                            >
                              <Button type="text" icon={<MoreOutlined />} />
                            </Dropdown>
                      </div>
                      
                          <div className="post-content">
                            <div className="movie-context">
                              <img src={post.movie.poster} alt={post.movie.title} className="movie-poster-small" />
                              <div className="movie-details">
                                <h4>{post.movie.title}</h4>
                                <Rate disabled defaultValue={post.movie.rating / 2} />
                              </div>
                        </div>
                            
                            <p className="post-text">{post.content}</p>
                            
                            {post.images && post.images.length > 0 && (
                              <div className="post-images">
                                {post.images.map((image, index) => (
                                  <img 
                                    key={index} 
                                    src={image} 
                                    alt={`Post image ${index + 1}`}
                                    className="post-image"
                                  />
                                ))}
                              </div>
                            )}
                            
                            {post.hasSpoiler && (
                              <div className="spoiler-warning">
                                <InfoCircleOutlined />
                                <span>Nội dung có thể chứa spoiler</span>
                              </div>
                            )}
                            
                            <div className="post-tags">
                              {post.tags.map((tag, index) => (
                                <Tag key={index} color="blue">{tag}</Tag>
                              ))}
                            </div>
            </div>

                          <div className="post-actions">
                            <Button type="text" icon={<LikeOutlined />}>
                              {post.likes}
                            </Button>
                            <Button type="text" icon={<MessageOutlined />}>
                              {post.comments}
                            </Button>
                            <Button type="text" icon={<ShareAltOutlined />}>
                              {post.shares}
                            </Button>
                          </div>
                        </Card>
                      </List.Item>
                    )}
                  />
                </div>
              </TabPane>

              <TabPane 
                tab={
                  <span>
                    <BookOutlined />
                    Đánh giá
                  </span>
                } 
                key="reviews"
              >
                <div className="reviews-section">
                  <p>Phần đánh giá chi tiết sẽ được hiển thị ở đây...</p>
                </div>
              </TabPane>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="right-sidebar">
            {/* Trending Topics */}
            <Card title="Chủ đề thịnh hành" className="sidebar-card">
              <div className="trending-topics">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="topic-item">
                    <div className="topic-info">
                      <span className="topic-name">
                        {topic.name}
                        {topic.trending && <FireOutlined className="trending-icon" />}
                      </span>
                    </div>
                    <Badge count={topic.posts} showZero color="#1890ff" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Approved Critics */}
            <Card title="Critics được phê duyệt" className="sidebar-card">
                <div className="critics-list">
                  {approvedCritics.map((critic) => (
                    <div key={critic.id} className="critic-item">
                    <Avatar src={critic.avatar} size={32} />
                        <div className="critic-details">
                          <div className="critic-name">
                            {critic.name}
                            <CheckCircleFilled className="checkmark-icon" />
                          </div>
                          <div className="critic-role">{critic.role}</div>
                        </div>
                      </div>
                ))}
              </div>
            </Card>

            {/* Community Guidelines */}
            <Card title="Quy tắc cộng đồng" className="sidebar-card">
              <div className="guidelines">
                <div className="guideline-item">
                  <CheckCircleFilled className="guideline-icon" />
                  <span>Tôn trọng ý kiến của người khác</span>
                </div>
                <div className="guideline-item">
                  <CheckCircleFilled className="guideline-icon" />
                  <span>Không spam hoặc quảng cáo</span>
                    </div>
                <div className="guideline-item">
                  <CheckCircleFilled className="guideline-icon" />
                  <span>Đánh dấu spoiler khi cần thiết</span>
                </div>
                <div className="guideline-item">
                  <CheckCircleFilled className="guideline-icon" />
                  <span>Chia sẻ nội dung có chất lượng</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <Modal
        title="Tạo bài viết mới"
        visible={isCreatePostModalVisible}
        onCancel={() => setIsCreatePostModalVisible(false)}
        footer={null}
        width={600}
      >
        <div className="create-post-form">
          <p>Form tạo bài viết sẽ được hiển thị ở đây...</p>
        </div>
      </Modal>
    </div>
  );
};

export default Community;