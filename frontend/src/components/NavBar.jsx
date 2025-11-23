// src/components/NavBar.jsx
import { NavLink } from "react-router-dom";

export default function NavBar({ account, onConnect }) {
  const short = (a) => (a ? a.slice(0, 6) + "..." + a.slice(-4) : "");
  return (
    <nav className="navbar">
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Home</NavLink>
        <NavLink to="/register" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Register</NavLink>
        <NavLink to="/vote" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Vote</NavLink>
        <NavLink to="/results" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Results</NavLink>
        <NavLink to="/create" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Create</NavLink>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => window.open('/account', 'account-window', 'width=720,height=800')} className="button">Profile</button>
        <button onClick={onConnect} className="button button-primary">
          {account ? short(account) : "Connect Wallet"}
        </button>
      </div>
    </nav>
  );
}
