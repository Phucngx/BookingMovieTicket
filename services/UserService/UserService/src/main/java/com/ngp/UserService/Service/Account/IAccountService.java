package com.ngp.UserService.Service.Account;

import com.ngp.UserService.DTO.Request.*;
import com.ngp.UserService.DTO.Response.*;
import org.springframework.data.domain.Page;

public interface IAccountService {
    AccountResponse createAccount(AccountRequest request);
    AccountResponse updateAccount(Long id, AccountUpdateRequest request);
    void deleteAccount(Long id);
    Page<AccountDetailResponse> getAllAccount(int page, int size);
    AccountDetailResponse getDetailAccount(Long id);
    MeResponse getMe(Long AccountId);
    AccountResponse updatePassword(Long id, UpdatePasswordRequest request);
    AccountResponse updateStatus(Long id, UpdateStatusRequest status);
    AccountDetailsResponse getDetailsAccount(Long id);
}
