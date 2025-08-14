import React, { useState } from 'react'
import { Layout, Typography, Row, Col, Card, Tag, Space, Button, Select, Input, Divider } from 'antd'
import { SearchOutlined, FilterOutlined, CalendarOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import MovieCard from '../../components/MovieCard/MovieCard'
import './NowShowing.css'

const { Content } = Layout
const { Title, Text, Paragraph } = Typography
const { Search } = Input

const NowShowing = () => {
  const { movies } = useSelector((state) => state.movies)
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  // Lọc phim đang chiếu
  const nowShowingMovies = movies.filter(movie => !movie.isComingSoon)

  // Xử lý lọc theo thể loại
  const handleGenreFilter = (value) => {
    setSelectedGenre(value)
  }

  // Xử lý lọc theo ngôn ngữ
  const handleLanguageFilter = (value) => {
    setSelectedLanguage(value)
  }

  // Xử lý sắp xếp
  const handleSort = (value) => {
    setSortBy(value)
  }

  return (
    <Content className="now-showing-content">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <Title level={1} className="main-title">
            Phim đang chiếu
          </Title>
          <Paragraph className="description">
            Danh sách các phim hiện đang chiếu rạp trên toàn quốc 14/08/2025. 
            Xem lịch chiếu phim, giá vé tiện lợi, đặt vé nhanh chỉ với 1 bước!
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {/* Sidebar Filters */}
          <Col xs={24} lg={6}>
            <div className="filter-sidebar">
              <Title level={4} className="filter-title">
                Bộ lọc
              </Title>
              
              {/* Sắp xếp */}
              <div className="filter-section">
                <Text strong>Sắp xếp</Text>
                <Select
                  value={sortBy}
                  onChange={handleSort}
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder="Chọn cách sắp xếp"
                >
                  <Select.Option value="popular">Phổ biến</Select.Option>
                  <Select.Option value="newest">Mới nhất</Select.Option>
                  <Select.Option value="rating">Đánh giá cao</Select.Option>
                  <Select.Option value="price-low">Giá thấp đến cao</Select.Option>
                  <Select.Option value="price-high">Giá cao đến thấp</Select.Option>
                </Select>
              </div>

              {/* Thể loại */}
              <div className="filter-section">
                <Text strong>Thể loại</Text>
                <Select
                  value={selectedGenre}
                  onChange={handleGenreFilter}
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder="Chọn thể loại"
                >
                  <Select.Option value="all">Tất cả</Select.Option>
                  <Select.Option value="action">Hành động</Select.Option>
                  <Select.Option value="comedy">Hài</Select.Option>
                  <Select.Option value="drama">Tình cảm</Select.Option>
                  <Select.Option value="horror">Kinh dị</Select.Option>
                  <Select.Option value="animation">Hoạt hình</Select.Option>
                  <Select.Option value="adventure">Phiêu lưu</Select.Option>
                  <Select.Option value="sci-fi">Viễn tưởng</Select.Option>
                </Select>
              </div>

              {/* Ngôn ngữ */}
              <div className="filter-section">
                <Text strong>Ngôn ngữ</Text>
                <Select
                  value={selectedLanguage}
                  onChange={handleLanguageFilter}
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder="Chọn ngôn ngữ"
                >
                  <Select.Option value="all">Tất cả</Select.Option>
                  <Select.Option value="vietnamese">Tiếng Việt</Select.Option>
                  <Select.Option value="english">Tiếng Anh</Select.Option>
                  <Select.Option value="japanese">Tiếng Nhật</Select.Option>
                  <Select.Option value="korean">Tiếng Hàn</Select.Option>
                  <Select.Option value="chinese">Tiếng Trung</Select.Option>
                </Select>
              </div>

              {/* Tìm kiếm */}
              <div className="filter-section">
                <Text strong>Tìm kiếm</Text>
                <Search
                  placeholder="Tìm tên phim..."
                  style={{ marginTop: 8 }}
                  allowClear
                />
              </div>
            </div>
          </Col>

          {/* Main Content - Movie Grid */}
          <Col xs={24} lg={18}>
            <div className="movie-grid-container">
              {/* Grid Header */}
              <div className="grid-header">
                <div className="results-info">
                  <Text>
                    Hiển thị {nowShowingMovies.length} phim đang chiếu
                  </Text>
                </div>
                <div className="view-options">
                  <Button.Group>
                    <Button icon={<CalendarOutlined />} type="default">
                      Lịch chiếu
                    </Button>
                    <Button icon={<FilterOutlined />} type="default">
                      Bộ lọc nâng cao
                    </Button>
                  </Button.Group>
                </div>
              </div>

              {/* Movie Grid */}
              <div className="movie-grid">
                <Row gutter={[16, 24]}>
                  {nowShowingMovies.map((movie) => (
                    <Col xs={12} sm={8} md={6} lg={4} key={movie.id}>
                      <MovieCard movie={movie} />
                    </Col>
                  ))}
                </Row>
              </div>

              {/* Pagination */}
              <div className="pagination-section">
                <div className="pagination-info">
                  <Text>Hiển thị 1-8 của {nowShowingMovies.length} kết quả</Text>
                </div>
                <div className="pagination-controls">
                  <Button.Group>
                    <Button disabled>Trước</Button>
                    <Button type="primary">1</Button>
                    <Button>2</Button>
                    <Button>3</Button>
                    <Button>Sau</Button>
                  </Button.Group>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Content>
  )
}

export default NowShowing
