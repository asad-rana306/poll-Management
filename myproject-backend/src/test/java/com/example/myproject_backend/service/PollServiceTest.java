package com.example.myproject_backend.service;

import com.example.myproject_backend.DTO.Request.*;
import com.example.myproject_backend.DTO.Response.AnswerResponse;
import com.example.myproject_backend.DTO.Response.CreatedPollResponseDto;
import com.example.myproject_backend.DTO.Response.FullPollResponseDto;
import com.example.myproject_backend.DTO.Response.PendingPollResponse;
import com.example.myproject_backend.entity.*;
import com.example.myproject_backend.repository.*;
import com.example.myproject_backend.Enum.QuestionType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PollServiceTest {

    @Mock
    UserRepository userRepository;
    @Mock
    PollRepository pollRepository;
    @Mock
    ResponseRepository responseRepository;
    @Mock
    QuestionRepository questionRepository;

    @InjectMocks
    PollService pollService;

    User user;
    Poll pollObject;

    @BeforeEach
    void init() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setId(1L);
        user.setUsername("alex");

        pollObject = new Poll();
        pollObject.setId(2L);
        pollObject.setTitle("my poll");
        pollObject.setPollOwner(user);
        pollObject.setQuestions(new ArrayList<>());
        pollObject.setInvitees(new ArrayList<>());
    }

    @Test
    void CreatingPollWithTHeTitleWhichisALreadyExist() {
        CreatePollRequest req = new CreatePollRequest();
        req.setTitle("Poll 1");

        when(pollRepository.existsByTitle("Poll 1")).thenReturn(true);

        try {
            pollService.createPoll(req, "alex");
            fail("exception");
        } catch (RuntimeException e) {
            assertEquals("Poll title already exist change it kindly", e.getMessage());
        }
    }
    @Test
    void TestingByCreatingThePoll() {
        CreatePollRequest req = new CreatePollRequest();
        req.setTitle("new one");
        req.setDescription("desc");
        req.setAnonymous(true);

        QuestionRequest qr = new QuestionRequest();
        qr.setText("q1");
        qr.setType("TEXT");
        req.setQuestions(Arrays.asList(qr));

        when(pollRepository.existsByTitle("Weather Poll")).thenReturn(false);
        when(userRepository.findByUsername("alex")).thenReturn(Optional.of(user));
        when(pollRepository.save(any())).thenReturn(pollObject);

        Poll p = pollService.createPoll(req, "alex");
        assertNotNull(p);
    }
    @Test
    void TestingUserCanNotInviteHimSelf() {
        assertThrows(RuntimeException.class, () -> pollService.inviteUser(2L, "alex", "alex"));
    }
    @Test
    void TestingBYInvitingOtherUser() {
        User friend = new User();
        friend.setUsername("alex1");

        when(pollRepository.findById(1L)).thenReturn(Optional.of(pollObject));
        when(userRepository.findByUsername("alex1")).thenReturn(Optional.of(friend));

        pollService.inviteUser(1L, "alex1", "alex");
        assertEquals(true, pollObject.getInvitees().contains(friend));
    }
    @Test
    void TestingDeletingPollAPI() {
        when(pollRepository.findById(1L)).thenReturn(Optional.of(pollObject));
        when(responseRepository.findByPollId(1L)).thenReturn(new ArrayList<>());

        pollService.deletePoll(1L, "alex");
        verify(pollRepository, times(1)).delete(pollObject);
    }
    @Test
    void TestingFinishingAPI() {
        when(pollRepository.findById(1L)).thenReturn(Optional.of(pollObject));
        pollService.finishPoll(1L, "alex");
        assertTrue(pollObject.isFinished());
    }
    @Test
    void UpdatingThePollWhichisCreatedBYOtherUser() {
        when(pollRepository.findById(1L)).thenReturn(Optional.of(pollObject));
        assertThrows(RuntimeException.class, () -> pollService.updatePoll(1L, new UpdatePollRequest(), "hacker"));
    }
    @Test
    void SubmittingThePollWhichisALreadyAnswered() {
        when(responseRepository.existsByPollIdAndUserUsername(10L, "Alex")).thenReturn(true);
        assertThrows(RuntimeException.class, () -> pollService.submitPollResponse(1L, new SubmitPollRequest(), "Alex"));
    }
    @Test
    void SubmittingExpiredPoll() {
        pollObject.setDueDate(LocalDate.now().minusDays(1));
        when(responseRepository.existsByPollIdAndUserUsername(1L, "Alex")).thenReturn(false);
        when(pollRepository.findById(1L)).thenReturn(Optional.of(pollObject));

        assertThrows(RuntimeException.class, () -> pollService.submitPollResponse(10L, new SubmitPollRequest(), "Alex"));
    }
    @Test
    void TestingSubmittingThePollResponse() {
        pollObject.setDueDate(LocalDate.now().plusDays(5));
        Question q1 = new Question();
        q1.setId(5L);
        pollObject.getQuestions().add(q1);
        pollObject.getInvitees().add(user);

        when(responseRepository.existsByPollIdAndUserUsername(1L, "alex")).thenReturn(false);
        when(pollRepository.findById(1L)).thenReturn(Optional.of(pollObject));
        when(userRepository.findByUsername("alex")).thenReturn(Optional.of(user));
        when(questionRepository.findById(2L)).thenReturn(Optional.of(q1));

        SubmitPollRequest req = new SubmitPollRequest();
        AnswerResponse ans = new AnswerResponse();
        ans.setQuestionId(2L);
        ans.setValue("my answer");

        List<AnswerResponse> list_ans = new ArrayList<>();
        list_ans.add(ans);
        req.setAnswer(list_ans);

        pollService.submitPollResponse(1L, req, "alex");
        verify(responseRepository, times(1)).save(any(PollResponse.class));
    }
    @Test
    void GettingPollOfthatUserwhoDidnotCreateAnypoll() {
        when(pollRepository.findByPollOwnerUsernameOrderByDueDateDesc("alex")).thenReturn(null);
        assertTrue(pollService.getCreatedPolls("alex").isEmpty());
    }
    @Test
    void getingCreatedPollOfOwner() {
        List<Poll> list = new ArrayList<>();
        list.add(pollObject);
        when(pollRepository.findByPollOwnerUsernameOrderByDueDateDesc("alex")).thenReturn(list);
        List<CreatedPollResponseDto> res = pollService.getCreatedPolls("alex");
        assertEquals(1, res.size());
    }
    @Test
    void GettingInvitedPollDataFromPendingPoll() {
        List<Poll> invited = new ArrayList<>();
        invited.add(pollObject);
        when(pollRepository.findByInviteesUsernameOrderByDueDateDesc("alex")).thenReturn(invited);
        when(responseRepository.findByUserUsername("alex")).thenReturn(new ArrayList<>());

        List<PendingPollResponse> pending = pollService.getPendingPolls("alex");
        assertNotNull(pending);
    }
    @Test
    void GettingThePollsQuestiojns() {
        Question q = new Question();
        q.setId(1L);
        q.setText("Question");
        q.setType(QuestionType.TEXT);
        pollObject.getQuestions().add(q);

        when(pollRepository.findById(1L)).thenReturn(Optional.of(pollObject));
        FullPollResponseDto dto = pollService.getPollWithQuestions(1L, "alex");
        assertNotNull(dto);
        assertEquals("my poll", dto.getTitle());
    }
    @Test
    void checkAnonymsPollAndBoleanData() {
        pollObject.setAnonymous(true);
        Question q1 = new Question();
        q1.setId(1L);
        q1.setType(QuestionType.BOOLEAN);
        pollObject.getQuestions().add(q1);

        PollResponse pr = new PollResponse();
        pr.setUser(user);
        Answer a = new Answer();
        a.setQuestion(q1);
        a.setValue("true");
        pr.setAnswers(Arrays.asList(a));

        when(pollRepository.findById(1L)).thenReturn(Optional.of(pollObject));
        when(responseRepository.findByPollId(1L)).thenReturn(Arrays.asList(pr));

        Map<String, Object> res = pollService.getPollResults(1L, "alex");
        assertNotNull(res);
        assertEquals(true, res.get("anonymous"));
    }
    @Test
    void checkingtheAverageNumericValue() {
        Question q_num = new Question();
        q_num.setId(2L);
        q_num.setType(QuestionType.NUMERIC);
        pollObject.getQuestions().add(q_num);

        PollResponse pr2 = new PollResponse();
        pr2.setUser(user);
        Answer a2 = new Answer();
        a2.setQuestion(q_num);
        a2.setValue("4.0");

        List<Answer> alist = new ArrayList<>();
        alist.add(a2);
        pr2.setAnswers(alist);

        List<PollResponse> pr_list = new ArrayList<>();
        pr_list.add(pr2);

        when(pollRepository.findById(1L)).thenReturn(Optional.of(pollObject));
        when(responseRepository.findByPollId(1L)).thenReturn(pr_list);

        Map<String, Object> results = pollService.getPollResults(1L, "alex");
        assertNotNull(results);
    }
}