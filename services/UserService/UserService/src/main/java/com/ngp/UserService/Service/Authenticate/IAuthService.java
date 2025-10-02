package com.ngp.UserService.Service.Authenticate;

import com.ngp.UserService.DTO.Request.AuthRequest;
import com.ngp.UserService.DTO.Request.IntrospectRequest;
import com.ngp.UserService.DTO.Response.AuthResponse;
import com.ngp.UserService.DTO.Response.IntrospectResponse;
import com.ngp.UserService.DTO.Response.MeResponse;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface IAuthService {
    AuthResponse login(AuthRequest request);
    IntrospectResponse introspect(IntrospectRequest request);
    AuthResponse refreshToken(IntrospectRequest request) throws ParseException, JOSEException;
//    String register(String username, String password, String email);
//    void logout(String token);
}
