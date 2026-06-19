package com.example.myproject_backend.controller;

import com.example.myproject_backend.DTO.Response.UserResponseDto;
import com.example.myproject_backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class UserControllerTest {

    @Mock
    UserService usr_service;

    @InjectMocks
    UserController user_ctrl;

    @BeforeEach
    void init() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAlltheUserFromUserController() {
        Principal p = new Principal() {
            @Override
            public String getName() {
                return "my_user";
            }
        };

        List<UserResponseDto> dummyList = new ArrayList<>();
        dummyList.add(new UserResponseDto(2L, "someone"));

        when(usr_service.getAllUsersExcept("my_user")).thenReturn(dummyList);

        ResponseEntity<List<UserResponseDto>> res = user_ctrl.getAllUsers(p);

        assertEquals(200, res.getStatusCodeValue()); // deprecated but still works fine
        assertEquals(1, res.getBody().size());
    }
}