package com.ngp.UserService.Service.Account;

import com.ngp.UserService.DTO.Request.AccountRequest;
import com.ngp.UserService.DTO.Request.AccountUpdateRequest;
import com.ngp.UserService.DTO.Request.RoleRequest;
import com.ngp.UserService.DTO.Response.AccountResponse;
import com.ngp.UserService.DTO.Response.MeResponse;
import com.ngp.UserService.DTO.Response.RoleResponse;
import org.springframework.data.domain.Page;

public interface IAccountService {
    AccountResponse createAccount(AccountRequest request);
    AccountResponse updateAccount(Long id, AccountUpdateRequest request);
    void deleteAccount(Long id);
    Page<AccountResponse> getAllAccount(int page, int size);
    AccountResponse getDetailAccount(Long id);
    MeResponse getMe(Long AccountId);

}
