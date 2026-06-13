package com.example.myproject_backend.entity;

import com.example.myproject_backend.DTO.Response.PollResponseDto;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    private String value;
    @ManyToOne
    @JoinColumn(name = "response_id")
    private PollResponse pollResponse;
    private String responderName;




}
