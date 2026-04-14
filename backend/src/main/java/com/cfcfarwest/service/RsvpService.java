package com.cfcfarwest.service;

import com.cfcfarwest.entity.Event;
import com.cfcfarwest.entity.Member;
import com.cfcfarwest.entity.Rsvp;
import com.cfcfarwest.repository.EventRepository;
import com.cfcfarwest.repository.MemberRepository;
import com.cfcfarwest.repository.RsvpRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class RsvpService {

    private final RsvpRepository rsvpRepository;
    private final EventRepository eventRepository;
    private final MemberRepository memberRepository;

    public RsvpService(RsvpRepository rsvpRepository,
                       EventRepository eventRepository,
                       MemberRepository memberRepository) {
        this.rsvpRepository = rsvpRepository;
        this.eventRepository = eventRepository;
        this.memberRepository = memberRepository;
    }

    public List<Rsvp> getRsvpsByEvent(Long eventId) {
        return rsvpRepository.findByEventId(eventId);
    }

    public List<Rsvp> getRsvpsByMember(Long memberId) {
        return rsvpRepository.findByMemberId(memberId);
    }

    public Rsvp upsertRsvp(Long eventId, Long memberId, Rsvp.RsvpStatus status) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new RuntimeException("Member not found: " + memberId));

        Rsvp rsvp = rsvpRepository.findByEventIdAndMemberId(eventId, memberId)
            .orElse(Rsvp.builder().event(event).member(member).build());

        rsvp.setStatus(status);
        return rsvpRepository.save(rsvp);
    }

    public long countConfirmed(Long eventId) {
        return rsvpRepository.countByEventIdAndStatus(eventId, Rsvp.RsvpStatus.CONFIRMED);
    }

    public boolean allMembersRsvped(Long eventId, long totalActiveMembers) {
        long confirmed = countConfirmed(eventId);
        return confirmed >= totalActiveMembers;
    }
}
