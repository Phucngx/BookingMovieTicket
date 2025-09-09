package com.ngp.MovieService.Mapper;

import com.ngp.MovieService.DTO.Request.DirectorRequest;
import com.ngp.MovieService.DTO.Request.GenreRequest;
import com.ngp.MovieService.DTO.Response.DirectorResponse;
import com.ngp.MovieService.DTO.Response.GenreResponse;
import com.ngp.MovieService.Entity.DirectorEntity;
import com.ngp.MovieService.Entity.GenreEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface DirectorMapper {
    DirectorEntity toDirector(DirectorRequest request);
    DirectorResponse toDirectorResponse(DirectorEntity director);
    void updateDirector(@MappingTarget DirectorEntity director, DirectorRequest request);
}
