package com.ngp.UserService.Controller;

import com.ngp.UserService.DTO.Request.AuthRequest;
import com.ngp.UserService.DTO.Request.IntrospectRequest;
import com.ngp.UserService.DTO.Request.RoleRequest;
import com.ngp.UserService.DTO.Response.*;
import com.ngp.UserService.Exception.ErrorCode;
import com.ngp.UserService.Repository.AccountRepository;
import com.ngp.UserService.Service.Account.AccountService;
import com.ngp.UserService.Service.Authenticate.AuthService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    AuthService authService;
    AccountService accountService;

    @PostMapping("/login")
    public ApiResponse<AuthResponse> createRole(@Valid @RequestBody AuthRequest request) {
        return ApiResponse.<AuthResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(authService.login(request))
                .build();
    }

    @GetMapping("/me")
    public MeResponse me(@AuthenticationPrincipal Jwt jwt) {
        Long accountId = Long.valueOf(jwt.getClaim("aid"));
        return accountService.getMe(accountId);
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request) {
        var result = authService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder().data(result).build();
    }


}
