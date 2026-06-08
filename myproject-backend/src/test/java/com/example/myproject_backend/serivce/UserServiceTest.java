package com.example.myproject_backend.serivce;

import com.example.myproject_backend.DTO.Response.UserResponseDto;
import com.example.myproject_backend.entity.User;
import com.example.myproject_backend.repository.UserRepository;
import com.example.myproject_backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void testGetAllUsersExcept_RemovesCurrentLoggedInUser() {
        User u1 = new User();
        u1.setId(1L);
        u1.setUsername("Alex");

        User u2 = new User();
        u2.setId(2L);
        u2.setUsername("Henry");

        when(userRepository.findAll()).thenReturn(Arrays.asList(u1, u2));
        List<UserResponseDto> result = userService.getAllUsersExcept("Alex");

        assertEquals(1, result.size(), "The list should only contain 1 user");
        assertEquals("Henry", result.get(0).getUsername(), "Alex should be filtered out, leaving only Henry");
    }
}