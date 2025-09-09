package com.ngp.ShowtimeService.Exception;

import com.ngp.ShowtimeService.DTO.Response.ApiResponse;
import feign.FeignException;
import jakarta.validation.ConstraintViolation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@Slf4j
@ControllerAdvice
public class GlobalException {
    private static final String MIN_ATTRIBUTE = "min";
    private static final String MAX_ATTRIBUTE = "max";

//    @ExceptionHandler(value = Exception.class)
//    ResponseEntity<ApiResponse<Void>> handleException(RuntimeException ex){
//        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
//                .code(ErrorCode.UNCATEGORIZED.getCode())
//                .message(ErrorCode.UNCATEGORIZED.getMessage())
//                .build();
//        return ResponseEntity.status(ErrorCode.UNCATEGORIZED.getHttpStatus()).body(apiResponse);
//    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<Void>> handleApplicationException(AppException ex){
        ErrorCode errorCode = ex.getErrorCode();
        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        return ResponseEntity.status(errorCode.getHttpStatus()).body(apiResponse);
    }

//    @ExceptionHandler(value = org.springframework.security.access.AccessDeniedException.class)
//    ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(AccessDeniedException ex){
//        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
//        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
//                .code(errorCode.getCode())
//                .message(errorCode.getMessage())
//                .build();
//        return ResponseEntity.status(errorCode.getHttpStatus()).body(apiResponse);
//    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        // Lấy message mặc định từ field lỗi đầu tiên
        String mess = null;
        if (ex.getFieldError() != null) {
            mess = ex.getFieldError().getDefaultMessage();
        }

        ErrorCode errorCode = ErrorCode.KEY_INVALID;
        Map<String, Object> attributes = null;

        try {
            // Nếu message khớp với tên của ErrorCode -> gán lại errorCode
            if (mess != null) {
                errorCode = ErrorCode.valueOf(mess);
            }

            // Lấy lỗi đầu tiên từ danh sách
            ObjectError firstError = ex.getBindingResult()
                    .getAllErrors()
                    .stream()
                    .findFirst()
                    .orElse(null);

            if (firstError != null) {
                try {
                    // Unwrap thành ConstraintViolation nếu có thể
                    ConstraintViolation<?> violation = firstError.unwrap(ConstraintViolation.class);
                    attributes = violation.getConstraintDescriptor().getAttributes();
                } catch (Exception unwrapEx) {
                    log.warn("Không thể unwrap ConstraintViolation từ ObjectError", unwrapEx);
                }
            }

        } catch (IllegalArgumentException e) {
            log.error("KEY_INVALID");
        }

        // Tạo phản hồi API
        ApiResponse<Void> apiResponse = new ApiResponse<>();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(
                (attributes != null)
                        ? mapAttribute(errorCode.getMessage(), attributes)
                        : errorCode.getMessage()
        );
        apiResponse.setData(null);

        return ResponseEntity.status(errorCode.getHttpStatus()).body(apiResponse);
    }

    @ExceptionHandler(value = FeignException.class)
    ResponseEntity<ApiResponse<Void>> handleFeignException(FeignException ex) {
        log.error("FeignException: status={}, body={}", ex.status(), ex.contentUTF8());

        ErrorCode errorCode;
        if (ex.status() == 404 || (ex.status() == 400)){
            errorCode = ErrorCode.RESOURCE_NOT_FOUND;
        } else if (ex.status() >= 500) {
            errorCode = ErrorCode.DEPENDENCY_UNAVAILABLE;
        } else {
            errorCode = ErrorCode.UNCATEGORIZED;
        }

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();

        return ResponseEntity.status(errorCode.getHttpStatus()).body(apiResponse);
    }



    private String mapAttribute(String message, Map<String, Object> attributes){
        String minvalue = String.valueOf(attributes.get(MIN_ATTRIBUTE));
        String maxValue = attributes.containsKey(MIN_ATTRIBUTE) ? String.valueOf(attributes.get(MAX_ATTRIBUTE)) : null;

        message = message.replace("{" + MIN_ATTRIBUTE + "}", minvalue);
        if(maxValue != null){
            message = message.replace("{" + MAX_ATTRIBUTE + "}", maxValue);
        }
        return message;
    }
}
