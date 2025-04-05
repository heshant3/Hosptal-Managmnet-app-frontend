import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Navbar.module.css";
import { Hospital, User, Menu, X } from "lucide-react";

const Navbar = () => {
  const { currentUser, logout, register } = useAuth() || {}; // Add fallback to prevent destructuring undefined
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (logout) {
      logout();
      navigate("/login");
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link
          to={currentUser ? "/dashboard" : "/"}
          className={styles.logoContainer}
        >
          <Hospital className={styles.logoIcon} />
          <span className={styles.logoText}>MedConnect</span>
        </Link>

        <div className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </div>

        <div
          className={`${styles.navLinks} ${
            mobileMenuOpen ? styles.mobileActive : ""
          }`}
        >
          {currentUser ? (
            <>
              {currentUser.role === "patient" && (
                <>
                  <Link to="/patient" className={styles.navLink}>
                    Dashboard
                  </Link>
                  <Link to="/" className={styles.navLink}>
                    Find Doctor
                  </Link>
                </>
              )}
              {currentUser.role === "doctor" && (
                <Link to="/doctor" className={styles.navLink}>
                  Dashboard
                </Link>
              )}
              {currentUser.role === "admin" && (
                <Link to="/admin" className={styles.navLink}>
                  Dashboard
                </Link>
              )}
              <div className={styles.userInfo}>
                <User className={styles.userIcon} />
                <span>{currentUser.name}</span>
              </div>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>
                Login
              </Link>
              {register && (
                <Link to="/register" className={styles.navLink}>
                  Register
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
