package com.example.myproject_backend.entity;

import com.example.myproject_backend.DTO.Response.PollResponse;
import jakarta.persistence.*;

public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Question question;
    @ManyToOne
    @JoinColumn(name = "response_id")
    private PollResponse pollResponse;

    private String value;
}
