import React from 'react';
import { Button } from 'antd';
import { LikeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const {
    title,
    poster,
    rating,
    date,
    isEarlyShow,
    isComingSoon
  } = movie;

  const handleMovieClick = () => {
    navigate(`/phim/${movie.id}`);
  };

  const handleBookTicket = (e) => {
    e.stopPropagation();
    navigate(`/phim/${movie.id}`);
  };

  return (
    <div className="movie-card" onClick={handleMovieClick}>
      <div className="movie-poster-container">
        <img 
          alt={title} 
          src={poster || 'https://via.placeholder.com/160x240/1f1f1f/ffffff?text=Movie'} 
          className="movie-poster"
        />
        
        {/* Tags cho phim */}
        {isEarlyShow && (
          <div className="movie-badge badge-early-show">
            CHIẾU SỚM
          </div>
        )}
        {isComingSoon && (
          <div className="movie-badge badge-coming-soon">
            SẮP CHIẾU
          </div>
        )}
      </div>
      
      {/* Nút Mua vé */}
      <Button 
        type="primary" 
        className="book-button"
        size="small"
        block
        danger
        onClick={handleBookTicket}
      >
        Mua vé
      </Button>
      
      {/* Tên phim */}
      <h4 className="movie-title">{title}</h4>
      
      {/* Thông tin phim */}
      <div className="movie-meta">
        {date && <span className="movie-date">{date}</span>}
        {rating && (
          <span className="movie-rating">
            <LikeOutlined className="rating-icon" />
            {rating}%
          </span>
        )}
      </div>
      
      {/* Thông tin bổ sung */}
      <div className="movie-extra-info">
        {movie.genre && (
          <span className="movie-genre">{movie.genre}</span>
        )}
        {movie.language && (
          <span className="movie-language">{movie.language === 'vietnamese' ? 'VN' : movie.language === 'japanese' ? 'JP' : movie.language === 'english' ? 'EN' : movie.language === 'korean' ? 'KR' : movie.language}</span>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
