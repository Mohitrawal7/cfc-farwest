package com.cfcfarwest.repository;

import com.cfcfarwest.entity.Rsvp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RsvpRepository extends JpaRepository<Rsvp, Long> {
    List<Rsvp> findByEventId(Long eventId);
    List<Rsvp> findByMemberId(Long memberId);
    Optional<Rsvp> findByEventIdAndMemberId(Long eventId, Long memberId);
    long countByEventIdAndStatus(Long eventId, Rsvp.RsvpStatus status);
}
