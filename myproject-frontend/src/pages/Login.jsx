import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/Login.css';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function loginUser(e) {
        e.preventDefault();
        const credentials = btoa(`${username}:${password}`);

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                localStorage.setItem('basicAuthToken', credentials);
                console.log("signup successfull");
                navigate('/dashboard');
            } else {
                console.error('Invalid credentials');
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    }

    return (
        <div className="loginPage">
            <div className="loginArea">
                <h2 className="heading">Poll Manager</h2>

                <form onSubmit={loginUser}>
                    <div className="input">
                        <label className="label">Name</label>
                        <input
                            type="text"
                            className="text"
                            required
                            placeholder="Alex"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="input">
                        <label className="label">Password</label>
                        <input
                            type="password"
                            className="text"
                            required
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="loginButton">
                        Log In
                    </button>

                    <div className="signup">
                        <span className="signupText">New user? </span>
                        <Link to="/register" className="signupLink">Create an account</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}