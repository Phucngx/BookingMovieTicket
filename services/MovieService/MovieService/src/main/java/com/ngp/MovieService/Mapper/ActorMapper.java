package com.ngp.MovieService.Mapper;

import com.ngp.MovieService.DTO.Request.ActorRequest;
import com.ngp.MovieService.DTO.Request.DirectorRequest;
import com.ngp.MovieService.DTO.Response.ActorResponse;
import com.ngp.MovieService.DTO.Response.DirectorResponse;
import com.ngp.MovieService.Entity.ActorEntity;
import com.ngp.MovieService.Entity.DirectorEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ActorMapper {
    ActorEntity toActor(ActorRequest request);
    ActorResponse toActorResponse(ActorEntity actor);
    void updateActor(@MappingTarget ActorEntity actor, ActorRequest request);
}
