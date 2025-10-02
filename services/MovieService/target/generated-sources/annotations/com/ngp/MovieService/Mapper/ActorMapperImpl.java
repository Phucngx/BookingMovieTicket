package com.ngp.MovieService.Mapper;

import com.ngp.MovieService.DTO.Request.ActorRequest;
import com.ngp.MovieService.DTO.Response.ActorResponse;
import com.ngp.MovieService.Entity.ActorEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.6 (Oracle Corporation)"
)
@Component
public class ActorMapperImpl implements ActorMapper {

    @Override
    public ActorEntity toActor(ActorRequest request) {
        if ( request == null ) {
            return null;
        }

        ActorEntity.ActorEntityBuilder<?, ?> actorEntity = ActorEntity.builder();

        actorEntity.name( request.getName() );
        actorEntity.birthDate( request.getBirthDate() );
        actorEntity.nationality( request.getNationality() );

        return actorEntity.build();
    }

    @Override
    public ActorResponse toActorResponse(ActorEntity actor) {
        if ( actor == null ) {
            return null;
        }

        ActorResponse.ActorResponseBuilder actorResponse = ActorResponse.builder();

        actorResponse.actorId( actor.getActorId() );
        actorResponse.name( actor.getName() );
        actorResponse.nationality( actor.getNationality() );
        actorResponse.birthDate( actor.getBirthDate() );
        actorResponse.createdAt( actor.getCreatedAt() );

        return actorResponse.build();
    }

    @Override
    public void updateActor(ActorEntity actor, ActorRequest request) {
        if ( request == null ) {
            return;
        }

        if ( request.getName() != null ) {
            actor.setName( request.getName() );
        }
        if ( request.getBirthDate() != null ) {
            actor.setBirthDate( request.getBirthDate() );
        }
        if ( request.getNationality() != null ) {
            actor.setNationality( request.getNationality() );
        }
    }
}
