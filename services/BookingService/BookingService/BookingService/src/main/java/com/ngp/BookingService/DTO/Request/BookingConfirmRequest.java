package com.ngp.BookingService.DTO.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingConfirmRequest {
    private String holdId;          // FE gửi lại đúng holdId đã nhận ở bước 1
    // có thể thêm paymentToken nếu tích hợp cổng thật
}
