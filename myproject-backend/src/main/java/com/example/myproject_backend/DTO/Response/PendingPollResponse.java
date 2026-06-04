package com.example.myproject_backend.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PendingPollResponse {
            private Long id;
            private String title;
            private LocalDate dueDate;
            private int numberOfQuestions;
}
