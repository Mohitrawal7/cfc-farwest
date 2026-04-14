package com.cfcfarwest.service;

import com.cfcfarwest.entity.Attendance;
import com.cfcfarwest.entity.Event;
import com.cfcfarwest.entity.Member;
import com.cfcfarwest.repository.AttendanceRepository;
import com.cfcfarwest.repository.EventRepository;
import com.cfcfarwest.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
@Transactional
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EventRepository eventRepository;
    private final MemberRepository memberRepository;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             EventRepository eventRepository,
                             MemberRepository memberRepository) {
        this.attendanceRepository = attendanceRepository;
        this.eventRepository = eventRepository;
        this.memberRepository = memberRepository;
    }

    public List<Attendance> getAttendanceByEvent(Long eventId) {
        return attendanceRepository.findByEventId(eventId);
    }

    public List<Attendance> getAttendanceByMember(Long memberId) {
        return attendanceRepository.findByMemberId(memberId);
    }

    public Attendance markAttendance(Long eventId, Long memberId, Attendance.AttendanceStatus status, String note) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new RuntimeException("Member not found: " + memberId));

        Attendance attendance = attendanceRepository.findByEventIdAndMemberId(eventId, memberId)
            .orElse(Attendance.builder().event(event).member(member).build());

        attendance.setStatus(status);
        attendance.setNote(note);
        return attendanceRepository.save(attendance);
    }

    public void bulkMarkAttendance(Long eventId, List<Map<String, Object>> attendanceList) {
        for (Map<String, Object> item : attendanceList) {
            Long memberId = Long.valueOf(item.get("memberId").toString());
            Attendance.AttendanceStatus status = Attendance.AttendanceStatus.valueOf(item.get("status").toString());
            String note = item.containsKey("note") ? item.get("note").toString() : null;
            markAttendance(eventId, memberId, status, note);
        }
    }

    public Map<String, Object> getAttendanceSummary(Long eventId) {
        long present = attendanceRepository.countByEventIdAndStatus(eventId, Attendance.AttendanceStatus.PRESENT);
        long absent = attendanceRepository.countByEventIdAndStatus(eventId, Attendance.AttendanceStatus.ABSENT);
        long excused = attendanceRepository.countByEventIdAndStatus(eventId, Attendance.AttendanceStatus.EXCUSED);
        Double percentage = attendanceRepository.getAttendancePercentage(eventId);

        Map<String, Object> summary = new HashMap<>();
        summary.put("present", present);
        summary.put("absent", absent);
        summary.put("excused", excused);
        summary.put("attendancePercentage", percentage != null ? Math.round(percentage) : 0);
        return summary;
    }
}
