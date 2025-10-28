package com.ngp.UserService.Controller;

import com.ngp.UserService.DTO.Request.*;
import com.ngp.UserService.DTO.Response.*;
import com.ngp.UserService.Exception.ErrorCode;
import com.ngp.UserService.Service.Account.AccountService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/accounts")
public class AccountController {
    AccountService accountService;

    @PostMapping("/create")
    public ApiResponse<AccountResponse> createAccount(@Valid @RequestBody AccountRequest request) {
        return ApiResponse.<AccountResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(accountService.createAccount(request))
                .build();
    }

    @PutMapping("/update/{id}")
    public ApiResponse<AccountResponse> updateAccount(@PathVariable Long id, @RequestBody AccountUpdateRequest request) {
        return ApiResponse.<AccountResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(accountService.updateAccount(id, request))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<Void> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ApiResponse.<Void>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message("Account deleted successfully")
                .build();
    }

    @GetMapping("/get-all")
    public ApiResponse<Page<AccountDetailResponse>> getAccountById(@RequestParam(name = "page") int page, @RequestParam(name = "size") int size) {
        return ApiResponse.<Page<AccountDetailResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(accountService.getAllAccount(page, size))
                .build();
    }

    @GetMapping("/get-detail/{id}")
    public ApiResponse<AccountDetailResponse> getAccountDetail(@PathVariable Long id) {
        return ApiResponse.<AccountDetailResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(accountService.getDetailAccount(id))
                .build();
    }

    @GetMapping("internal/get-detail-account/{id}")
    public ApiResponse<AccountDetailsResponse> getAccountDetails(@PathVariable Long id) {
        return ApiResponse.<AccountDetailsResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(accountService.getDetailsAccount(id))
                .build();
    }

    @PutMapping("/update-password/{id}")
    public ApiResponse<AccountResponse> updatePassword(@PathVariable Long id, @RequestBody UpdatePasswordRequest request){
        return ApiResponse.<AccountResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(accountService.updatePassword(id, request))
                .build();
    }

    @PutMapping("/update-status/{id}")
    public ApiResponse<AccountResponse> updateStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request){
        return ApiResponse.<AccountResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(accountService.updateStatus(id, request))
                .build();
    }
}
