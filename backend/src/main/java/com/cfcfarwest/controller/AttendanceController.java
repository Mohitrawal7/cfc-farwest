package com.cfcfarwest.controller;

import com.cfcfarwest.entity.Attendance;
import com.cfcfarwest.service.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping("/event/{eventId}")
    public List<Attendance> getByEvent(@PathVariable Long eventId) {
        return attendanceService.getAttendanceByEvent(eventId);
    }

    @GetMapping("/member/{memberId}")
    public List<Attendance> getByMember(@PathVariable Long memberId) {
        return attendanceService.getAttendanceByMember(memberId);
    }

    @GetMapping("/event/{eventId}/summary")
    public Map<String, Object> getSummary(@PathVariable Long eventId) {
        return attendanceService.getAttendanceSummary(eventId);
    }

    @PostMapping("/event/{eventId}/member/{memberId}")
    public ResponseEntity<Attendance> markAttendance(
            @PathVariable Long eventId,
            @PathVariable Long memberId,
            @RequestBody Map<String, String> body) {
        Attendance.AttendanceStatus status = Attendance.AttendanceStatus.valueOf(body.get("status"));
        String note = body.getOrDefault("note", null);
        return ResponseEntity.ok(attendanceService.markAttendance(eventId, memberId, status, note));
    }

    @PostMapping("/event/{eventId}/bulk")
    public ResponseEntity<Void> bulkMark(
            @PathVariable Long eventId,
            @RequestBody List<Map<String, Object>> attendanceList) {
        attendanceService.bulkMarkAttendance(eventId, attendanceList);
        return ResponseEntity.ok().build();
    }
}
