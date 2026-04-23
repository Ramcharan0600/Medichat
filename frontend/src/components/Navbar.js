import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <nav className="navbar">
      <h1><Link to="/">LPU<span>Cure</span></Link></h1>
      <div className="links">
        {!user && <><Link to="/login">Login</Link><Link to="/register">Register</Link></>}
        {user && <>
          <Link to={`/${user?.role || "student"}`}>{(user?.role || "student").toUpperCase()} Dashboard</Link>
          <button onClick={() => { logout(); nav("/"); }}>Logout ({user?.name || "User"})</button>
        </>}
      </div>
    </nav>
  );
}
