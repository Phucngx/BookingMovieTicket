package com.ngp.TheaterService.Entity;

import com.ngp.TheaterService.Contrains.ScreenType;
import com.ngp.TheaterService.Contrains.SoundSystem;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "Rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SuperBuilder
public class RoomEntity extends BaseEntity{
    @Id
    @Column(name = "room_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long roomId;

    @Column(name = "room_name", nullable = false, unique = true)
    String roomName;

    @Enumerated(EnumType.STRING)
    @Column(name = "screen_type", nullable = false, length = 50)
    ScreenType screenType;

    @Enumerated(EnumType.STRING)
    @Column(name = "sound_system", nullable = false, length = 50)
    SoundSystem soundSystem;

    @Column(name = "totalSeats", nullable = false)
    Integer totalSeats;

    @ManyToOne
    @JoinColumn(name = "theater_id", nullable = false)
    TheaterEntity theater;

}
