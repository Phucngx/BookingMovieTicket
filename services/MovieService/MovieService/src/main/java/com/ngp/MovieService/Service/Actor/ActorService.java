package com.ngp.MovieService.Service.Actor;

import com.ngp.MovieService.DTO.Request.ActorRequest;
import com.ngp.MovieService.DTO.Response.ActorResponse;
import com.ngp.MovieService.Entity.ActorEntity;
import com.ngp.MovieService.Exception.AppException;
import com.ngp.MovieService.Exception.ErrorCode;
import com.ngp.MovieService.Mapper.ActorMapper;
import com.ngp.MovieService.Repository.ActorRepository;
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
public class ActorService implements IActorService{
    ActorRepository actorRepository;
    ActorMapper actorMapper;

    @Override
    public ActorResponse addActor(ActorRequest request) {
        if (actorRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.EXISTS);
        }
        ActorEntity actor = actorMapper.toActor(request);
        return actorMapper.toActorResponse(actorRepository.save(actor));
    }

    @Override
    public ActorResponse updateActor(Long actorId, ActorRequest request) {
        ActorEntity actor = actorRepository.findById(actorId)
                .orElseThrow(() -> new AppException(ErrorCode.ACTOR_NOT_FOUND));
        actorMapper.updateActor(actor, request);
        return actorMapper.toActorResponse(actorRepository.save(actor));
    }

    @Override
    public void deleteActor(Long actorId) {
        if (!actorRepository.existsById(actorId)) {
            throw new AppException(ErrorCode.ACTOR_NOT_FOUND);
        }
        actorRepository.deleteById(actorId);
    }

    @Override
    public ActorResponse getActorById(Long actorId) {
        ActorEntity actor = actorRepository.findById(actorId)
                .orElseThrow(() -> new AppException(ErrorCode.ACTOR_NOT_FOUND));
        return actorMapper.toActorResponse(actor);
    }

    @Override
    public Page<ActorResponse> getAllActors(int page, int size) {
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<ActorEntity> actorPage = actorRepository.findAll(pageable);
        return actorPage.map(actorMapper::toActorResponse);
    }
}
