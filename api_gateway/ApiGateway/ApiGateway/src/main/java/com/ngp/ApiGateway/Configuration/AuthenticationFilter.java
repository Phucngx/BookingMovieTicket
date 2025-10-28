package com.ngp.ApiGateway.Configuration;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ngp.ApiGateway.DTO.Response.ApiResponse;
import com.ngp.ApiGateway.Service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationFilter implements GlobalFilter, Ordered {
    UserService userService;
    ObjectMapper objectMapper;

    @NonFinal
    @Value("${app.api-prefix}")
    private String apiPrefix;

    @NonFinal
    private String[] publicEndpoints = {
            "user-service/auth/.*",
            "user-service/accounts/create",
            "movie-service/movies/get-all",
            "movie-service/movies/get-details/.*",
            "movie-service/movies/search",
            "movie-service/genres/get-all",
            "movie-service/actors/get-all",
            "movie-service/actors/get-details/.*",
            "movie-service/directors/get-all",
            "movie-service/directors/get-details/.*",
            "theater-service/theaters/get-all",
            "theater-service/theaters/get-details/.*",
            "theater-service/theaters/get-theaters",
            "showtime-service/showtimes/get-all",
            "showtime-service/showtimes/get-details/.*",
            "showtime-service/showtimes/get-details/.*",
            "showtime-service/showtimes/get-showtimes/.*",
            "showtime-service/showtimes/get-showtimes-by-date/.*",
    };

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("Authentication filter executed for request: {}", exchange.getRequest().getURI());
        if(isPublicEndpoint(exchange.getRequest())){
            return chain.filter(exchange);
        }

        //get token from request header
        List<String> authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION);
        if(authHeader == null || authHeader.isEmpty()) {
            return unauthenticated(exchange.getResponse());
        }
        String token = authHeader.get(0).replace("Bearer ", "");
        return userService.introspect(token).flatMap(introspectResponse -> {
            if(introspectResponse.getData().isValid()){
                return chain.filter(exchange);
            } else {
                return unauthenticated(exchange.getResponse());
            }
        }).onErrorResume(throwable -> unauthenticated(exchange.getResponse()));
    }

    @Override
    public int getOrder() {
        return -1;
    }

    public Mono<Void> unauthenticated(ServerHttpResponse response) {
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(1401)
                .message("Vui lòng đăng nhập để tiếp tục!")
                .build();

        String body = null;
        try {
            body = objectMapper.writeValueAsString(apiResponse);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        return response.writeWith(Mono.just(
                response.bufferFactory().wrap(body.getBytes())
        ));
    }

    private boolean isPublicEndpoint(ServerHttpRequest request){
        String path = request.getURI().getPath();
        String base = apiPrefix.endsWith("/") ? apiPrefix : apiPrefix + "/";
        return Arrays.stream(publicEndpoints).anyMatch(s -> {
            String regex = "^" + java.util.regex.Pattern.quote(base) + s + "$";
            return path.matches(regex);
        });
    }


}
