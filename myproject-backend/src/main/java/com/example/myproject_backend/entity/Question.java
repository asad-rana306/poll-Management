package com.example.myproject_backend.entity;

import com.example.myproject_backend.Enum.QuestionType;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

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
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Answer> answers = new ArrayList<>();
}
