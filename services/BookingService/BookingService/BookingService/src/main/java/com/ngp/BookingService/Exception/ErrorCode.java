package com.ngp.BookingService.Exception;

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
    UNCATEGORIZED(1001, "Xảy ra lỗi khi chọn ghế!", HttpStatus.INTERNAL_SERVER_ERROR),
    NOT_FOUND(1002, "Not found", HttpStatus.BAD_REQUEST),
    SHOWTIME_NOT_FOUND(1002, "SHOWTIME not found", HttpStatus.BAD_REQUEST),
    MOVIE_NOT_FOUND(1002, "MOVIE not found", HttpStatus.BAD_REQUEST),
    BOOKING_NOT_FOUND(1002, "Không có vé đã mua", HttpStatus.BAD_REQUEST),
    TICKET_NOT_FOUND(1002, "Thanh toán thất bại. Vui lòng thực hiện lại!", HttpStatus.BAD_REQUEST),
    RESOURCE_NOT_FOUND(1002, "RESOURCE_NOT_FOUND", HttpStatus.BAD_REQUEST),
    DEPENDENCY_UNAVAILABLE(1007, "DEPENDENCY_UNAVAILABLE", HttpStatus.INTERNAL_SERVER_ERROR),
    NOT_EMPTY(1003, "This field is not empty", HttpStatus.BAD_REQUEST),
    NOT_NULL(1004, "This field is not null", HttpStatus.BAD_REQUEST),
    SHOWTIME_EXISTS(1005, "SHOWTIME is already exist", HttpStatus.BAD_REQUEST),
    NOT_EXISTS(1006, "not exist", HttpStatus.NOT_FOUND),
    SHOWTIME_NOT_EXISTS(1006, "SHOWTIME not exist", HttpStatus.NOT_FOUND),
    BOOKING_INVALID_STATE(1007, "BOOKING_INVALID_STATE", HttpStatus.BAD_REQUEST),
    HOLD_INVALID(1007, "HOLD_INVALID", HttpStatus.BAD_REQUEST),
    PHONE_INVALID(1007, "Password must be {min} or {max} characters", HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(1007, "This field must be email", HttpStatus.BAD_REQUEST),
    KEY_INVALID(1007, "Key invalid", HttpStatus.BAD_REQUEST),
    BOB_INVALID(1007, "Age must be at least {min}", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1008, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1008, "You don't have permission", HttpStatus.FORBIDDEN),
    SIGN_IN_FAIL(1009, "Log-in fail", HttpStatus.BAD_REQUEST),
    SEAT_CONFLICT(1010, "Seat has been locked or sold out", HttpStatus.CONFLICT),
    HOLD_EXPIRED_OR_CONFLICT(1010, "Time hole seat has ben expired", HttpStatus.CONFLICT),
    HOLD_EXPIRED(1010, "Time hole seat has ben expired", HttpStatus.BAD_REQUEST),
    ;
    final int code;
    final String message;
    final HttpStatus httpStatus;
}
