// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "./Navbar.css"
export default function Navbar() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { currentLanguage, changeLanguage, t } = useLanguage();

  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  const handleLogout = () => {
    removeCookie("token", { path: "/" }); //
    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <>
      {/* <style dangerouslySetInnerHTML={{ __html: navbarStyles }} /> */}
      <nav className="nav">
        <Link to="/" className="nav-brand">
          {t("Interview Prep")}
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link" data-page="welcome">
            {t("Home")}
          </Link>
          <Link to="/aptitude" className="nav-link" data-page="aptitude">
            {t("Aptitude")}
          </Link>
          <Link to="/technical" className="nav-link" data-page="technical">
            {t("Technical")}
          </Link>
          <Link
            to="/hr-interview"
            className="nav-link"
            data-page="hr-interview"
          >
            {t("HR Interview")}
          </Link>
          <Link
            to="/group-discussion"
            className="nav-link"
            data-page="group-discussion"
          >
            {t("Group Discussion")}
          </Link>
          <Link to="/coding" className="nav-link" data-page="coding">
            {t("Coding")}
          </Link>
          <Link to="/dashboard" className="nav-link" data-page="dashboard">
            {t("Dashboard")}
          </Link>
        </div>
        <button
          className="theme-toggle"
          onClick={() => toggleDarkMode(!isDarkMode)}
        >
          <i className={isDarkMode ? "fas fa-sun" : "fas fa-moon"}></i>
        </button>
        <button className="logoutBtn" onClick={handleLogout}>
          Logout
        </button>
        <div className="language-selector">
          <select
            className="form-control form-select"
            value={currentLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="mr">Marathi</option>
            <option value="ta">Tamil</option>
          </select>
        </div>
      </nav>
    </>
  );
}
