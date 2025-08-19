import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Typography } from 'antd'
import MovieCard from '../MovieCard/MovieCard'
import './MovieSection.css'

const { Title } = Typography

const MovieSection = () => {
  const { movies } = useSelector((state) => state.movies)
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

  return (
    <div className="movie-section">
      <div className="container">
        <Title level={2} className="section-title">
          Mua vé theo phim
        </Title>
        
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
          
          {/* Pagination dots */}
          <div className="carousel-dots">
            {Array.from({ length: calculateDots() }, (_, index) => (
              <div
                key={index}
                className={`dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => scrollToSlide(index)}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieSection
