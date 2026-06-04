package com.example.myproject_backend.entity;

import com.example.myproject_backend.Enum.QuestionType;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;
    private QuestionType type;
    @ManyToOne
    @JoinColumn(name = "poll_id")
    private Poll poll;
}
