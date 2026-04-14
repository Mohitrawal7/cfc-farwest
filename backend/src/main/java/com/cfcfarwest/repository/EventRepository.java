package com.cfcfarwest.repository;

import com.cfcfarwest.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByStatusOrderByEventDateAsc(Event.EventStatus status);
    List<Event> findByEventDateAfterOrderByEventDateAsc(LocalDateTime date);
    List<Event> findByEventDateBeforeAndStatusOrderByEventDateDesc(LocalDateTime date, Event.EventStatus status);
    List<Event> findByEventTypeOrderByEventDateDesc(Event.EventType eventType);

    @Query("SELECT e FROM Event e WHERE e.status = 'UPCOMING' ORDER BY e.eventDate ASC")
    List<Event> findUpcomingEvents();

    @Query("SELECT e FROM Event e WHERE e.status = 'COMPLETED' ORDER BY e.eventDate DESC")
    List<Event> findPastEvents();
}
