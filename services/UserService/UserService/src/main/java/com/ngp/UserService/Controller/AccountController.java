package com.ngp.UserService.Controller;

import com.ngp.UserService.DTO.Request.AccountRequest;
import com.ngp.UserService.DTO.Request.AccountUpdateRequest;
import com.ngp.UserService.DTO.Response.AccountDetailResponse;
import com.ngp.UserService.DTO.Response.AccountResponse;
import com.ngp.UserService.DTO.Response.ApiResponse;
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
    public ApiResponse<Page<AccountResponse>> getAccountById(@RequestParam(name = "page") int page, @RequestParam(name = "size") int size) {
        return ApiResponse.<Page<AccountResponse>>builder()
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
}
