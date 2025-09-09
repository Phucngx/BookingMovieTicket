package com.ngp.TheaterService.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "Theaters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SuperBuilder
public class TheaterEntity extends BaseEntity{
    @Id
    @Column(name = "theater_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long theaterId;

    @Column(name = "theater_name")
    String theaterName;

    @Column(name = "district")
    String district;

    @Column(name = "city")
    String city;

    @Column(name = "address")
    String address;

    @Column(name = "phone")
    String phone;

    @Column(name = "manager_name")
    String managerName;

    @Column(name = "total_rooms")
    Integer totalRooms;

}
