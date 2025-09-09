package com.ngp.MovieService.Mapper;

import com.ngp.MovieService.DTO.Request.GenreRequest;
import com.ngp.MovieService.DTO.Response.GenreResponse;
import com.ngp.MovieService.Entity.GenreEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface GenreMapper {
    GenreEntity toGenre(GenreRequest request);
    GenreResponse toGenreResponse(GenreEntity genre);
    void updateGenre(@MappingTarget GenreEntity genre, GenreRequest request);
}
