import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Typography, Spin, Button } from 'antd'
import { LeftOutlined, RightOutlined, FireOutlined } from '@ant-design/icons'
import MovieCard from '../MovieCard/MovieCard'
import { fetchMovies } from '../../store/slices/movieListSlice'
import './MovieSection.css'

const { Title, Text } = Typography

const MovieSection = () => {
  const dispatch = useDispatch()
  const { movies, loading, error } = useSelector((state) => state.movieList)
  const carouselRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Mouse events for drag
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
    carouselRef.current.style.cursor = 'grabbing'
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 2
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    carouselRef.current.style.cursor = 'grab'
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    carouselRef.current.style.cursor = 'grab'
  }

  // Touch events for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true)
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 2
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Fetch movies when component mounts (for all users)
  useEffect(() => {
    if (movies.length === 0) {
      dispatch(fetchMovies({ page: 1, size: 10 })).catch(error => {
        console.error('Failed to fetch movies:', error)
      })
    }
  }, [dispatch, movies.length])

  // Auto-hide scrollbar on mobile
  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.style.cursor = 'grab'
    }
  }, [])

  // Handle scroll to update current slide
  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft
      const slideWidth = carouselRef.current.offsetWidth
      const newSlide = Math.round(scrollPosition / slideWidth)
      setCurrentSlide(newSlide)
    }
  }

  // Scroll to specific slide
  const scrollToSlide = (slideIndex) => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth
      carouselRef.current.scrollTo({
        left: slideWidth * slideIndex,
        behavior: 'smooth'
      })
    }
  }

  // Calculate number of dots based on visible movies
  const calculateDots = () => {
    const visibleMovies = Math.ceil(carouselRef.current?.offsetWidth / 180) || 1
    const totalDots = Math.ceil(movies.length / visibleMovies)
    return Math.min(totalDots, 5) // Max 5 dots
  }

  if (loading) {
    return (
      <div className="movie-section">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <p style={{ marginTop: '16px' }}>Đang tải danh sách phim...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="movie-section">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'red' }}>Lỗi: {error}</p>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Lỗi khi tải danh sách phim
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Fallback nếu không có movies
  if (!loading && movies.length === 0) {
    return (
      <div className="movie-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Phim đang chiếu
            </Title>
            <div className="community-filter">
              <span className="filter-label">Cộng đồng</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#666' }}>Đang tải danh sách phim...</p>
            <p style={{ color: '#999', fontSize: '14px' }}>
              Vui lòng chờ trong giây lát
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="movie-section">
      <div className="container">
        <div className="section-header">
          <div className="section-title-container">
            <Title level={2} className="section-title">
              <FireOutlined className="title-icon" />
              Phim đang chiếu
            </Title>
            <Text type="secondary" className="section-subtitle">
              Khám phá những bộ phim hay nhất hiện tại
            </Text>
          </div>
          <div className="section-actions">
            <Button 
              type="text" 
              icon={<LeftOutlined />} 
              className="nav-button prev-button"
              onClick={() => scrollToSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
            />
            <Button 
              type="text" 
              icon={<RightOutlined />} 
              className="nav-button next-button"
              onClick={() => scrollToSlide(Math.min(calculateDots() - 1, currentSlide + 1))}
              disabled={currentSlide >= calculateDots() - 1}
            />
          </div>
        </div>
        
        <div className="movie-carousel-container">
          <div 
            className="movie-carousel"
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onScroll={handleScroll}
          >
            {movies.map((movie) => (
              <div key={movie.id} className="movie-slide">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
          
          {/* Enhanced Pagination dots */}
          <div className="carousel-dots-container">
            <div className="carousel-dots">
              {Array.from({ length: calculateDots() }, (_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => scrollToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <span className="dot-indicator"></span>
                </button>
              ))}
            </div>
            <div className="carousel-info">
              <Text type="secondary" className="slide-counter">
                {currentSlide + 1} / {calculateDots()}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieSection
