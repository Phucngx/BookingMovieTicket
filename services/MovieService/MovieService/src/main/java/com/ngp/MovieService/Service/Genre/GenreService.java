package com.ngp.MovieService.Service.Genre;

import com.ngp.MovieService.DTO.Request.GenreRequest;
import com.ngp.MovieService.DTO.Response.GenreResponse;
import com.ngp.MovieService.Entity.GenreEntity;
import com.ngp.MovieService.Exception.AppException;
import com.ngp.MovieService.Exception.ErrorCode;
import com.ngp.MovieService.Mapper.GenreMapper;
import com.ngp.MovieService.Repository.GenreRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class GenreService implements IGenreService{
    GenreRepository genreRepository;
    GenreMapper genreMapper;

    @Override
    public GenreResponse addGenre(GenreRequest request) {
        if (genreRepository.existsByGenreName(request.getGenreName())) {
            throw new AppException(ErrorCode.EXISTS);
        }
        GenreEntity genre = genreMapper.toGenre(request);
        return genreMapper.toGenreResponse(genreRepository.save(genre));
    }

    @Override
    public GenreResponse updateGenre(Long genreId, GenreRequest request) {
        GenreEntity genre = genreRepository.findById(genreId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        genreMapper.updateGenre(genre, request);
        return genreMapper.toGenreResponse(genreRepository.save(genre));
    }

    @Override
    public void deleteGenre(Long genreId) {
        if(!genreRepository.existsById(genreId)) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        genreRepository.deleteById(genreId);
    }

    @Override
    public GenreResponse getGenreById(Long genreId) {
        GenreEntity genre = genreRepository.findById(genreId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        return genreMapper.toGenreResponse(genre);
    }

    @Override
    public Page<GenreResponse> getAllGenres(int page, int size) {
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<GenreEntity> genrePage = genreRepository.findAll(pageable);
        return genrePage.map(genreMapper::toGenreResponse);
    }
}
