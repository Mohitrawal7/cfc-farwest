package com.cfcfarwest.repository;

import com.cfcfarwest.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByEventId(Long eventId);
    List<Attendance> findByMemberId(Long memberId);
    Optional<Attendance> findByEventIdAndMemberId(Long eventId, Long memberId);
    long countByEventIdAndStatus(Long eventId, Attendance.AttendanceStatus status);

    @Query("SELECT COUNT(DISTINCT a.member) FROM Attendance a WHERE a.event.id = :eventId AND a.status = 'PRESENT'")
    long countPresentMembers(@Param("eventId") Long eventId);

    @Query("SELECT (COUNT(a) * 100.0 / (SELECT COUNT(m) FROM Member m WHERE m.active = true)) FROM Attendance a WHERE a.event.id = :eventId AND a.status = 'PRESENT'")
    Double getAttendancePercentage(@Param("eventId") Long eventId);
}
