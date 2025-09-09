package com.ngp.MovieService.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Actors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SuperBuilder
public class ActorEntity extends BaseEntity{
    @Id
    @Column(name = "actor_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long actorId;

    @Column(name = "name")
    String name;

    @Column(name = "birth_date")
    LocalDate birthDate;

    @Column(name = "nationality")
    String nationality;

    @ManyToMany(mappedBy = "actors", fetch = FetchType.LAZY)
    Set<MovieEntity> movies = new HashSet<>();

}
