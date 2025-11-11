import React, { useEffect } from 'react'
import { Layout, Typography, Row, Col, Card, Pagination, Spin, Empty, Tag, Space, Button } from 'antd'
import { CalendarOutlined, ClockCircleOutlined, StarOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchNowShowingMovies } from '../../store/slices/nowShowingSlice'

const { Content } = Layout
const { Title, Text } = Typography

const NowShowing = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { movies, loading, error, pagination } = useSelector(state => state.nowShowing)

  useEffect(() => {
    dispatch(fetchNowShowingMovies({ page: 1, size: 12 }))
  }, [dispatch])

  const onPageChange = (page, pageSize) => {
    dispatch(fetchNowShowingMovies({ page, size: pageSize }))
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật'
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatDuration = (minutes) => {
    if (!minutes) return 'Chưa cập nhật'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const handleMovieClick = (movieId) => {
    navigate(`/phim/${movieId}`)
  }

  return (
    <Content className="movies-content" style={{ background: '#f6f7fb' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
        {/* Header Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          borderRadius: '12px', 
          padding: '24px 16px', 
          marginBottom: '16px',
          color: 'white',
          textAlign: 'center'
        }}>
          <Title level={2} style={{ color: 'white', marginBottom: '8px' }}>
            🎬 Phim đang chiếu
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px' }}>
            Khám phá những bộ phim hay nhất đang được chiếu tại rạp
          </Text>
      </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>
              <Text>Đang tải danh sách phim...</Text>
            </div>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <Text type="danger" style={{ fontSize: '16px' }}>{error}</Text>
          </div>
        ) : movies.length === 0 ? (
          <Empty 
            description="Không có phim đang chiếu" 
            style={{ padding: '60px' }}
          />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {movies.map(movie => (
                <Col xs={12} sm={12} md={8} lg={6} xl={4} key={movie.id}>
                  <Card
                    hoverable
                    style={{ 
                      borderRadius: '12px', 
                      overflow: 'hidden',
                      boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                      transition: 'all 0.25s ease'
                    }}
                    bodyStyle={{ padding: '12px' }}
                    cover={
                      <div style={{ position: 'relative', overflow: 'hidden' }}>
                        <img 
                          alt={movie.title} 
                          src={movie.posterUrl} 
                          style={{ 
                            height: '240px', 
                            width: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.25s ease'
                          }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x320/cccccc/666666?text=No+Image'
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 'bold'
                        }}>
                          ĐANG CHIẾU
                        </div>
                        <div style={{
                          position: 'absolute',
                          bottom: '12px',
                          right: '12px',
                          background: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px'
                        }}>
                          <ClockCircleOutlined /> {formatDuration(movie.durationMinutes)}
                    </div>
                      </div>
                    }
                  >
                    <div>
                      <Title level={5} style={{ 
                        marginBottom: '8px', 
                        fontSize: '14px',
                        lineHeight: '1.35',
                        height: '38px',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {movie.title}
                      </Title>
                      
                      <Space direction="vertical" size={6} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CalendarOutlined style={{ color: '#1890ff' }} />
                          <Text type="secondary" style={{ fontSize: 12 }}>{formatDate(movie.releaseDate)}</Text>
                        </div>
                        {movie.genres && movie.genres.length > 0 && (
                          <div>
                            <Space wrap size={4}>
                              {movie.genres.slice(0, 2).map(genre => (
                                <Tag key={genre.genreId} color="blue" style={{ fontSize: 11 }}>
                                  {genre.genreName}
                                </Tag>
                              ))}
                            </Space>
                          </div>
                        )}
                        <Button 
                          type="primary" 
                          icon={<PlayCircleOutlined />}
                          onClick={() => handleMovieClick(movie.id)}
                          size="middle"
                          block
                        >
                          Xem chi tiết
                        </Button>
                      </Space>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, padding: 12, background: 'white', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={onPageChange}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => 
                  `${range[0]}-${range[1]} của ${total} phim`
                }
                style={{ textAlign: 'center' }}
              />
            </div>
          </>
        )}
      </div>
    </Content>
  )
}

export default NowShowing
