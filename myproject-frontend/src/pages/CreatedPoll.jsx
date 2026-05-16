import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

    // this list is a fake list. here spring boot api will added which will fetch the user from the databse
    const [usersList, setUsersList] = useState([
        { id: 101, name: 'Alex', invited: false },
        { id: 102, name: 'Henry', invited: true },
    ]);

    useEffect(() => {
        const fetchPendingPolls = async () => {
            try {
                // here i will attach the spring boot api to fetch the polls to solve from the database
                let fetchedPolls = [
                    { id: 1, title: 'Critical Thinking', dueDate: '2026-06-01T14:00:00', questionCount: 6, invitedCount: 12, solvedCount: 4 },
                    { id: 2, title: 'AI Hackathon', dueDate: '2026-05-20T12:00:00', questionCount: 7, invitedCount: 45, solvedCount: 38 },
                    { id: 3, title: 'Database Query', dueDate: '2026-07-15T23:59:00', questionCount: 9, invitedCount: 5, solvedCount: 0 },
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


    const openInvitePopUp = (pollId) => {
        setSelectedPoll(pollId);
        setShowPopUp(true);
        setSearchTxt('');
    };

    const closePopUp = () => {
        setShowPopUp(false);
        setSelectedPoll(null);
    }

    const handleInviteUser = (userId) => {
        // Just a fake toggle for the UI
        setUsersList(usersList.map(u => u.id === userId ? { ...u, invited: true } : u));
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
                                                        <span className="textColor1">Invited: </span>
                                                        <span className="dateText">{poll.invitedCount} people</span>
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-center mb-2">
                                                    <div>
                                                        <span className="textColor1">Solved: </span>
                                                        <span className="dateText">{poll.solvedCount}</span>
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
                                                <div>
                                                    <button
                                                        className="btn btn-outline-info w-100"
                                                        onClick={() => openInvitePopUp(poll.id)}
                                                    >
                                                        Invite People
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
                                // lablel: "Search users"
                                placeholder="Search user"
                                value={searchTxt}
                                onChange={(e) => setSearchTxt(e.target.value)}
                            />
                        </div>

                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {usersList
                                .map(user => (
                                    <div key={user.id} className="d-flex justify-content-between align-items-center p-2 mb-2" style={{ borderBottom: '1px solid #334155' }}>
                                        <div>
                                            <div className="text-light fs-5">{user.name}</div>
                                        </div>
                                        <div>
                                            {user.invited ? (
                                                <button className="btn btn-sm btn-secondary" disabled>Invited</button>
                                            ) : (
                                                <button className="btn btn-sm btn-primary" onClick={() => handleInviteUser(user.id)}>
                                                    + Invite
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            {usersList.filter(u => u.name.toLowerCase().includes(searchTxt.toLowerCase())).length === 0 && (
                                <div className="text-center text-muted mt-4">
                                    <p>No users found.</p>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'none' }}>ghost div</div>

                    </div>
                </div>
            )}
            <div style={{display: 'none'}}></div>
        </div>
    );
}