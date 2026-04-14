package com.cfcfarwest.repository;

import com.cfcfarwest.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MemberRepository extends JpaRepository<Member, Long> {
    List<Member> findByMemberType(Member.MemberType memberType);
    List<Member> findByActiveTrue();
    boolean existsByEmail(String email);
}
