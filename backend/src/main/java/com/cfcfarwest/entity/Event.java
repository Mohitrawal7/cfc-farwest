package com.cfcfarwest.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "events")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType eventType; // WORKSHOP, WEBINAR, HACKATHON, COMPETITION, MENTORSHIP

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status; // UPCOMING, ONGOING, COMPLETED, CANCELLED

    @Column(nullable = false)
    private LocalDateTime eventDate;

    private LocalDateTime eventEndDate;

    private String venue; // physical or online

    private String eventLink; // Zoom/Meet/registration link

    private String mentorName;

    private String mentorDesignation;

    private String mentorLinkedIn;

    private String bannerImageUrl;

    private Integer maxOuterParticipants; // max slots for outside students

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Rsvp> rsvps;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Attendance> attendances;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = EventStatus.UPCOMING;
    }

    public enum EventType {
        WORKSHOP,
        WEBINAR,
        HACKATHON,
        COMPETITION,
        MENTORSHIP_SESSION
    }

    public enum EventStatus {
        UPCOMING,
        ONGOING,
        COMPLETED,
        CANCELLED
    }
}
