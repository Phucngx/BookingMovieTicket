package com.ngp.ShowtimeService.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HoldResult {
    private String holdId;          // mã hold (HOLD-xxx)
    private LocalDateTime expiresAt; // thời gian hết hạn
}
