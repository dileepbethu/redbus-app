import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar  navbar-expand-lg navbar-light bg-light px-4 shadow-sm">
      <Link className="navbar-brand text-danger fw-bold" to="/">
        🚌 RedBus Clone
      </Link>
      <nav className="p-2 ms-auto">
        {!currentUser ? (
          <>
           <Link className="btn btn-danger me-2"to="/">Home</Link>
            <Link className="btn btn-danger me-2" to="/mybookings">My Bookings</Link>
            <Link className="btn btn-danger me-2" to="/login">Login</Link>
            <Link className="btn btn-danger" to="/signup">Sign Up</Link>
        
          </>
        ) : (
          <>
            {/* ✅ Use Link instead of button */}
                      <span className="text-dark me-3">Hi, {currentUser.name}</span>

            <Link className="btn btn-danger me-2" to="/mybookings">My Bookings</Link>
                
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </>
        )}
      </nav>
      
      
    </header>
  );
};

export default Header;

