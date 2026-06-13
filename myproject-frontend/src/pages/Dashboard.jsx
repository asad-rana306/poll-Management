import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/Dashboard.css';
import Navbar from "./Navbar.jsx";

export default function Dashboard() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('basicAuthToken');
        if (token) {
            try {
                const decodedToken = atob(token);
                const extractedUsername = decodedToken.split(':')[0];
                setUsername(extractedUsername);
            } catch (error) {
                console.error("Failed to decode token", error);
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('basicAuthToken');
        navigate('/login');
    };

    return (
        <div className="min-vh-100 backgroundColor text-light">
            <Navbar/>
            <div className="container mt-5">
                <div className="row mb-5 align-items-center">
                    <div className="col">
                        <div>
                            <div className="welcome">
                                <h2 className="welcome text-capitalize">Welcome back, {username || 'User'}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-auto">
                        <Link to="/create-poll" className="btn cretingpoll">
                            <span>+ Create New Poll</span>
                        </Link>
                    </div>
                </div>
                <div>
                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <div className="card h-100 polls hovering">
                                <div className="card-body bodye d-flex flex-column justify-content-center align-items-center text-center">
                                    <div className="mb-3">
                                        <div className="icon">⏳</div>
                                    </div>
                                    <h5 className="mb-2 text1">Pending Polls</h5>
                                    <p className="text2 mb-4">See Your Pending Polls</p>

                                    <Link to="/pending-polls" className="btn poll-list w-75">
                                        View Pending Polls
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 mb-4">
                            <div className="card h-100 polls hovering">
                                <div className="card-body bodye d-flex flex-column justify-content-center align-items-center text-center">
                                    <div className="mb-3">
                                        <div className="icon">📝</div>
                                    </div>
                                    <h5 className="mb-2 text1">Created Poll</h5>
                                    <p className="text2 mb-4">See your Created Polls</p>

                                    <Link to="/created-poll" className="btn poll-list w-75">
                                        Created Polls
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 mt-2">
                            <div className="lastCard p-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        <div>
                                            <h6 className="mb-1 Answer-text">Answers of the Polls</h6>
                                            <small className="resultStatus">Click on the button on your right side and see the results there</small>
                                        </div>
                                    </div>
                                    <div>
                                        <Link to="/created-poll" className="btn btn-sm resultButton">
                                            Go to Polls
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}