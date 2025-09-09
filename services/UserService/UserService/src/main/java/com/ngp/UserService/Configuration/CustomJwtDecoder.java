package com.ngp.UserService.Configuration;

import com.ngp.UserService.DTO.Request.IntrospectRequest;
import com.ngp.UserService.Service.Authenticate.AuthService;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.text.ParseException;
import java.util.Date;
import java.util.Objects;

@Component
public class CustomJwtDecoder implements JwtDecoder {

    @Override
    public Jwt decode(String token) throws JwtException {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            var issueTime = signedJWT.getJWTClaimsSet().getIssueTime().toInstant();
            var expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime().toInstant();
            var header = signedJWT.getHeader().toJSONObject();
            var claims = signedJWT.getJWTClaimsSet().getClaims();
            return new Jwt(token, issueTime, expirationTime, header, claims);
        } catch (ParseException e) {
            throw new JwtException("Invalid JWT token", e);
        }
    }
}
