package com.ngp.ShowtimeService.Service.SeatReservationService;

import com.ngp.ShowtimeService.DTO.Response.ReserveResult;
import com.ngp.ShowtimeService.Entity.LockSeatEntity;
import com.ngp.ShowtimeService.Entity.LockSeatId;
import com.ngp.ShowtimeService.Exception.AppException;
import com.ngp.ShowtimeService.Exception.ErrorCode;
import com.ngp.ShowtimeService.Repository.LockSeatRepository.LockSeatRepository;
import lombok.RequiredArgsConstructor;
import org.redisson.api.RScript;
import org.redisson.api.RSet;
import org.redisson.api.RedissonClient;
import org.redisson.client.codec.StringCodec;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatReservationService {
    private final RedissonClient redisson;
    private final LockSeatRepository lockRepo;

    @Transactional
    public ReserveResult reserveFromHold(String holdId, Long bookingId) {
        String idxKey = "hold:idx:%s".formatted(holdId);
        RSet<String> idx = redisson.getSet(idxKey);
        if (!idx.isExists() || idx.isEmpty()) {
            throw new AppException(ErrorCode.HOLD_EXPIRED);
        }

        List<String> holdKeys = new ArrayList<>(idx);
        int n = holdKeys.size();
        List<String> resKeys = new ArrayList<>(n);
        for (String hk : holdKeys) {
            resKeys.add(hk.replace("seat:hold:", "seat:reserved:"));
        }

        // Lua: verify tất cả holdKey tồn tại và value == holdId -> DEL holds -> SET reserved
        String script =
                "local n = #KEYS / 2 " +
                        "for i = 1, n do " +
                        "  local v = redis.call('GET', KEYS[i]); " +
                        "  if (not v) or v ~= ARGV[1] then return 0 end " +
                        "end " +
                        "for i = 1, n do redis.call('DEL', KEYS[i]) end " +
                        "for i = n + 1, #KEYS do redis.call('SET', KEYS[i], '1') end " +
                        "return 1";

        List<Object> keys = new ArrayList<>(n * 2);
        keys.addAll(holdKeys);
        keys.addAll(resKeys);

        Number ok = redisson.getScript(StringCodec.INSTANCE).eval(
                RScript.Mode.READ_WRITE,
                script,
                RScript.ReturnType.INTEGER,
                keys,
                new Object[]{ holdId } // string
        );
        if (ok.intValue() == 0) {
            throw new AppException(ErrorCode.HOLD_EXPIRED_OR_CONFLICT);
        }

        // Ghi DB unique
        LocalDateTime now = LocalDateTime.now();
        List<Long> reservedSeatIds = new ArrayList<>(n);
        try {
            // (1) Lua OK -> đã DEL hold và SET reserved
            // (2) Ghi DB
            for (String hk : holdKeys) {
                String[] parts = hk.split(":");
                Long showtimeId = Long.parseLong(parts[2]);
                Long seatId = Long.parseLong(parts[3]);

                LockSeatEntity ls = new LockSeatEntity();
                ls.setId(new LockSeatId(showtimeId, seatId));
                ls.setBookingId(bookingId);
                ls.setReservedAt(now);
                lockRepo.save(ls);
                reservedSeatIds.add(seatId);
            }
            idx.delete();
            return new ReserveResult(reservedSeatIds);
        } catch (RuntimeException e) {
            // COMPENSATION: xóa reserved keys để không “kẹt” ghế
            for (String rk : resKeys) {
                redisson.getBucket(rk).delete();
            }
            // (tùy chọn) khôi phục holdKeys với TTL ngắn nếu muốn
            throw e; // để BE trả lỗi đúng
        }

    }
}

