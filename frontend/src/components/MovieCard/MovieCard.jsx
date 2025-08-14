import React from 'react';
import { Button, Tag } from 'antd';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const {
    title,
    poster,
    rating,
    date,
    isEarlyShow,
    isComingSoon
  } = movie;

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img 
          alt={title} 
          src={poster || 'https://via.placeholder.com/200x300/1f1f1f/ffffff?text=Movie'} 
          className="poster-image"
        />
        
        {/* Tags cho phim */}
        {isEarlyShow && (
          <div className="movie-tag early-show">
            CHIẾU SỚM
          </div>
        )}
        {isComingSoon && (
          <div className="movie-tag coming-soon">
            SẮP CHIẾU
          </div>
        )}
      </div>
      
      {/* Nút Mua vé */}
      <Button 
        type="primary" 
        className="buy-ticket-btn"
        size="large"
        block
      >
        Mua vé
      </Button>
      
      {/* Tên phim */}
      <h4 className="movie-title">{title}</h4>
      
      {/* Thông tin phim */}
      <div className="movie-info">
        {date && <span className="movie-date">{date}</span>}
        {rating && <span className="movie-rating">{rating}%</span>}
      </div>
    </div>
  );
};

export default MovieCard;
