package com.cfcfarwest.service;

import com.cfcfarwest.entity.Event;
import com.cfcfarwest.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findUpcomingEvents();
    }

    public List<Event> getPastEvents() {
        return eventRepository.findPastEvents();
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event updated) {
        Event existing = getEventById(id);
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setEventType(updated.getEventType());
        existing.setStatus(updated.getStatus());
        existing.setEventDate(updated.getEventDate());
        existing.setEventEndDate(updated.getEventEndDate());
        existing.setVenue(updated.getVenue());
        existing.setEventLink(updated.getEventLink());
        existing.setMentorName(updated.getMentorName());
        existing.setMentorDesignation(updated.getMentorDesignation());
        existing.setMentorLinkedIn(updated.getMentorLinkedIn());
        existing.setBannerImageUrl(updated.getBannerImageUrl());
        existing.setMaxOuterParticipants(updated.getMaxOuterParticipants());
        return eventRepository.save(existing);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    // Auto-update event statuses based on current time
    public void updateEventStatuses() {
        LocalDateTime now = LocalDateTime.now();
        List<Event> events = eventRepository.findAll();
        for (Event event : events) {
            if (event.getStatus() == Event.EventStatus.CANCELLED) continue;
            if (event.getEventDate().isAfter(now)) {
                event.setStatus(Event.EventStatus.UPCOMING);
            } else if (event.getEventEndDate() != null && event.getEventEndDate().isAfter(now)) {
                event.setStatus(Event.EventStatus.ONGOING);
            } else {
                event.setStatus(Event.EventStatus.COMPLETED);
            }
        }
        eventRepository.saveAll(events);
    }
}
