import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../components/PollResults.css';
import Navbar from "./Navbar.jsx";

const mockPollData = {
    id: 1,
    title: "technology stack",
    description: "showing result",
    isFinished: true,
    questions: [
        { id: 1, text: "What is your favourite programming language?", type: "plain-text" },
        { id: 2, text: "have you ever experience docker", type: "boolean" },
        { id: 3, text: "how you think this project is", type: "numeric" }
    ]
};

const mockResultsData = {
    aggregated: {
        2: { yes: 8, no: 2, total: 10 },
        3: { average: 4.2, totalResponses: 10 }
    },
    participants: [
        { userId: 101, username: "alex", answers: { 1: "Java", 2: "true", 3: "5" } },
        { userId: 102, username: "Henry", answers: { 1: "Python", 2: "false", 3: "3" } },
        { userId: 103, username: "chaplin", answers: { 1: "JavaScript", 2: "true", 3: "4" } }
    ]
};

export default function PollResults() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Load data instantly for frontend showcase
    const [poll] = useState(mockPollData);
    const [results] = useState(mockResultsData);

    const [activeTab, setActiveTab] = useState('aggregated');

    const [openAccordion, setOpenAccordion] = useState(results.participants[0]?.userId);

    const toggleAccordion = (userId) => {
        setOpenAccordion(openAccordion === userId ? null : userId);
    };

    return (
        <div className="min-vh-100 BackgroundPage text-light">
            <Navbar />
            <main className="container max-w-4xl py-5">
                <div className="d-flex justify-content-between align-items-start mb-5">
                        <div>
                            <h2 className="titleText mb-1">Poll Results</h2>
                        </div>
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
                        {poll.questions.map((q, index) => {
                            if (q.type === 'plain-text') return null;

                            const aggData = results.aggregated[q.id];
                            return (
                                <div className="col-md-6" key={q.id}>
                                    <div className="card h-100 cardss shadow">
                                        <div className="card-body p-4">
                                            <div className="mb-3">
                                                <span className="badge QuestionNumber">Question {index + 1}</span>
                                            </div>
                                            <h5 className="card-title question mb-4">{q.text}</h5>

                                            {q.type === 'boolean' && aggData && (
                                                <div>
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span className="Yes">True ({aggData.yes})</span>
                                                        <span className="No">false ({aggData.no})</span>
                                                    </div>
                                                    <div className="progress cardsBackground" style={{ height: '28px' }}>
                                                        <div
                                                            className="progress-bar YesLine"
                                                            style={{ width: `${(aggData.yes / aggData.total) * 100}%` }}
                                                        >
                                                            {Math.round((aggData.yes / aggData.total) * 100)}%
                                                        </div>
                                                        <div
                                                            className="progress-bar NoLine"
                                                            style={{ width: `${(aggData.no / aggData.total) * 100}%` }}
                                                        >
                                                            {Math.round((aggData.no / aggData.total) * 100)}%
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {q.type === 'numeric' && aggData && (
                                                <div className="text-center mt-4">
                                                    <div className="Circle mx-auto">
                                                        <span className="Score">{aggData.average}</span>
                                                        <span className="overallScore">/5</span>
                                                    </div>
                                                    <p className="text-white mt-3 fs-6">AVERAGE SCORE</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                )}
                {activeTab === 'individual' && (
                    <section>
                        {results.participants.length === 0 ? (
                            <div className="alert text-center py-4">
                                No one has participated in this poll yet.
                            </div>
                        ) : (
                            <div className="accordion">
                                {results.participants.map((participant) => {
                                    const isOpen = openAccordion === participant.userId;

                                    return (
                                        <div className="accordion-item" key={participant.userId}>
                                            <h2 className="accordion-header">
                                                <button
                                                    className={`accordion-button collapsingButton ${!isOpen ? 'collapsed' : ''}`}
                                                    type="button"
                                                    onClick={() => toggleAccordion(participant.userId)}
                                                >
                                                    <div className="d-flex align-items-center">
                                                        <strong>{participant.username}</strong>
                                                    </div>
                                                </button>
                                            </h2>
                                            <div
                                                className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
                                            >
                                                <div className="accordion-body p-0">
                                                    <ul className="list-group list-group-flush">
                                                        {poll.questions.map((q, index) => {
                                                            let rawAnswer = participant.answers[q.id];
                                                            let displayAnswer = rawAnswer;

                                                            if (q.type === 'boolean') {
                                                                displayAnswer = rawAnswer === 'true' ? 'True' : (rawAnswer === 'false' ? 'False' : 'Unanswered');
                                                            }

                                                            return (
                                                                <li className="list-group-item p-4" key={q.id}>
                                                                    <div className="text-muted small mb-1">
                                                                        <span className="badge questionNumber me-2">Q{index + 1}</span>
                                                                        {q.text}
                                                                    </div>
                                                                    <div className="fw-bold mt-2 fs-5 me-2 answers">
                                                                        {displayAnswer ? (
                                                                            <span >{displayAnswer}</span>
                                                                        ) : (
                                                                            <span style={{color : '#38bdf8'}} className={fst-italic}> Skipped</span>
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