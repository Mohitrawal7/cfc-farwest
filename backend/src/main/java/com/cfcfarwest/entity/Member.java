package com.cfcfarwest.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "members")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberType memberType; // EXECUTIVE, COLLEGE_REP, GENERAL

    private String role; // e.g. "President", "Tech Lead", "Marketing Rep"

    private String college; // relevant for COLLEGE_REP

    private String profileImageUrl;

    @Column(nullable = false)
    private boolean active = true;

    @Column(updatable = false)
    private LocalDateTime joinedAt;

    @PrePersist
    public void prePersist() {
        this.joinedAt = LocalDateTime.now();
    }

    public enum MemberType {
        EXECUTIVE,
        COLLEGE_REP,
        GENERAL
    }
}
