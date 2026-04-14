package com.cfcfarwest.service;

import com.cfcfarwest.entity.Member;
import com.cfcfarwest.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public List<Member> getAllActiveMembers() {
        return memberRepository.findByActiveTrue();
    }

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    public List<Member> getMembersByType(Member.MemberType type) {
        return memberRepository.findByMemberType(type);
    }

    public Member getMemberById(Long id) {
        return memberRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Member not found: " + id));
    }

    public Member createMember(Member member) {
        if (memberRepository.existsByEmail(member.getEmail())) {
            throw new RuntimeException("Email already registered: " + member.getEmail());
        }
        return memberRepository.save(member);
    }

    public Member updateMember(Long id, Member updated) {
        Member existing = getMemberById(id);
        existing.setFullName(updated.getFullName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setMemberType(updated.getMemberType());
        existing.setRole(updated.getRole());
        existing.setCollege(updated.getCollege());
        existing.setProfileImageUrl(updated.getProfileImageUrl());
        existing.setActive(updated.isActive());
        return memberRepository.save(existing);
    }

    public void deleteMember(Long id) {
        memberRepository.deleteById(id);
    }

    public long countByType(Member.MemberType type) {
        return memberRepository.findByMemberType(type).size();
    }
}
