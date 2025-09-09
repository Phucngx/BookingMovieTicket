package com.ngp.ApiGateway.Service;

import com.ngp.ApiGateway.DTO.Request.IntrospectRequest;
import com.ngp.ApiGateway.DTO.Response.ApiResponse;
import com.ngp.ApiGateway.DTO.Response.IntrospectResponse;
import com.ngp.ApiGateway.Repository.UserClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserClient userClient;
    public Mono<ApiResponse<IntrospectResponse>> introspect(String token){
        return userClient.introspect(IntrospectRequest.builder()
                .token(token)
                .build());
    }
}
