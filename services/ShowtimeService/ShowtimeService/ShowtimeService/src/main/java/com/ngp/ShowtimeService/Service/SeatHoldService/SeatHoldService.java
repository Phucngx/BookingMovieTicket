package com.ngp.ShowtimeService.Service.SeatHoldService;

import com.ngp.ShowtimeService.DTO.Response.HoldResult;
import com.ngp.ShowtimeService.Exception.AppException;
import com.ngp.ShowtimeService.Exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j;
import org.redisson.api.RBucket;
import org.redisson.api.RScript;
import org.redisson.api.RSet;
import org.redisson.api.RedissonClient;
import org.redisson.client.codec.StringCodec;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SeatHoldService {
    private final RedissonClient redisson;

    private static final String HOLD_KEY_FMT = "seat:hold:%d:%d";   // value = holdId
    private static final String RES_KEY_FMT  = "seat:reserved:%d:%d";
    private static final String HOLD_IDX_FMT = "hold:idx:%s";       // RSet<String> liệt kê các holdKeys của holdId

    public HoldResult createHold(Long showtimeId, List<Long> seatIds, int ttlSec) {
        String holdId = "HOLD-" + UUID.randomUUID();

        // Lua: nếu có ghế đã HOLD/RESERVED -> fail; nếu không -> SET value=holdId và EXPIRE ttlSec
        String script =
                "local n = #KEYS / 2 " +
                        "for i = 1, n do " +
                        "  if redis.call('EXISTS', KEYS[i]) == 1 or redis.call('EXISTS', KEYS[n + i]) == 1 then " +
                        "    return 0 " +
                        "  end " +
                        "end " +
                        "for i = 1, n do " +
                        "  redis.call('SET', KEYS[i], ARGV[1]) " +            // value = holdId (string)
                        "  redis.call('EXPIRE', KEYS[i], ARGV[2]) " +         // TTL = string số giây
                        "end " +
                        "return 1";

        List<Object> keys = new ArrayList<>();
        // KEYS[1..n] = hold keys
        for (Long seatId : seatIds) {
            keys.add(String.format(HOLD_KEY_FMT, showtimeId, seatId));
        }
        // KEYS[n+1..2n] = reserved keys
        for (Long seatId : seatIds) {
            keys.add(String.format(RES_KEY_FMT, showtimeId, seatId));
        }

        // DÙNG StringCodec để đảm bảo ARGV là string, tránh ByteBuf kiểu lạ
        Number ok = redisson.getScript(StringCodec.INSTANCE).eval(
                RScript.Mode.READ_WRITE,
                script,
                RScript.ReturnType.INTEGER,
                keys,
                new Object[]{ holdId, String.valueOf(ttlSec) } // cả hai đều String
        );
        if (ok.intValue() == 0) {
            throw new AppException(ErrorCode.SEAT_CONFLICT);
        }

        // Index các hold keys theo holdId để reserve/cancel
        RSet<String> idx = redisson.getSet(String.format(HOLD_IDX_FMT, holdId));
        for (Object k : keys.subList(0, seatIds.size())) {
            idx.add((String) k);
        }
        idx.expire(Duration.ofSeconds(ttlSec));

        return new HoldResult(holdId, LocalDateTime.now().plusSeconds(ttlSec));
    }

    public void cancelHold(String holdId) {
        String idxKey = String.format(HOLD_IDX_FMT, holdId);
            RSet<String> idx = redisson.getSet(idxKey);

            // Nếu set không tồn tại hoặc rỗng thì return
            if (idx == null || idx.isEmpty()) {
                return;
            }

            for (String holdKey : idx) {
                RBucket<String> bucket = redisson.getBucket(holdKey, StringCodec.INSTANCE);
                String value = bucket.get();

                // So sánh an toàn tránh NullPointerException
                if (holdId.equals(value)) {
                    bucket.delete();
                }
            }

            // Xoá set index sau khi xử lý
            idx.delete();
    }


}


