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
    <Col xs={24} sm={12} md={8} lg={6} xl={6} key={movie.id}>
      <div className="ms-card" onClick={() => handleMovieClick(movie.id)}>
        <div className="ms-thumb">
          <img src={movie.posterUrl} alt={movie.title} className="ms-thumb-img" />
          <div className="ms-thumb-overlay">
            <Button type="primary" size="middle" className="ms-detail-btn">Xem chi tiết</Button>
          </div>
        </div>
        <div className="ms-body">
          <div className="ms-title" title={movie.title}>{movie.title}</div>
          <div className="ms-meta">
            <span className="ms-meta-item"><CalendarOutlined /> {formatDate(movie.releaseDate)}</span>
            <span className="ms-meta-item"><ClockCircleOutlined /> {movie.durationMinutes} phút</span>
            {movie.director?.name && (
              <span className="ms-meta-item"><UserOutlined /> {movie.director.name}</span>
            )}
          </div>
          <div className="ms-tags">
            {movie.genres?.slice(0, 3).map(g => (
              <span className="ms-tag" key={g.genreId}>{g.genreName}</span>
            ))}
            {movie.genres?.length > 3 && (
              <span className="ms-tag more">+{movie.genres.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </Col>
  )

  return (
    <div className="ms-page">
      <div className="ms-container">
        <div className="ms-header">
          <div className="ms-header-left">
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} className="ms-back">Quay lại</Button>
            <div className="ms-heading">
              <div className="ms-title-text">Kết quả tìm kiếm</div>
              {searchQuery && (
                <div className="ms-subtitle">Tìm kiếm cho: <span className="ms-highlight">{searchQuery}</span></div>
              )}
            </div>
          </div>
          {/* <div className="ms-searchbar">
            <Search
              placeholder="Tìm kiếm phim..."
              enterButton={<SearchOutlined />}
              onSearch={handleNewSearch}
              defaultValue={searchQuery}
              className="ms-input"
              allowClear
            />
          </div> */}
        </div>

        <div className="ms-results">
          {loading ? (
            <div className="ms-loading">
              <Spin size="large" />
              <div className="ms-loading-text">Đang tìm kiếm phim...</div>
            </div>
          ) : error ? (
            <Alert message="Không có phim bạn tìm" type="error" showIcon style={{ marginBottom: 24 }} />
          ) : movies.length === 0 ? (
            <div className="ms-empty">
              <div className="ms-empty-title">Không tìm thấy phim nào</div>
              <div className="ms-empty-sub">Hãy thử tìm kiếm với từ khóa khác</div>
            </div>
          ) : (
            <>
              <div className="ms-summary">
                Tìm thấy <span className="ms-highlight">{totalElements}</span> phim{totalPages > 1 && (
                  <span className="ms-dim"> - Trang {currentPage}/{totalPages}</span>
                )}
              </div>

              <Row gutter={[16, 16]} className="ms-grid">
                {movies.map(renderMovieCard)}
              </Row>

              {totalPages > 1 && (
                <div className="ms-pagination">
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
