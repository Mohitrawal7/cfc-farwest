package com.cfcfarwest.controller;

import com.cfcfarwest.entity.Rsvp;
import com.cfcfarwest.service.MemberService;
import com.cfcfarwest.service.RsvpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rsvp")
public class RsvpController {

    private final RsvpService rsvpService;
    private final MemberService memberService;

    public RsvpController(RsvpService rsvpService, MemberService memberService) {
        this.rsvpService = rsvpService;
        this.memberService = memberService;
    }

    @GetMapping("/event/{eventId}")
    public List<Rsvp> getByEvent(@PathVariable Long eventId) {
        return rsvpService.getRsvpsByEvent(eventId);
    }

    @GetMapping("/member/{memberId}")
    public List<Rsvp> getByMember(@PathVariable Long memberId) {
        return rsvpService.getRsvpsByMember(memberId);
    }

    @GetMapping("/event/{eventId}/confirmed-count")
    public Map<String, Object> getConfirmedCount(@PathVariable Long eventId) {
        long confirmed = rsvpService.countConfirmed(eventId);
        long totalMembers = memberService.getAllActiveMembers().size();
        return Map.of(
            "confirmed", confirmed,
            "total", totalMembers,
            "allMembersRsvped", confirmed >= totalMembers
        );
    }

    @PostMapping("/event/{eventId}/member/{memberId}")
    public ResponseEntity<Rsvp> upsertRsvp(
            @PathVariable Long eventId,
            @PathVariable Long memberId,
            @RequestBody Map<String, String> body) {
        Rsvp.RsvpStatus status = Rsvp.RsvpStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(rsvpService.upsertRsvp(eventId, memberId, status));
    }
}
