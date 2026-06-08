package com.example.myproject_backend.service;

import com.example.myproject_backend.DTO.Request.CreatePollRequest;
import com.example.myproject_backend.DTO.Request.SubmitPollRequest;
import com.example.myproject_backend.DTO.Request.UpdatePollRequest;
import com.example.myproject_backend.DTO.Response.CreatedPollResponseDto;
import com.example.myproject_backend.DTO.Response.FullPollResponseDto;
import com.example.myproject_backend.DTO.Response.PendingPollResponse;
import com.example.myproject_backend.DTO.Response.QuestionDto;
import com.example.myproject_backend.Enum.QuestionType;
import com.example.myproject_backend.entity.*;
import com.example.myproject_backend.repository.PollRepository;
import com.example.myproject_backend.repository.QuestionRepository;
import com.example.myproject_backend.repository.ResponseRepository;
import com.example.myproject_backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PollService {


    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PollRepository pollRepository;
    @Autowired
    private ResponseRepository responseRepository;
    @Autowired
    private QuestionRepository questionRepository;

    @Transactional
    public Poll createPoll(CreatePollRequest createPollRequest, String userName) {
        if(pollRepository.existsByTitle(createPollRequest.getTitle())) {
            throw new RuntimeException("Poll title already exist change it kindly");
        }
        User owner = userRepository.findByUsername(userName).orElseThrow(
                ()-> new RuntimeException("User not found with userName"));
        Poll poll = new Poll();
        poll.setTitle(createPollRequest.getTitle());
        poll.setPollOwner(owner);
        poll.setDescription(createPollRequest.getDescriptioin());
        poll.setDueDate(createPollRequest.getDueDate());
        List<Question> questions = createPollRequest.getQuestions().stream().map(questionRequest->{
            Question ques = new Question();
            ques.setText(questionRequest.getText());
            ques.setType(QuestionType.valueOf(questionRequest.getType()));
            ques.setPoll(poll);
            return ques;
        }).collect(Collectors.toList());
        poll.setQuestions(questions);
        return pollRepository.save(poll);
    }

    @Transactional
    public void inviteUser(Long pollId, String inviteName, String requesterUsername) {
        if (inviteName.equals(requesterUsername)) {
            throw new RuntimeException("You cannot invite yourself to a poll");
        }
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));
        if (!poll.getPollOwner().getUsername().equals(requesterUsername)) {
            throw new RuntimeException("only owner can invite");
        }
        User invitee = userRepository.findByUsername(inviteName)
                .orElseThrow(() -> new RuntimeException("User to invite not found"));

        if (!poll.getInvitees().contains(invitee)) {
            poll.getInvitees().add(invitee);
            pollRepository.save(poll);
        }
    }

    @Transactional
    public void deletePoll(Long pollId, String requesterUsername) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

        if (!poll.getPollOwner().getUsername().equals(requesterUsername)) {
            throw new RuntimeException("Only the creator can delete this poll");
        }

        pollRepository.delete(poll);
    }

    @Transactional
    public void finishPoll(Long pollId, String requesterUsername) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

        if (!poll.getPollOwner().getUsername().equals(requesterUsername)) {
            throw new RuntimeException("Only the creator can finish this poll");
        }

        poll.setFinished(true);
        pollRepository.save(poll);
    }

    @Transactional
    public Poll updatePoll(Long pollId, UpdatePollRequest request, String requesterUsername) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

        if (!poll.getPollOwner().getUsername().equals(requesterUsername)) {
            throw new RuntimeException("Only the creator can update this poll");
        }
        if (!poll.getTitle().equals(request.getTitle()) && pollRepository.existsByTitle(request.getTitle())) {
            throw new RuntimeException("Poll title already exists, kindly change it");
        }

        poll.setTitle(request.getTitle());
        poll.setDescription(request.getDescription());
        poll.setDueDate(request.getDueDate());

        return pollRepository.save(poll);
    }

    public List<PendingPollResponse> getPendingPolls(String username) {

        List<Poll> allInvitedPolls = pollRepository.findByInviteesUsernameOrderByDueDateDesc(username);
        List<PollResponse> userResponses = responseRepository.findByUserUsername(username);
        List<Long> answeredPollIds = new ArrayList<>();
        for (PollResponse response : userResponses) {
            answeredPollIds.add(response.getPoll().getId());
        }
        List<Poll> pendingPolls = new ArrayList<>();
        for (Poll poll : allInvitedPolls) {
            if (!answeredPollIds.contains(poll.getId())) {
                pendingPolls.add(poll);
            }
        }
        List<PendingPollResponse> responseDtos = new ArrayList<>();
        for (Poll p : pendingPolls) {
            PendingPollResponse dto = new PendingPollResponse(
                    p.getId(),
                    p.getTitle(),
                    p.getDueDate(),
                    p.getQuestions().size()
            );
            responseDtos.add(dto);
        }

        return responseDtos;
    }

    @Transactional
    public void submitPollResponse(Long pollId, SubmitPollRequest request, String username) {
        if (responseRepository.existsByPollIdAndUserUsername(pollId, username)) {
            throw new RuntimeException("You have already answered this poll");
        }

        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found maybe deleted"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found, kindly login again"));

        if (!poll.getInvitees().contains(user)) {
            throw new RuntimeException("You are not invited to this poll");
        }

        if (request.getAnswer().size() != poll.getQuestions().size()) {
            throw new RuntimeException("please answer all questions");
        }

        PollResponse response = new PollResponse();
        response.setPoll(poll);
        response.setUser(user);

        List<Answer> answers = request.getAnswer().stream().map(answerResponse -> {
            Question question = questionRepository.findById(answerResponse.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question not found"));

            Answer answer = new Answer();
            answer.setQuestion(question);
            answer.setPollResponse(response);
            answer.setValue(answerResponse.getValue());
            return answer;
        }).collect(Collectors.toList());

        response.setAnswers(answers);
        responseRepository.save(response);
    }

    public List<CreatedPollResponseDto> getCreatedPolls(String username) {
        List<Poll> myPolls = pollRepository.findByPollOwnerUsernameOrderByDueDateDesc(username);

        return myPolls.stream()
                .map(p -> new CreatedPollResponseDto(
                        p.getId(),
                        p.getTitle(),
                        p.getDueDate(),
                        p.getQuestions().size(),
                        p.isFinished()))
                .collect(Collectors.toList());
    }

    public FullPollResponseDto getPollWithQuestions(Long pollId, String username) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

        List<QuestionDto> questionDtos = poll.getQuestions().stream()
                .map(q -> new QuestionDto(q.getId(), q.getText(), q.getType().name()))
                .collect(Collectors.toList());

        return new FullPollResponseDto(
                poll.getId(),
                poll.getTitle(),
                poll.getDescription(),
                questionDtos
        );
    }
}
