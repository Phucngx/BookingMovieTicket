package com.ngp.MovieService.Mapper;

import com.ngp.MovieService.DTO.Request.GenreRequest;
import com.ngp.MovieService.DTO.Response.GenreResponse;
import com.ngp.MovieService.Entity.GenreEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.6 (Oracle Corporation)"
)
@Component
public class GenreMapperImpl implements GenreMapper {

    @Override
    public GenreEntity toGenre(GenreRequest request) {
        if ( request == null ) {
            return null;
        }

        GenreEntity.GenreEntityBuilder<?, ?> genreEntity = GenreEntity.builder();

        genreEntity.genreName( request.getGenreName() );
        genreEntity.description( request.getDescription() );

        return genreEntity.build();
    }

    @Override
    public GenreResponse toGenreResponse(GenreEntity genre) {
        if ( genre == null ) {
            return null;
        }

        GenreResponse.GenreResponseBuilder genreResponse = GenreResponse.builder();

        genreResponse.genreId( genre.getGenreId() );
        genreResponse.genreName( genre.getGenreName() );
        genreResponse.description( genre.getDescription() );
        genreResponse.createdAt( genre.getCreatedAt() );

        return genreResponse.build();
    }

    @Override
    public void updateGenre(GenreEntity genre, GenreRequest request) {
        if ( request == null ) {
            return;
        }

        if ( request.getGenreName() != null ) {
            genre.setGenreName( request.getGenreName() );
        }
        if ( request.getDescription() != null ) {
            genre.setDescription( request.getDescription() );
        }
    }
}
