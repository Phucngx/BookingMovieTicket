package com.ngp.MovieService.Mapper;

import com.ngp.MovieService.DTO.Request.MovieRequest;
import com.ngp.MovieService.DTO.Response.MovieResponse;
import com.ngp.MovieService.Entity.MovieEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface MovieMapper {
    @Mapping(target = "genres", ignore = true)
    @Mapping(target = "actors", ignore = true)
    @Mapping(target = "director", ignore = true)
    MovieEntity toMovie(MovieRequest request);

    @Mapping(target = "genres", ignore = true)
    @Mapping(target = "actors", ignore = true)
    @Mapping(target = "director", ignore = true)
    void updateMovie(@MappingTarget MovieEntity movie, MovieRequest request);

    @Mapping(source = "movieId", target = "id")
    MovieResponse toMovieResponse(MovieEntity movie);
}
