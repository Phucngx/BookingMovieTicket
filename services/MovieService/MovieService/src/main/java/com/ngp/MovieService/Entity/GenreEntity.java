package com.ngp.MovieService.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Genres")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SuperBuilder
public class GenreEntity extends BaseEntity{
    @Id
    @Column(name = "actor_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long genreId;

    @Column(name = "genre_name")
    String genreName;

    @Column(name = "description")
    String description;

    @ManyToMany(mappedBy = "genres", fetch = FetchType.LAZY)
    Set<MovieEntity> movies = new HashSet<>();

}
