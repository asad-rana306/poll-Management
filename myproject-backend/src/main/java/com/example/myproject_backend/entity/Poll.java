package com.example.myproject_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Poll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String title;

    private String description;
    private LocalDate dueDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User pollOwner;
    @OneToMany(mappedBy = "poll", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();
    private String OwnerName;

    @ManyToMany
    @JoinTable(
            name = "poll_invitations",
            joinColumns = @JoinColumn(name = "poll_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> invitees = new ArrayList<>();

    private boolean finished = false;
}