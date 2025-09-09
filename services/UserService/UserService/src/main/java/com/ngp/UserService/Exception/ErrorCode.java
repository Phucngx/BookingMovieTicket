package com.ngp.UserService.Exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public enum ErrorCode {
    SUCCESS(1000, "Success", HttpStatus.OK),
    UNCATEGORIZED(1001, "Uncategorized", HttpStatus.INTERNAL_SERVER_ERROR),
    NOT_FOUND(1002, "Not found", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1002, "User not found", HttpStatus.BAD_REQUEST),
    ROLE_NOT_FOUND(1002, "Role not found", HttpStatus.BAD_REQUEST),
    ACCOUNT_NOT_FOUND(1002, "Account book not found", HttpStatus.BAD_REQUEST),
    NOT_EMPTY(1003, "This field is not empty", HttpStatus.BAD_REQUEST),
    NOT_NULL(1004, "This field is not null", HttpStatus.BAD_REQUEST),
    USERNAME_EXISTS(1005, "Username is already exist", HttpStatus.BAD_REQUEST),
    NOT_EXISTS(1006, "not exist", HttpStatus.NOT_FOUND),
    USERNAME_NOT_EXISTS(1006, "Username not exist", HttpStatus.NOT_FOUND),
    USERNAME_INVALID(1007, "Username must be in {min} - {max} characters", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1007, "Password must be in {min} - {max} characters", HttpStatus.BAD_REQUEST),
    PHONE_INVALID(1007, "Password must be {min} or {max} characters", HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(1007, "This field must be email", HttpStatus.BAD_REQUEST),
    KEY_INVALID(1007, "Key invalid", HttpStatus.BAD_REQUEST),
    BOB_INVALID(1007, "Age must be at least {min}", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1008, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1008, "You don't have permission", HttpStatus.FORBIDDEN),
    SIGN_IN_FAIL(1009, "Log-in fail", HttpStatus.BAD_REQUEST),
    ;
    final int code;
    final String message;
    final HttpStatus httpStatus;
}
