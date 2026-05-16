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
            try {
                // here i will attach the spring boot api to fetch the poll from the database
                let fetchedPolls = [
                    { id: 1, title: 'Critical Thinking', dueDate: '2026-06-01T14:00:00', questionCount: 6 },
                    { id: 2, title: 'AI Hackathon', dueDate: '2026-05-20T12:00:00', questionCount: 7 },
                    { id: 3, title: 'Database Query', dueDate: '2026-07-15T23:59:00', questionCount: 9 },


                ];

                fetchedPolls.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));

                setPolls(fetchedPolls);
            } catch (err) {
                setError('Failed to load pending polls. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPendingPolls();
    }, []);

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
                    <div className="alert shadow-sm" role="alert">
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
                        <p className="mb-0 text-light">Empty!</p>
                    </div>
                ) : (
                    <div>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {polls.map((poll) => (
                                <div className="col" key={poll.id}>
                                    <div className="card h-100 cardBackgroundColor CardHovering shadow">
                                        <div className="card-body d-flex flex-column p-4">

                                            <div className="mb-3">
                                                <h5 className="card-title pollTitle">
                                                    <span>{poll.title}</span>
                                                </h5>
                                            </div>

                                            <div className="mt-2 mb-4 cardInsideCard">
                                                <div className="d-flex align-items-center mb-2">
                                                    <div>
                                                        <span className="textColor1">Due: </span>
                                                        <span className="dateText">{formatDate(poll.dueDate)}</span>
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-center">
                                                    <div>
                                                        <span className="textColor1">Questions: </span>
                                                        <span className="badge fs-5">{poll.questionCount}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-auto">
                                                <Link
                                                    to={`/poll/${poll.id}/participate`}
                                                    className="btn pollStartButton w-100"
                                                >
                                                    Start Now
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}