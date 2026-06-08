import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/CreatedPoll.css';
import Navbar from "./Navbar.jsx";

export default function CreatedPoll() {
    const navigate = useNavigate();
    const [polls, setPolls] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [showPopUp, setShowPopUp] = useState(false);
    const [searchTxt, setSearchTxt] = useState('');
    const [selectedPoll, setSelectedPoll] = useState(null);
    const [usersList, setUsersList] = useState([]);

    useEffect(() => {
        fetchCreatedPolls();
    }, []);

    const fetchCreatedPolls = async () => {
        const token = localStorage.getItem('basicAuthToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/poll/created', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPolls(data);
            } else {
                setError('Failed to load your polls.');
            }
        } catch (err) {
            setError('Network error. Is the server running?');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        const token = localStorage.getItem('basicAuthToken');
        try {
            const response = await fetch('http://localhost:8080/api/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const mappedUsers = data.map(u => ({ ...u, invited: false }));
                setUsersList(mappedUsers);
            }
        } catch (err) {
            console.error('Failed to fetch users', err);
        }
    };

    const openInvitePopUp = (pollId) => {
        setSelectedPoll(pollId);
        setShowPopUp(true);
        setSearchTxt('');
        fetchUsers();
    };

    const closePopUp = () => {
        setShowPopUp(false);
        setSelectedPoll(null);
    }

    const handleInviteUser = async (userId, username) => {
        const token = localStorage.getItem('basicAuthToken');

        try {
            const response = await fetch(`http://localhost:8080/api/poll/${selectedPoll}/invite`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username })
            });

            if (response.ok) {
                setUsersList(usersList.map(u => u.id === userId ? { ...u, invited: true } : u));
            } else {
                alert("Failed to invite user. They might already be invited.");
            }
        } catch (err) {
            console.error('Network error during invite', err);
        }
    };

    return (
        <div className="min-vh-100 pageBackground text-light ">
            <Navbar />
            <main className="container max-w-4xl py-3">
                <div>
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <h2 className="title mb-0">My Created Polls</h2>
                        </div>
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
                        <p className="mb-0 text-light">Empty! You haven't created any polls yet.</p>
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
                                                        <span className="textColor1">Due Date: </span>
                                                        <span className="dateText">{new Date(poll.dueDate).toLocaleDateString()}</span>
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
                                                <div>
                                                    <button
                                                        className="btn btn-outline-info w-100"
                                                        onClick={() => openInvitePopUp(poll.id)}
                                                        disabled={poll.isFinished}
                                                    >
                                                        {poll.isFinished ? 'Poll Closed' : 'Invite People'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {showPopUp && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div className="cardBackgroundColor p-4 rounded shadow-lg" style={{ width: '90%', maxWidth: '450px', border: '1px solid #334155' }}>

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="text-light mb-0">Invite to Poll</h4>
                            <button className="btn btn-sm btn-danger" onClick={closePopUp}>X</button>
                        </div>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control bg-dark text-light border-secondary searching"
                                placeholder="Search user"
                                value={searchTxt}
                                onChange={(e) => setSearchTxt(e.target.value)}
                            />
                        </div>

                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {usersList
                                .filter(u => u.username.toLowerCase().includes(searchTxt.toLowerCase()))
                                .map(user => (
                                    <div key={user.id} className="d-flex justify-content-between align-items-center p-2 mb-2" style={{ borderBottom: '1px solid #334155' }}>
                                        <div>
                                            <div className="text-light fs-5">{user.username}</div>
                                        </div>
                                        <div>
                                            {user.invited ? (
                                                <button className="btn btn-sm btn-secondary" disabled>Invited</button>
                                            ) : (
                                                <button className="btn btn-sm btn-primary" onClick={() => handleInviteUser(user.id, user.username)}>
                                                    + Invite
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            {usersList.filter(u => u.username.toLowerCase().includes(searchTxt.toLowerCase())).length === 0 && (
                                <div className="text-center text-muted mt-4">
                                    <p>No users found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}