package com.ngp.UserService.Service.Authenticate;

import com.ngp.UserService.DTO.Request.AuthRequest;
import com.ngp.UserService.DTO.Request.IntrospectRequest;
import com.ngp.UserService.DTO.Response.AuthResponse;
import com.ngp.UserService.DTO.Response.IntrospectResponse;
import com.ngp.UserService.Entity.AccountEntity;
import com.ngp.UserService.Entity.InvalidToken;
import com.ngp.UserService.Exception.AppException;
import com.ngp.UserService.Exception.ErrorCode;
import com.ngp.UserService.Repository.AccountRepository;
import com.ngp.UserService.Repository.InvalidTokenRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class AuthService implements IAuthService{
    AccountRepository accountRepository;
    InvalidTokenRepository invalidTokenRepository;
    PasswordEncoder passwordEncoder;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.signer-key}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    @Override
    public AuthResponse login(AuthRequest request) {
        AccountEntity account = accountRepository.findByUsername(request.getUsername()).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        if(account == null){
            throw new AppException(ErrorCode.ACCOUNT_NOT_FOUND);
        }
        boolean isAuthenticated = passwordEncoder.matches(request.getPassword(), account.getPassword());
        if(!isAuthenticated){
            throw new AppException(ErrorCode.SIGN_IN_FAIL);
        }
        if(account.getStatus() == 0){
            throw new AppException(ErrorCode.ACCOUNT_DISABLED);
        }
        String token = generateToken(account);
        return AuthResponse.builder()
                .accessToken(token)
                .build();
    }


    private String generateToken(AccountEntity account){
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(account.getUsername())
                .issuer("https://auth.ngp.com")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(VALID_DURATION, ChronoUnit.DAYS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("roles", List.of(account.getRole().getRoleName()))
                .claim("aid", account.getAccountId().toString())
                .claim("preferred_username", account.getUsername())
//                .claim("scope", buildScope(user))
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(jwsHeader, payload);

        try{
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException ex){
            throw new RuntimeException(ex);
        }
    }

    @Override
    public IntrospectResponse introspect(IntrospectRequest request)  {
        var token = request.getToken();
        boolean isValid = true;

        try {
            verifyToken(token, false);
        } catch (AppException | JOSEException | ParseException e) {
            isValid = false;
        }

        return IntrospectResponse.builder().valid(isValid).build();
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime()
                .toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date()))) throw new AppException(ErrorCode.UNAUTHENTICATED);

        String jti = signedJWT.getJWTClaimsSet().getJWTID();
        if (invalidTokenRepository.existsById(jti)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        return signedJWT;
    }

    @Override
    public AuthResponse refreshToken(IntrospectRequest request) throws ParseException, JOSEException {
        SignedJWT signedJWT = verifyToken(request.getToken(), true);

        String jit = signedJWT.getJWTClaimsSet().getJWTID();
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        InvalidToken invalidatedToken =
                InvalidToken.builder()
                        .id(jit)
                        .expiryDate(expiryTime)
                        .build();

        invalidTokenRepository.save(invalidatedToken);

        String username = signedJWT.getJWTClaimsSet().getSubject();
        AccountEntity accounts =
                accountRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        String token = generateToken(accounts);
        return AuthResponse.builder().accessToken(token).build();
    }
}
