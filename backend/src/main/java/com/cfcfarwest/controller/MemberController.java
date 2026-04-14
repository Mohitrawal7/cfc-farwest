package com.cfcfarwest.controller;

import com.cfcfarwest.entity.Member;
import com.cfcfarwest.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping
    public List<Member> getAll() {
        return memberService.getAllActiveMembers();
    }

    @GetMapping("/all")
    public List<Member> getAllIncludingInactive() {
        return memberService.getAllMembers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getById(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.getMemberById(id));
    }

    @GetMapping("/type/{type}")
    public List<Member> getByType(@PathVariable Member.MemberType type) {
        return memberService.getMembersByType(type);
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return Map.of(
            "executives", memberService.countByType(Member.MemberType.EXECUTIVE),
            "collegeReps", memberService.countByType(Member.MemberType.COLLEGE_REP),
            "general", memberService.countByType(Member.MemberType.GENERAL),
            "total", memberService.getAllActiveMembers().size()
        );
    }

    @PostMapping
    public ResponseEntity<Member> create(@RequestBody Member member) {
        return ResponseEntity.ok(memberService.createMember(member));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Member> update(@PathVariable Long id, @RequestBody Member member) {
        return ResponseEntity.ok(memberService.updateMember(id, member));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        memberService.deleteMember(id);
        return ResponseEntity.noContent().build();
    }
}
