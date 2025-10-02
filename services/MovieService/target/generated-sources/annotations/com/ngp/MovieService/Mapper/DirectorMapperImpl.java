package com.ngp.MovieService.Mapper;

import com.ngp.MovieService.DTO.Request.DirectorRequest;
import com.ngp.MovieService.DTO.Response.DirectorResponse;
import com.ngp.MovieService.Entity.DirectorEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.6 (Oracle Corporation)"
)
@Component
public class DirectorMapperImpl implements DirectorMapper {

    @Override
    public DirectorEntity toDirector(DirectorRequest request) {
        if ( request == null ) {
            return null;
        }

        DirectorEntity.DirectorEntityBuilder<?, ?> directorEntity = DirectorEntity.builder();

        directorEntity.name( request.getName() );
        directorEntity.birthDate( request.getBirthDate() );
        directorEntity.nationality( request.getNationality() );

        return directorEntity.build();
    }

    @Override
    public DirectorResponse toDirectorResponse(DirectorEntity director) {
        if ( director == null ) {
            return null;
        }

        DirectorResponse.DirectorResponseBuilder directorResponse = DirectorResponse.builder();

        if ( director.getDirectorId() != null ) {
            directorResponse.directorId( String.valueOf( director.getDirectorId() ) );
        }
        directorResponse.name( director.getName() );
        directorResponse.nationality( director.getNationality() );
        directorResponse.birthDate( director.getBirthDate() );
        directorResponse.createdAt( director.getCreatedAt() );

        return directorResponse.build();
    }

    @Override
    public void updateDirector(DirectorEntity director, DirectorRequest request) {
        if ( request == null ) {
            return;
        }

        if ( request.getName() != null ) {
            director.setName( request.getName() );
        }
        if ( request.getBirthDate() != null ) {
            director.setBirthDate( request.getBirthDate() );
        }
        if ( request.getNationality() != null ) {
            director.setNationality( request.getNationality() );
        }
    }
}
