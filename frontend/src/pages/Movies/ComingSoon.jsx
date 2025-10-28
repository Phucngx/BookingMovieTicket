import React, { useEffect } from 'react'
import { Layout, Typography, Row, Col, Card, Pagination, Spin, Empty, Tag, Space, Button } from 'antd'
import { CalendarOutlined, ClockCircleOutlined, StarOutlined, PlayCircleOutlined, RocketOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchComingSoonMovies } from '../../store/slices/comingSoonSlice'

const { Content } = Layout
const { Title, Text } = Typography

const ComingSoon = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { movies, loading, error, pagination } = useSelector(state => state.comingSoon)

  useEffect(() => {
    dispatch(fetchComingSoonMovies({ page: 1, size: 10 }))
  }, [dispatch])

  const onPageChange = (page, pageSize) => {
    dispatch(fetchComingSoonMovies({ page, size: pageSize }))
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
    <Content className="movies-content" style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Header Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
          borderRadius: '12px', 
          padding: '40px 24px', 
          marginBottom: '32px',
          color: 'white',
          textAlign: 'center'
        }}>
          <Title level={1} style={{ color: 'white', marginBottom: '16px' }}>
            🚀 Phim sắp chiếu
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
            Những bộ phim hấp dẫn sắp ra mắt tại rạp
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
            description="Không có phim sắp chiếu" 
            style={{ padding: '60px' }}
          />
        ) : (
          <>
            <Row gutter={[24, 24]}>
              {movies.map(movie => (
                <Col xs={24} sm={12} md={8} lg={6} key={movie.id}>
                  <Card
                    hoverable
                    style={{ 
                      borderRadius: '12px', 
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    bodyStyle={{ padding: '16px' }}
                    cover={
                      <div style={{ position: 'relative', overflow: 'hidden' }}>
                        <img 
                          alt={movie.title} 
                          src={movie.posterUrl} 
                          style={{ 
                            height: '320px', 
                            width: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                          }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x320/cccccc/666666?text=No+Image'
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          <RocketOutlined /> SẮP CHIẾU
                        </div>
                        <div style={{
                          position: 'absolute',
                          bottom: '12px',
                          right: '12px',
                          background: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          <ClockCircleOutlined /> {formatDuration(movie.durationMinutes)}
                        </div>
                      </div>
                    }
                    actions={[
                      <Button 
                        type="primary" 
                        icon={<PlayCircleOutlined />}
                        onClick={() => handleMovieClick(movie.id)}
                        style={{ width: '100%' }}
                      >
                        Xem chi tiết
                      </Button>
                    ]}
                  >
                    <div>
                      <Title level={4} style={{ 
                        marginBottom: '12px', 
                        fontSize: '16px',
                        lineHeight: '1.4',
                        height: '44px',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {movie.title}
                      </Title>
                      
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CalendarOutlined style={{ color: '#ff6b6b' }} />
                          <Text type="secondary">{formatDate(movie.releaseDate)}</Text>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Text type="secondary">{movie.language}</Text>
                          <Text type="secondary">•</Text>
                          <Text type="secondary">{movie.country}</Text>
                        </div>
                        
                        {movie.genres && movie.genres.length > 0 && (
                          <div style={{ marginTop: '8px' }}>
                            <Space wrap size="small">
                              {movie.genres.slice(0, 2).map(genre => (
                                <Tag key={genre.genreId} color="orange" style={{ fontSize: '11px' }}>
                                  {genre.genreName}
                                </Tag>
                              ))}
                              {movie.genres.length > 2 && (
                                <Tag color="default" style={{ fontSize: '11px' }}>
                                  +{movie.genres.length - 2}
                                </Tag>
                              )}
                            </Space>
                          </div>
                        )}
                      </Space>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginTop: '40px',
              padding: '24px',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={onPageChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) => 
                  `${range[0]}-${range[1]} của ${total} phim`
                }
                pageSizeOptions={['10', '20', '30']}
                style={{ textAlign: 'center' }}
              />
            </div>
          </>
        )}
      </div>
    </Content>
  )
}

export default ComingSoon


