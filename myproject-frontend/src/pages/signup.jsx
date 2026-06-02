import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/signup.css';

export default function Signup() {
    const navigate = useNavigate();
        const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function register(e) {
      e.preventDefault();

      try {
        const response = await fetch('http://localhost:8080/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          console.log('Signup successfulll!');
          navigate('/login');
        } else {
          console.error('Signup failed');
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    }

    return (
        <div className="fullPage">
            <div className="box">
                <div className="Heading">Create Account</div>

                <form onSubmit={register}>
                    <div className="label">
                        <label className="inputingtext">Name</label>
                        <input
                            type="text"
                            className="textstyle"
                            required
                            placeholder="Alex"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="label">
                        <label className="inputingtext">Password</label>
                        <input
                            type="password"
                            className="textstyle"
                            required
                            placeholder="******"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="submit">
                        Register
                    </button>

                    <div className="loginOption">
                        <span className="logintext">Already have an account? </span>
                        <Link to="/login" className="link">Log in here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}