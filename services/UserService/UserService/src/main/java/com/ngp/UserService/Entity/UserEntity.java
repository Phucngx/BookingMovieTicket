package com.ngp.UserService.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "Users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SuperBuilder
@ToString
public class UserEntity extends BaseEntity{
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long userId;

    @Column(name = "full_name")
    String fullName;

    @Column(name = "phone")
    String phone;

    @Column(name = "email")
    String email;

    @Column(name = "dob")
    LocalDateTime dob;

    @Column(name = "address")
    String address;

    @Column(name = "avatar_url")
    String avatarUrl;
}
