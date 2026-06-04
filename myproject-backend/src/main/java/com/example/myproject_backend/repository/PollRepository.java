package com.example.myproject_backend.repository;

import com.example.myproject_backend.entity.Poll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {
    Boolean existsByTitle(String title);
    List<Poll> findByPollOwnerUsernameOrderByDueDateDesc(String username);
    List<Poll> findPendingPollsForUser(String username);
}
