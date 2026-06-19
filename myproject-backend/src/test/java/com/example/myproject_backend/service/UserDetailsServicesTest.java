package com.example.myproject_backend.service;

import com.example.myproject_backend.entity.User;
import com.example.myproject_backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class UserDetailsServicesTest {

    @Mock
    UserRepository user_repos;

    @InjectMocks
    UserDetailsServices custom_service;

    @BeforeEach
    void setup_mocking() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void UserNotFoundTest() {
        when(user_repos.findByUsername("fjeowjfon")).thenReturn(Optional.empty());

        try {
            custom_service.loadUserByUsername("fasdofjoaf");
            fail("it has to throw the exception");
        } catch (UsernameNotFoundException ex) {
            assertTrue(true);
        }
    }

    @Test
    void checkingUserCredentials() {
        User real_user = new User();
        real_user.setUsername("alex");
        real_user.setPassword("124");

        when(user_repos.findByUsername("alex")).thenReturn(Optional.of(real_user));

        UserDetails springUser = custom_service.loadUserByUsername("alex");

        assertNotNull(springUser);
        assertEquals("alex", springUser.getUsername());
        assertEquals("124", springUser.getPassword());
    }
}