package com.cfcfarwest.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rsvps", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"event_id", "member_id"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Rsvp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RsvpStatus status; // CONFIRMED, DECLINED, MAYBE

    private LocalDateTime rsvpAt;

    @PrePersist
    public void prePersist() {
        this.rsvpAt = LocalDateTime.now();
        if (this.status == null) this.status = RsvpStatus.CONFIRMED;
    }

    public enum RsvpStatus {
        CONFIRMED,
        DECLINED,
        MAYBE
    }
}
