import React from 'react';
import { Button } from 'antd';
import { LikeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const {
    title,
    posterUrl,
    rating,
    releaseDate,
    durationMinutes,
    language,
    country,
    genres
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
          src={posterUrl || 'https://via.placeholder.com/160x240/1f1f1f/ffffff?text=Movie'} 
          className="movie-poster"
        />
        
        {/* Tags cho phim */}
        {new Date(releaseDate) > new Date() && (
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
      <h3 className="movie-title">{title}</h3>
      
      {/* Thông tin phim */}
      <div className="movie-meta">
        {releaseDate && (
          <span className="movie-date">
            {new Date(releaseDate).toLocaleDateString('vi-VN')}
          </span>
        )}
        {durationMinutes && (
          <span className="movie-duration">{durationMinutes} phút</span>
        )}
      </div>
      
      {/* Thông tin bổ sung */}
      <div className="movie-extra-info">
        {genres && genres.length > 0 && (
          <span className="movie-genre">{genres[0].genreName}</span>
        )}
        {language && (
          <span className="movie-language">
            {language === 'Vietnamese' ? 'VN' : 
             language === 'Japanese' ? 'JP' : 
             language === 'English' ? 'EN' : 
             language === 'Korean' ? 'KR' : language}
          </span>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
