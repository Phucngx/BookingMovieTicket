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
@Table(name = "Movies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SuperBuilder
public class MovieEntity extends BaseEntity{
    @Id
    @Column(name = "movie_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long movieId;

    @Column(name = "title", nullable = false)
    String title;

    @Column(name = "description", columnDefinition = "TEXT")
    String description;

    @Column(name = "release_date")
    LocalDate releaseDate;

    @Column(name = "language")
    String language;

    @Column(name = "country")
    String country;

    @Column(name = "duration_minutes")
    Integer durationMinutes;

    @Column(name = "rating")
    Integer rating; // out of 10

    @Column(name = "poster_url")
    String posterUrl;

    @Column(name = "trailer_url")
    String trailerUrl;

    @ManyToMany
    @JoinTable(
            name = "movie_genres",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    Set<GenreEntity> genres = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "movie_actors",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "actor_id")
    )
    Set<ActorEntity> actors = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "director_id", nullable = false)
    DirectorEntity director;
}
