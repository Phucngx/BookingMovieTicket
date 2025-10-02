package com.ngp.MovieService.Service.Actor;

import com.ngp.MovieService.DTO.Request.ActorRequest;
import com.ngp.MovieService.DTO.Response.ActorResponse;
import org.springframework.data.domain.Page;

public interface IActorService {
    ActorResponse addActor(ActorRequest request);
    ActorResponse updateActor(Long actorId, ActorRequest request);
    void deleteActor(Long actorId);
    ActorResponse getActorById(Long actorId);
    Page<ActorResponse> getAllActors(int page, int size);
}
