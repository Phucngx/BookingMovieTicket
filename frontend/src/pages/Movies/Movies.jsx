import React, { useState } from 'react'
import { Layout, Typography, Row, Col, Card, Input, Select, Space, Tag, Button } from 'antd'
import { SearchOutlined, StarFilled, CalendarOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import './Movies.css'

const { Content } = Layout
const { Title, Text } = Typography
const { Search } = Input
const { Option } = Select

const Movies = () => {
  const { movies } = useSelector((state) => state.movies)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterGenre, setFilterGenre] = useState('all')
  const [sortBy, setSortBy] = useState('rating')

  const genres = ['Tất cả', 'Hành động', 'Tình cảm', 'Hài hước', 'Kinh dị', 'Hoạt hình', 'Khoa học viễn tưởng']

  const filteredMovies = movies
    .filter(movie => 
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterGenre === 'all' || movie.genre === filterGenre)
    )
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'date') return a.date.localeCompare(b.date)
      if (sortBy === 'price') return parseInt(a.price) - parseInt(b.price)
      return 0
    })

  const handleSearch = (value) => {
    setSearchTerm(value)
  }

  return (
    <Content className="movies-content">
      <div className="container">
        <Title level={2} className="page-title">
          Danh sách phim
        </Title>
        
        <div className="movies-filters">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={8}>
              <Search
                placeholder="Tìm kiếm phim..."
                onSearch={handleSearch}
                style={{ width: '100%' }}
                enterButton={<SearchOutlined />}
              />
            </Col>
            
            <Col xs={24} md={6}>
              <Select
                defaultValue="all"
                style={{ width: '100%' }}
                onChange={setFilterGenre}
              >
                {genres.map(genre => (
                  <Option key={genre} value={genre === 'Tất cả' ? 'all' : genre}>
                    {genre}
                  </Option>
                ))}
              </Select>
            </Col>
            
            <Col xs={24} md={6}>
              <Select
                defaultValue="rating"
                style={{ width: '100%' }}
                onChange={setSortBy}
              >
                <Option value="rating">Sắp xếp theo rating</Option>
                <Option value="date">Sắp xếp theo ngày</Option>
                <Option value="price">Sắp xếp theo giá</Option>
              </Select>
            </Col>
            
            <Col xs={24} md={4}>
              <Text type="secondary">
                Tìm thấy {filteredMovies.length} phim
              </Text>
            </Col>
          </Row>
        </div>
        
        <Row gutter={[24, 24]}>
          {filteredMovies.map((movie) => (
            <Col xs={24} md={12} lg={8} xl={6} key={movie.id}>
              <Card 
                className="movie-detail-card"
                hoverable
                cover={
                  <div className="movie-poster-container">
                    <img
                      alt={movie.title}
                      src={movie.poster}
                      className="movie-poster"
                    />
                    {movie.isEarlyShow && (
                      <Tag color="red" className="early-show-tag">
                        CHIẾU SỚM
                      </Tag>
                    )}
                    <div className="movie-overlay">
                      <Button 
                        type="primary" 
                        icon={<PlayCircleOutlined />}
                        size="large"
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                }
              >
                <div className="movie-info">
                  <Title level={5} className="movie-title">
                    {movie.title}
                  </Title>
                  
                  <div className="movie-meta">
                    <Space size="small">
                      <StarFilled style={{ color: '#faad14' }} />
                      <Text strong>{movie.rating}%</Text>
                    </Space>
                    
                    <Space size="small">
                      <CalendarOutlined />
                      <Text type="secondary">{movie.date}</Text>
                    </Space>
                  </div>
                  
                  <div className="movie-price">
                    <Text strong style={{ color: '#1890ff', fontSize: '18px' }}>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(movie.price)}
                    </Text>
                  </div>
                  
                  <Button 
                    type="primary" 
                    size="large" 
                    block
                    style={{ marginTop: '16px' }}
                  >
                    Mua vé
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Content>
  )
}

export default Movies
