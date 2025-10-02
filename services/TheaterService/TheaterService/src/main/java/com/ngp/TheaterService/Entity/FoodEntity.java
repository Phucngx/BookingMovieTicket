package com.ngp.TheaterService.Entity;

import com.ngp.TheaterService.Contrains.FoodType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "Foods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SuperBuilder
public class FoodEntity extends BaseEntity{
    @Id
    @Column(name = "food_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long foodId;

    @Column(name = "food_name", nullable = false)
    String foodName;

    @Column(name = "price", nullable = false)
    Double price;

    @Enumerated(EnumType.STRING)
    @Column(name = "food_type", nullable = false)
    FoodType foodType;

    @Column(name = "food_url", nullable = false)
    String foodUrl;
}
