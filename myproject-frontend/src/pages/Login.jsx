import { Link, useNavigate } from 'react-router-dom';
import '../components/Login.css';

export default function Login() {
    const navigate = useNavigate();

    const login = (e) => {
        e.preventDefault();
        // login api (localhost:8080/login)
        navigate('/dashboard');
    };

    return (
        <div className="loginPage">
            <div className="loginArea">
                <h2 className="heading">Poll Manager</h2>

                <form onSubmit={login} >
                    <div className="input">
                        <label className="label">Name</label>
                        <input
                            type="text"
                            className="text"
                            required
                            placeholder="Alex"
                        />
                    </div>

                    <div className="input">
                        <label className="label">Password</label>
                        <input
                            type="password"
                            className="text"
                            required
                            placeholder="********"
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