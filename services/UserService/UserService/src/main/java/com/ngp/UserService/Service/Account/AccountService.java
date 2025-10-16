package com.ngp.UserService.Service.Account;

import com.ngp.UserService.DTO.Request.AccountRequest;
import com.ngp.UserService.DTO.Request.AccountUpdateRequest;
import com.ngp.UserService.DTO.Request.UpdatePasswordRequest;
import com.ngp.UserService.DTO.Request.UpdateStatusRequest;
import com.ngp.UserService.DTO.Response.*;
import com.ngp.UserService.Entity.AccountEntity;
import com.ngp.UserService.Entity.RoleEntity;
import com.ngp.UserService.Entity.UserEntity;
import com.ngp.UserService.Exception.AppException;
import com.ngp.UserService.Exception.ErrorCode;
import com.ngp.UserService.Mapper.AccountMapper;
import com.ngp.UserService.Repository.AccountRepository;
//import com.ngp.UserService.Repository.HttpClient.ProfileClient;
import com.ngp.UserService.Repository.RoleRepository;
import com.ngp.UserService.Service.User.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class AccountService implements IAccountService{
    AccountRepository accountRepository;
    AccountMapper accountMapper;
    RoleRepository roleRepository;
    UserService userService;
    PasswordEncoder passwordEncoder;
//    ProfileClient profileClient;

    @Transactional
    @Override
    public AccountResponse createAccount(AccountRequest request) {
        if(accountRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_EXISTS);
        }
        RoleEntity role = roleRepository.findByRoleName("USER");
        if (role == null) {
            throw new AppException(ErrorCode.ROLE_NOT_FOUND);
        }
        UserEntity user =  UserEntity.builder()
                .fullName("User " + (int) (Math.random() * 1000))
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();
        user = userService.createUser(user);
        AccountEntity account = accountMapper.toAccount(request);
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setStatus(1);
        account.setRole(role);
        account.setUser(user);
        accountRepository.save(account);
        return AccountResponse.builder()
                .accountId(account.getAccountId())
                .username(account.getUsername())
                .status(account.getStatus())
                .fullName(user.getFullName())
                .roleName(role.getRoleName())
                .build();

    }

    @Override
    public AccountResponse updateAccount(Long id, AccountUpdateRequest request) {
        AccountEntity account = accountRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        accountMapper.updateAccount(account, request);
        if (request.getRoleId() != null) {
            RoleEntity role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
            account.setRole(role);
        }
        return accountMapper.toAccountResponse(accountRepository.save(account));
    }


    @Override
    public void deleteAccount(Long id) {
        accountRepository.deleteById(id);
    }

    @Override
    public Page<AccountDetailResponse> getAllAccount(int page, int size) {
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<AccountEntity> listAccounts = accountRepository.findByRole_RoleNameNot("ADMIN", pageable);
        return listAccounts.map(a -> {
            UserResponse user = new UserResponse();
            UserEntity u = a.getUser();
            if (u != null) {
                user.setUserId(String.valueOf(u.getUserId()));
                user.setFullName(u.getFullName());
                user.setEmail(u.getEmail());
                user.setPhone(u.getPhone());
                user.setAddress(u.getAddress());
                user.setAvatarUrl(u.getAvatarUrl());
            }
            return AccountDetailResponse.builder()
                    .accountId(a.getAccountId())
                    .username(a.getUsername())
                    .status(a.getStatus())
                    .roleName(a.getRole().getRoleName())
                    .user(user)
                    .build();
        });
    }

    @Override
    public AccountDetailResponse getDetailAccount(Long id) {
        AccountEntity account = accountRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        UserEntity user = account.getUser();

        UserResponse userResponse = UserResponse.builder()
                .userId(String.valueOf(user.getUserId()))
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .avatarUrl(user.getAvatarUrl())
                .build();

        return AccountDetailResponse.builder()
                .accountId(account.getAccountId())
                .username(account.getUsername())
                .status(account.getStatus())
                .roleName(account.getRole().getRoleName())
                .user(userResponse)
                .build();
    }

    @Override
    public AccountDetailsResponse getDetailsAccount(Long id) {
        AccountEntity account = accountRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        return AccountDetailsResponse.builder()
                .accountId(account.getAccountId())
                .username(account.getUsername())
                .status(account.getStatus())
                .roleName(account.getRole().getRoleName())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public MeResponse getMe(Long accountId) {
        AccountEntity a = accountRepository.findDetailById(accountId)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        return MeResponse.builder()
                .accountId(a.getAccountId())
                .username(a.getUsername())
                .roleName(a.getRole().getRoleName())
                .userId(a.getUser().getUserId())
                .fullName(a.getUser().getFullName())
                .status(a.getStatus())
                .avatarUrl(a.getUser().getAvatarUrl())
                .email(a.getUser().getEmail())
                .phone(a.getUser().getPhone())
                .address(a.getUser().getAddress())
                .build();
    }

    @Override
    public AccountResponse updatePassword(Long id, UpdatePasswordRequest request) {
        AccountEntity account = accountRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        if(!passwordEncoder.matches(request.getOldPassword(), account.getPassword())) {
            throw new AppException(ErrorCode.PASSWORD_INCORRECT);
        }
        account.setPassword(passwordEncoder.encode(request.getNewPassword()));
        return accountMapper.toAccountResponse(accountRepository.save(account));
    }

    @Override
    public AccountResponse updateStatus(Long id, UpdateStatusRequest request) {
        AccountEntity account = accountRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        account.setStatus(request.getStatus());
        return accountMapper.toAccountResponse(accountRepository.save(account));
    }

}
