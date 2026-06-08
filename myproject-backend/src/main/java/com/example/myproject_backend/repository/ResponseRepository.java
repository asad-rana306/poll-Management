package com.example.myproject_backend.repository;

import com.example.myproject_backend.entity.PollResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResponseRepository extends JpaRepository<PollResponse, Long> {
    boolean existsByPollIdAndUserUsername(Long pollId, String username);
    List<PollResponse> findByUserUsername(String username);
}
