import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../components/PollResults.css';
import Navbar from "./Navbar.jsx";

export default function PollResults() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [pollData, setPollData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('aggregated');
    const [openAccordion, setOpenAccordion] = useState(null);

    useEffect(() => {
        fetchResults();
    }, [id]);

    const fetchResults = async () => {
        const token = localStorage.getItem('basicAuthToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/poll/${id}/results`, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPollData(data);
                if (data.participants && data.participants.length > 0) {
                    setOpenAccordion(data.participants[0].userId);
                }
            } else {
                setError('Failed to load poll results. Are you the owner?');
            }
        } catch (err) {
            console.error(err);
            setError('Network error connecting to the server.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleAccordion = (userId) => {
        setOpenAccordion(openAccordion === userId ? null : userId);
    };

    if (isLoading) {
        return (
            <div className="min-vh-100 BackgroundPage text-light">
                <Navbar />
                <div className="text-center mt-5 py-5">
                    <div className="spinner-border" role="status"></div>
                    <p className="mt-3">Loading results...</p>
                </div>
            </div>
        );
    }

    if (error || !pollData) {
        return (
            <div className="min-vh-100 BackgroundPage text-light">
                <Navbar />
                <div className="container mt-5">
                    <div className="alert alert-danger">{error || 'Data not found.'}</div>
                </div>
            </div>
        );
    }
    const numericQuestions = pollData.questions.filter(q => q.type === 'NUMERIC');
    const booleanQuestions = pollData.questions.filter(q => q.type === 'BOOLEAN');

    return (
        <div className="min-vh-100 BackgroundPage text-light">
            <Navbar />
            <main className="container max-w-4xl py-5">
                <div className="mb-5">
                    <h2 className="titleText mb-1">{pollData.title} - Results</h2>
                    <p className="text-muted">{pollData.description}</p>
                </div>

                <div className="tabBottom mb-5">
                    <ul className="nav nav-tabs tabs">
                        <li className="nav-item tabText">
                            <button
                                className={`nav-link hoveringTab ${activeTab === 'aggregated' ? 'active openedTab' : ''}`}
                                onClick={() => setActiveTab('aggregated')}
                            >
                                Aggregated Summary
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link hoveringTab ${activeTab === 'individual' ? 'active openedTab' : ''}`}
                                onClick={() => setActiveTab('individual')}
                            >
                                Individual Responses
                            </button>
                        </li>
                    </ul>
                </div>

                {activeTab === 'aggregated' && (
                    <section className="row g-4 animation">
                        <div className="col-md-6 d-flex flex-column gap-4">
                            {numericQuestions.map((q, index) => {
                                const aggData = pollData.aggregated[q.id];
                                if (!aggData) return null;

                                const avg = aggData.average;
                                let circleColor = '#ef4444';
                                if (avg >= 4) circleColor = '#22c55e';
                                else if (avg >= 2.5) circleColor = '#eab308';

                                return (
                                    <div className="card h-100 cardss shadow" key={q.id}>
                                        <div className="card-body p-4">
                                            <div className="mb-3">
                                                <span className="badge QuestionNumber" style={{ backgroundColor: circleColor }}>Numeric</span>
                                            </div>
                                            <h5 className="card-title question mb-4">{q.text}</h5>

                                            <div className="text-center mt-4">
                                                <div
                                                    className="Circle mx-auto d-flex justify-content-center align-items-center"
                                                    style={{ border: `4px solid ${circleColor}`, color: circleColor, width: '100px', height: '100px', borderRadius: '50%' }}
                                                >
                                                    <span className="fs-1 fw-bold">{avg}</span>
                                                    <span className="fs-5 mt-2">/5</span>
                                                </div>
                                                <p className="text-white mt-3 fs-6">AVERAGE SCORE ({aggData.totalResponses} votes)</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {numericQuestions.length === 0 && (
                                <div className="text-muted fst-italic">No numeric questions in this poll.</div>
                            )}
                        </div>

                        <div className="col-md-6 d-flex flex-column gap-4">
                            {booleanQuestions.map((q, index) => {
                                const aggData = pollData.aggregated[q.id];
                                if (!aggData) return null;

                                const yesPercent = aggData.total === 0 ? 0 : Math.round((aggData.yes / aggData.total) * 100);
                                const noPercent = aggData.total === 0 ? 0 : Math.round((aggData.no / aggData.total) * 100);
                                const yesColor = yesPercent >= 50 ? '#22c55e' : '#38bdf8';
                                const noColor = noPercent > 50 ? '#ef4444' : '#64748b';

                                return (
                                    <div className="card h-100 cardss shadow" key={q.id}>
                                        <div className="card-body p-4">
                                            <div className="mb-3">
                                                <span className="badge QuestionNumber">Yes / No</span>
                                            </div>
                                            <h5 className="card-title question mb-4">{q.text}</h5>

                                            <div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="fw-bold" style={{ color: yesColor }}>Yes ({aggData.yes})</span>
                                                    <span className="fw-bold" style={{ color: noColor }}>No ({aggData.no})</span>
                                                </div>
                                                <div className="progress cardsBackground" style={{ height: '28px', backgroundColor: '#334155' }}>
                                                    <div
                                                        className="progress-bar fw-bold"
                                                        style={{ width: `${yesPercent}%`, backgroundColor: yesColor }}
                                                    >
                                                        {yesPercent > 0 ? `${yesPercent}%` : ''}
                                                    </div>
                                                    <div
                                                        className="progress-bar fw-bold text-light"
                                                        style={{ width: `${noPercent}%`, backgroundColor: noColor }}
                                                    >
                                                        {noPercent > 0 ? `${noPercent}%` : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {booleanQuestions.length === 0 && (
                                <div className="text-muted fst-italic">No yes/no questions in this poll.</div>
                            )}
                        </div>
                    </section>
                )}

                {activeTab === 'individual' && (
                    <section>
                        {!pollData.participants || pollData.participants.length === 0 ? (
                            <div className="alert alert-info text-center py-4 bg-dark border-secondary text-light">
                                No one has participated in this poll yet.
                            </div>
                        ) : (
                            <div className="accordion">
                                {pollData.participants.map((participant) => {
                                    const isOpen = openAccordion === participant.userId;

                                    return (
                                        <div className="accordion-item bg-dark border-secondary mb-3 rounded" key={participant.userId}>
                                            <h2 className="accordion-header">
                                                <button
                                                    className={`accordion-button ${!isOpen ? 'collapsed' : ''} bg-dark text-light`}
                                                    type="button"
                                                    onClick={() => toggleAccordion(participant.userId)}
                                                    style={{ boxShadow: 'none' }}
                                                >
                                                    <div className="d-flex align-items-center">
                                                        <span className="fs-5">Respondent: <strong className="text-info">{participant.username}</strong></span>
                                                    </div>
                                                </button>
                                            </h2>
                                            <div className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}>
                                                <div className="accordion-body p-0 border-top border-secondary">
                                                    <ul className="list-group list-group-flush">
                                                        {pollData.questions.map((q, index) => {
                                                            let rawAnswer = participant.answers[q.id];
                                                            let displayAnswer = rawAnswer;
                                                            if (q.type === 'BOOLEAN' && rawAnswer != null) {
                                                                displayAnswer = (rawAnswer === 'true' || rawAnswer === 'Yes') ? 'Yes' : 'No';
                                                            }

                                                            return (
                                                                <li className="list-group-item p-4 bg-dark text-light border-secondary" key={q.id}>
                                                                    <div className="text-muted small mb-1">
                                                                        <span className="badge bg-secondary me-2">Q{index + 1}</span>
                                                                        {q.text}
                                                                    </div>
                                                                    <div className="fw-bold mt-2 fs-5 me-2">
                                                                        {displayAnswer ? (
                                                                            <span className={q.type === 'NUMERIC' ? 'text-warning' : 'text-success'}>
                                                                                {displayAnswer}
                                                                            </span>
                                                                        ) : (
                                                                            <span style={{color : '#94a3b8'}} className="fst-italic"> Skipped</span>
                                                                        )}
                                                                    </div>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}