import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/PendingPolls.css';
import Navbar from "./Navbar.jsx";

export default function PendingPolls() {
    const navigate = useNavigate();
    const [polls, setPolls] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPendingPolls = async () => {
            const token = localStorage.getItem('basicAuthToken');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/poll/pending', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Basic ${token}`,
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                if (response.ok) {
                    let fetchedPolls = await response.json();
                    fetchedPolls.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                    setPolls(fetchedPolls);
                } else if (response.status === 401) {
                    setError('Authentication failed. Please log in again.');
                } else {
                    setError('Failed to load pending polls.');
                }
            } catch (err) {
                setError('Network error. Is the server running?');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPendingPolls();
    }, [navigate]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="min-vh-100 pageBackground text-light ">
            <Navbar />
            <main className="container max-w-4xl py-3">
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <h2 className="title mb-0">My Pending Polls</h2>
                    </div>
                </div>

                {error && (
                    <div className="alert shadow-sm alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center mt-5 py-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text1">Fetching your polls...</p>
                    </div>
                ) : polls.length === 0 ? (
                    <div className="card text-center p-5 lightPageBackground">
                        <p className="mb-0 text-light">Empty! You have no pending polls to solve.</p>
                    </div>
                ) : (
                    <div>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {polls.map((poll) => {
                                const isExpired = new Date(poll.dueDate) < new Date();

                                return (
                                    <div className="col" key={poll.id}>
                                        <div className="card h-100 cardBackgroundColor CardHovering shadow">
                                            <div className="card-body d-flex flex-column p-4">

                                                <div className="mb-3 d-flex justify-content-between align-items-start">
                                                    <h5 className="card-title pollTitle">
                                                        <span>{poll.title}</span>
                                                    </h5>
                                                    <div>
                                                        {poll.anonymous && (
                                                            <span className="badge bg-secondary ms-1" style={{ fontSize: '0.7rem' }}>Anonymous</span>
                                                        )}
                                                        {isExpired && (
                                                            <span className="badge bg-danger ms-1" style={{ fontSize: '0.7rem' }}>Expired</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-2 mb-4 cardInsideCard">
                                                    <div className="d-flex align-items-center mb-2">
                                                        <div>
                                                            <span className="textColor1">Due: </span>
                                                            <span className={`dateText ${isExpired ? 'text-danger' : ''}`}>{formatDate(poll.dueDate)}</span>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex align-items-center">
                                                        <div>
                                                            <span className="textColor1">Questions: </span>
                                                            <span className="badge fs-5">{poll.numberOfQuestions}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-auto">
                                                    {isExpired ? (
                                                        <button className="btn btn-secondary w-100" disabled>
                                                            Poll Expired
                                                        </button>
                                                    ) : (
                                                        <Link to={`/poll/${poll.id}/participate`} className="btn pollStartButton w-100">
                                                            Start Now
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}