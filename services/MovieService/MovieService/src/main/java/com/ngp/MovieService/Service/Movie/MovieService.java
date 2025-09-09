package com.ngp.MovieService.Service.Movie;

import com.ngp.MovieService.DTO.Request.MovieRequest;
import com.ngp.MovieService.DTO.Response.MovieBriefResponse;
import com.ngp.MovieService.DTO.Response.MovieLiteResponse;
import com.ngp.MovieService.DTO.Response.MovieResponse;
import com.ngp.MovieService.Entity.ActorEntity;
import com.ngp.MovieService.Entity.DirectorEntity;
import com.ngp.MovieService.Entity.GenreEntity;
import com.ngp.MovieService.Entity.MovieEntity;
import com.ngp.MovieService.Exception.AppException;
import com.ngp.MovieService.Exception.ErrorCode;
import com.ngp.MovieService.Mapper.MovieMapper;
import com.ngp.MovieService.Repository.ActorRepository;
import com.ngp.MovieService.Repository.DirectorRepository;
import com.ngp.MovieService.Repository.GenreRepository;
import com.ngp.MovieService.Repository.MovieRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class MovieService implements IMovieService{
    MovieRepository movieRepository;
    GenreRepository genreRepository;
    ActorRepository actorRepository;
    DirectorRepository directorRepository;
    MovieMapper movieMapper;

    @Override
    public MovieResponse addMovie(MovieRequest request) {
        if(movieRepository.existsByTitle(request.getTitle())) {
            throw new AppException(ErrorCode.EXISTS);
        }
        MovieEntity movie = movieMapper.toMovie(request);
        DirectorEntity director = null;
        if (request.getDirectorId() != null) {
            director = directorRepository.findById(request.getDirectorId())
                    .orElseThrow(() -> new AppException(ErrorCode.DIRECTOR_NOT_FOUND));
            movie.setDirector(director);
        }
        Set<ActorEntity> actors = new HashSet<>();
        if (request.getActorId() != null) {
            for (Long actorId : request.getActorId()) {
                ActorEntity actor = actorRepository.findById(actorId)
                        .orElseThrow(() -> new AppException(ErrorCode.ACTOR_NOT_FOUND));
                actors.add(actor);
            }
        }
        Set<GenreEntity> genres = new HashSet<>();
        if (request.getGenreId() != null) {
            for (Long genreId : request.getGenreId()) {
                GenreEntity genre = genreRepository.findById(genreId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
                genres.add(genre);
            }
        }
        movie.setGenres(genres);
        movie.setActors(actors);
        movie.setDirector(director);
        return movieMapper.toMovieResponse(movieRepository.save(movie));
    }

    @Override
    public MovieResponse updateMovie(Long movieId, MovieRequest request) {
        MovieEntity movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        movieMapper.updateMovie(movie, request);

        DirectorEntity director = null;
        if (request.getDirectorId() != null) {
            director = directorRepository.findById(request.getDirectorId())
                    .orElseThrow(() -> new AppException(ErrorCode.DIRECTOR_NOT_FOUND));
            movie.setDirector(director);
        }
        Set<ActorEntity> actors = new HashSet<>();
        if (request.getActorId() != null) {
            for (Long actorId : request.getActorId()) {
                ActorEntity actor = actorRepository.findById(actorId)
                        .orElseThrow(() -> new AppException(ErrorCode.ACTOR_NOT_FOUND));
                actors.add(actor);
            }
        }
        Set<GenreEntity> genres = new HashSet<>();
        if (request.getGenreId() != null) {
            for (Long genreId : request.getGenreId()) {
                GenreEntity genre = genreRepository.findById(genreId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
                genres.add(genre);
            }
        }
        movie.setGenres(genres);
        movie.setActors(actors);
        movie.setDirector(director);
        return movieMapper.toMovieResponse(movieRepository.save(movie));
    }

    @Override
    public void deleteMovie(Long movieId) {
        movieRepository.deleteById(movieId);
    }

    @Override
    public MovieResponse getMovieById(Long movieId) {
        MovieEntity movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        return movieMapper.toMovieResponse(movie);
    }

    @Override
    public Page<MovieResponse> getAllMovies(int page, int size) {
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<MovieEntity> moviePage = movieRepository.findAll(pageable);
        return moviePage.map(movieMapper::toMovieResponse);
    }

    @Override
    public MovieBriefResponse getMovieBrief(Long movieId) {
        MovieEntity movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        return MovieBriefResponse.builder()
                .movieId(movie.getMovieId())
                .durationMinutes(movie.getDurationMinutes())
                .title(movie.getTitle())
                .build();
    }

    @Override
    public List<MovieLiteResponse> findAllByMovieIds(List<Long> ids) {
        return movieRepository.findAllById(ids).stream().map(m -> new MovieLiteResponse(
                m.getMovieId(),
                m.getTitle(),
                m.getPosterUrl(),
                m.getTrailerUrl(),
                m.getGenres().stream().map(GenreEntity::getGenreName).toList(),
                m.getRating(),
                m.getDurationMinutes()
        )).toList();
    }
}
