import { Link, useNavigate } from 'react-router-dom';
import '../components/Navbar.css';

export default function Navbar() {
    const navigate = useNavigate();

    const logout = () => {
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg headingBackground shadow-sm p-3">
            <div className="container">
                <div>
                    <div>
                        <Link to="/dashboard" className="navbar-brand mb-0 h1 textx text-decoration-none">
                            <span style={{color: '#38bdf8'}}>Poll</span> Manager
                        </Link>
                    </div>
                </div>
                <button className="btn logoutButton btn-sm" onClick={logout}>Log Out</button>
            </div>
        </nav>
    );
}