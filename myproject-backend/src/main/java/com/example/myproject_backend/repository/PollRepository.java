package com.example.myproject_backend.repository;

import com.example.myproject_backend.entity.Poll;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PollRepository extends JpaRepository<Poll, Long> {
    boolean existsByTitle(String title);
    List<Poll> findByPollOwnerUsernameOrderByDueDateDesc(String username);
    List<Poll> findByInviteesUsernameOrderByDueDateDesc(String username);
}