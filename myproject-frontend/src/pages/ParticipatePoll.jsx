import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../components/ParticipatePoll.css';
import Navbar from "./Navbar.jsx";

export default function ParticipatePoll() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [poll, setPolls] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchPoll = async () => {
            const token = localStorage.getItem('basicAuthToken');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/api/poll/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Basic ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setPolls(data);
                } else {
                    setError('the poll is finished you can respond now');
                }
            } catch (err) {
                setError('Network error. Is the server running?');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPoll();
    }, [id, navigate]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const unansweredQuestions = poll.questions.filter(q => answers[q.id] === undefined || answers[q.id] === '');
        if (unansweredQuestions.length > 0) {
            setError('answer all the questions.');
            window.scrollTo(0, 0);
            return;
        }
        setIsSubmitting(true);

        const formattedAnswers = Object.entries(answers).map(([qId, val]) => ({
            questionId: parseInt(qId),
            value: String(val)
        }));

        const token = localStorage.getItem('basicAuthToken');

        try {
            const response = await fetch(`http://localhost:8080/api/poll/${id}/submit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ answer: formattedAnswers })
            });

            if (response.ok) {
                alert("your response is recorded.");
                navigate('/pending-polls');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'failed to reponsed because it is already finished');
                window.scrollTo(0, 0);
            }
        } catch (err) {
            setError('Network error during submission.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-vh-100 BackgroundPage d-flex justify-content-center align-items-center">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!poll) return null;

    return (
        <div className="min-vh-100 BackgroundPage text-light py-5">
            <Navbar />
            <main className="container max-w-3xl mt-4">

                {error && (
                    <div className="alert shadow-sm mb-4 alert-danger" role="alert">
                        <strong>You are Late</strong> {error}
                    </div>
                )}

                <div className="card shadow-lg mb-5 darkCard border-0">
                    <div className="card-body p-5 ">
                        <h2 className="card-title text-white mb-3">{poll.title}</h2>
                        {poll.description && (
                            <p className="text-white mb-0">{poll.description}</p>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {poll.questions.map((question, index) => (
                        <div key={question.id} className="card shadow-sm mb-4 darkCard border-0">
                            <div className="card-body p-4 p-md-5">

                                <div className="d-flex align-items-center mb-4">
                                    <span className="badge fs-5 me-3">Q{index + 1}</span>
                                    <h5 className="mb-0 text-white fs-5">{question.text}</h5>
                                </div>

                                <div className="mt-4">
                                    {question.type === 'TEXT' && (
                                        <textarea
                                            className="form-control plainTextQuestionBoz"
                                            rows="5"
                                            placeholder="Type your answer here..."
                                            value={answers[question.id] || ''}
                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        />
                                    )}

                                    {question.type === 'BOOLEAN' && (
                                        <div className="d-flex gap-3 ">
                                            <label className={`optionBox ${answers[question.id] === 'true' ? 'selected-yes' : ''}`}>
                                                <input
                                                    className="d-none"
                                                    type="radio"
                                                    name={`question-${question.id}`}
                                                    value="true"
                                                    checked={answers[question.id] === 'true'}
                                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                />
                                                <span className="text1">Yes</span>
                                            </label>

                                            <label className={`optionBox ${answers[question.id] === 'false' ? 'selected-no' : ''}`}>
                                                <input
                                                    className="d-none"
                                                    type="radio"
                                                    name={`question-${question.id}`}
                                                    value="false"
                                                    checked={answers[question.id] === 'false'}
                                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                />
                                                <span className="text1">No</span>
                                            </label>
                                        </div>
                                    )}

                                    {question.type === 'NUMERIC' && (
                                        <div>
                                            <div className="d-flex justify-content-between mb-2 px-2 labelTextLast">
                                                <span>Low</span>
                                                <span>High</span>
                                            </div>
                                            <div className="numeric">
                                                {[1, 2, 3, 4, 5].map((num) => (
                                                    <label
                                                        key={num}
                                                        className={`number ${Number(answers[question.id]) === num ? 'selected-number' : ''}`}
                                                    >
                                                        <input
                                                            className="d-none"
                                                            type="radio"
                                                            name={`question-${question.id}`}
                                                            value={num}
                                                            checked={Number(answers[question.id]) === num}
                                                            onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                                                        />
                                                        <span className="text1">{num}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="d-flex justify-content-between align-items-center mt-5">
                        <button type="button" className="btn cancelButton" onClick={() => navigate('/pending-polls')}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-lg px-5 submitButton shadow" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Answers'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
