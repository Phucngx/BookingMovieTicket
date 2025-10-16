import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  Card, 
  Row, 
  Col, 
  Image, 
  Typography, 
  Tag, 
  Space, 
  Pagination, 
  Spin, 
  Alert,
  Button,
  Input
} from 'antd'
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  UserOutlined, 
  SearchOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons'
import { movieService } from '../../services/movieService'
import './MovieSearch.css'

const { Title, Text } = Typography
const { Search } = Input

const MovieSearch = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [pageSize] = useState(12)

  // Lấy search query từ URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const query = urlParams.get('q')
    if (query) {
      setSearchQuery(query)
      handleSearch(query, 1)
    }
  }, [location.search])

  const handleSearch = async (query, page = 1) => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      const result = await movieService.searchMovies(query, page, pageSize)
      
      if (result.success) {
        setMovies(result.data.content)
        setTotalPages(result.data.totalPages)
        setTotalElements(result.data.totalElements)
        setCurrentPage(page)
      } else {
        setError(result.error)
        setMovies([])
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tìm kiếm phim')
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    handleSearch(searchQuery, page)
  }

  const handleNewSearch = (value) => {
    if (value.trim()) {
      navigate(`/tim-kiem?q=${encodeURIComponent(value.trim())}`)
    }
  }

  const handleMovieClick = (movieId) => {
    navigate(`/phim/${movieId}`)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const renderMovieCard = (movie) => (
    <Col xs={24} sm={12} md={8} lg={6} xl={4} key={movie.id}>
      <Card
        hoverable
        className="movie-search-card"
        cover={
          <div className="movie-poster-container">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              className="movie-poster"
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            />
            <div className="movie-overlay">
              <Button 
                type="primary" 
                size="large"
                onClick={() => handleMovieClick(movie.id)}
                className="view-detail-btn"
              >
                Xem chi tiết
              </Button>
            </div>
          </div>
        }
        onClick={() => handleMovieClick(movie.id)}
      >
        <Card.Meta
          title={
            <Title level={5} className="movie-title" ellipsis={{ rows: 2 }}>
              {movie.title}
            </Title>
          }
          description={
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <div className="movie-info">
                <Space size={4}>
                  <CalendarOutlined style={{ color: '#1890ff' }} />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {formatDate(movie.releaseDate)}
                  </Text>
                </Space>
              </div>
              
              <div className="movie-info">
                <Space size={4}>
                  <ClockCircleOutlined style={{ color: '#52c41a' }} />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {movie.durationMinutes} phút
                  </Text>
                </Space>
              </div>

              <div className="movie-info">
                <Space size={4}>
                  <UserOutlined style={{ color: '#fa8c16' }} />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {movie.director?.name}
                  </Text>
                </Space>
              </div>

              <div className="movie-genres">
                {movie.genres?.slice(0, 2).map(genre => (
                  <Tag key={genre.genreId} color="blue" size="small">
                    {genre.genreName}
                  </Tag>
                ))}
                {movie.genres?.length > 2 && (
                  <Tag color="default" size="small">
                    +{movie.genres.length - 2}
                  </Tag>
                )}
              </div>
            </Space>
          }
        />
      </Card>
    </Col>
  )

  return (
    <div className="movie-search-page">
      <div className="search-container">
        {/* Header */}
        <div className="search-header">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)}
            className="back-btn"
          >
            Quay lại
          </Button>
          
          <div className="search-title">
            <Title level={2} style={{ margin: 0 }}>
              Kết quả tìm kiếm
            </Title>
            {searchQuery && (
              <Text type="secondary" style={{ fontSize: 14 }}>
                Tìm kiếm cho: "<Text strong style={{ color: '#1890ff' }}>{searchQuery}</Text>"
              </Text>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {/* <div className="search-bar-container">
          <Search
            placeholder="Tìm kiếm phim..."
            size="large"
            enterButton={<SearchOutlined />}
            onSearch={handleNewSearch}
            defaultValue={searchQuery}
            className="search-input"
          />
        </div> */}

        {/* Results */}
        <div className="search-results">
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
              <Text style={{ marginTop: 16, display: 'block' }}>
                Đang tìm kiếm phim...
              </Text>
            </div>
          ) : error ? (
            <Alert
              message="Lỗi tìm kiếm"
              description={error}
              type="error"
              showIcon
              style={{ marginBottom: 24 }}
            />
          ) : movies.length === 0 ? (
            <div className="no-results">
              <Title level={4} type="secondary">
                Không tìm thấy phim nào
              </Title>
              <Text type="secondary">
                Hãy thử tìm kiếm với từ khóa khác
              </Text>
            </div>
          ) : (
            <>
              <div className="results-info">
                <Text style={{ fontSize: 14 }}>
                  Tìm thấy <Text strong style={{ color: '#1890ff' }}>{totalElements}</Text> phim
                  {totalPages > 1 && (
                    <span style={{ color: '#666' }}> - Trang {currentPage}/{totalPages}</span>
                  )}
                </Text>
              </div>

              <Row gutter={[16, 16]} className="movies-grid">
                {movies.map(renderMovieCard)}
              </Row>

              {totalPages > 1 && (
                <div className="pagination-container">
                  <Pagination
                    current={currentPage}
                    total={totalElements}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} của ${total} phim`
                    }
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieSearch
