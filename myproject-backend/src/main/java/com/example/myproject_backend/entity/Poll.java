package com.example.myproject_backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class Poll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String title;

    private String description;
    private LocalDate dueDate;

    @ManyToOne
    @JoinColumn("user_id")
    private User pollOwner;

    private List<Question> questions = new ArrayList<>();




}
