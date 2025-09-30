package com.ngp.MovieService.Mapper;

import com.ngp.MovieService.DTO.Request.MovieRequest;
import com.ngp.MovieService.DTO.Response.ActorResponse;
import com.ngp.MovieService.DTO.Response.DirectorResponse;
import com.ngp.MovieService.DTO.Response.GenreResponse;
import com.ngp.MovieService.DTO.Response.MovieResponse;
import com.ngp.MovieService.Entity.ActorEntity;
import com.ngp.MovieService.Entity.DirectorEntity;
import com.ngp.MovieService.Entity.GenreEntity;
import com.ngp.MovieService.Entity.MovieEntity;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.6 (Oracle Corporation)"
)
@Component
public class MovieMapperImpl implements MovieMapper {

    @Override
    public MovieEntity toMovie(MovieRequest request) {
        if ( request == null ) {
            return null;
        }

        MovieEntity.MovieEntityBuilder<?, ?> movieEntity = MovieEntity.builder();

        movieEntity.title( request.getTitle() );
        movieEntity.description( request.getDescription() );
        movieEntity.releaseDate( request.getReleaseDate() );
        movieEntity.language( request.getLanguage() );
        movieEntity.country( request.getCountry() );
        movieEntity.durationMinutes( request.getDurationMinutes() );
        movieEntity.posterUrl( request.getPosterUrl() );

        return movieEntity.build();
    }

    @Override
    public void updateMovie(MovieEntity movie, MovieRequest request) {
        if ( request == null ) {
            return;
        }

        if ( request.getTitle() != null ) {
            movie.setTitle( request.getTitle() );
        }
        if ( request.getDescription() != null ) {
            movie.setDescription( request.getDescription() );
        }
        if ( request.getReleaseDate() != null ) {
            movie.setReleaseDate( request.getReleaseDate() );
        }
        if ( request.getLanguage() != null ) {
            movie.setLanguage( request.getLanguage() );
        }
        if ( request.getCountry() != null ) {
            movie.setCountry( request.getCountry() );
        }
        if ( request.getDurationMinutes() != null ) {
            movie.setDurationMinutes( request.getDurationMinutes() );
        }
        if ( request.getPosterUrl() != null ) {
            movie.setPosterUrl( request.getPosterUrl() );
        }
    }

    @Override
    public MovieResponse toMovieResponse(MovieEntity movie) {
        if ( movie == null ) {
            return null;
        }

        MovieResponse.MovieResponseBuilder movieResponse = MovieResponse.builder();

        movieResponse.id( movie.getMovieId() );
        movieResponse.title( movie.getTitle() );
        movieResponse.description( movie.getDescription() );
        movieResponse.releaseDate( movie.getReleaseDate() );
        movieResponse.rating( movie.getRating() );
        movieResponse.durationMinutes( movie.getDurationMinutes() );
        movieResponse.language( movie.getLanguage() );
        movieResponse.country( movie.getCountry() );
        movieResponse.genres( genreEntitySetToGenreResponseSet( movie.getGenres() ) );
        movieResponse.director( directorEntityToDirectorResponse( movie.getDirector() ) );
        movieResponse.actors( actorEntitySetToActorResponseSet( movie.getActors() ) );

        return movieResponse.build();
    }

    protected GenreResponse genreEntityToGenreResponse(GenreEntity genreEntity) {
        if ( genreEntity == null ) {
            return null;
        }

        GenreResponse.GenreResponseBuilder genreResponse = GenreResponse.builder();

        genreResponse.genreId( genreEntity.getGenreId() );
        genreResponse.genreName( genreEntity.getGenreName() );
        genreResponse.description( genreEntity.getDescription() );
        genreResponse.createdAt( genreEntity.getCreatedAt() );

        return genreResponse.build();
    }

    protected Set<GenreResponse> genreEntitySetToGenreResponseSet(Set<GenreEntity> set) {
        if ( set == null ) {
            return null;
        }

        Set<GenreResponse> set1 = new LinkedHashSet<GenreResponse>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( GenreEntity genreEntity : set ) {
            set1.add( genreEntityToGenreResponse( genreEntity ) );
        }

        return set1;
    }

    protected DirectorResponse directorEntityToDirectorResponse(DirectorEntity directorEntity) {
        if ( directorEntity == null ) {
            return null;
        }

        DirectorResponse.DirectorResponseBuilder directorResponse = DirectorResponse.builder();

        if ( directorEntity.getDirectorId() != null ) {
            directorResponse.directorId( String.valueOf( directorEntity.getDirectorId() ) );
        }
        directorResponse.name( directorEntity.getName() );
        directorResponse.nationality( directorEntity.getNationality() );
        directorResponse.birthDate( directorEntity.getBirthDate() );
        directorResponse.createdAt( directorEntity.getCreatedAt() );

        return directorResponse.build();
    }

    protected ActorResponse actorEntityToActorResponse(ActorEntity actorEntity) {
        if ( actorEntity == null ) {
            return null;
        }

        ActorResponse.ActorResponseBuilder actorResponse = ActorResponse.builder();

        actorResponse.actorId( actorEntity.getActorId() );
        actorResponse.name( actorEntity.getName() );
        actorResponse.nationality( actorEntity.getNationality() );
        actorResponse.birthDate( actorEntity.getBirthDate() );
        actorResponse.createdAt( actorEntity.getCreatedAt() );

        return actorResponse.build();
    }

    protected Set<ActorResponse> actorEntitySetToActorResponseSet(Set<ActorEntity> set) {
        if ( set == null ) {
            return null;
        }

        Set<ActorResponse> set1 = new LinkedHashSet<ActorResponse>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( ActorEntity actorEntity : set ) {
            set1.add( actorEntityToActorResponse( actorEntity ) );
        }

        return set1;
    }
}
