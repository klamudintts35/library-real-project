import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  // logout button ka logic
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-left">
        <h2 className="header-logo">Library Admin</h2>
        {admin?.name && <p className="header-admin">Hi, {admin.name}</p>}
      </div>

      <div className="header-right">
        <button className="header-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;