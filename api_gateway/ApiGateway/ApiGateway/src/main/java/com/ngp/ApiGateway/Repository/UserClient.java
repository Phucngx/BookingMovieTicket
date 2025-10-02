package com.ngp.ApiGateway.Repository;

import com.ngp.ApiGateway.DTO.Request.IntrospectRequest;
import com.ngp.ApiGateway.DTO.Response.ApiResponse;
import com.ngp.ApiGateway.DTO.Response.IntrospectResponse;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.PostExchange;
import reactor.core.publisher.Mono;

public interface UserClient {
    @PostExchange(url = "/user-service/auth/introspect", contentType = MediaType.APPLICATION_JSON_VALUE)
    Mono<ApiResponse<IntrospectResponse>> introspect(@RequestBody IntrospectRequest request);
}
