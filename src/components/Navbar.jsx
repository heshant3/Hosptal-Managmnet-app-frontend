import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import { Hospital, User, Menu, X } from "lucide-react";

const Navbar = () => {
  const [userRole, setUserRole] = useState(null); // Track the logged-in role
  const navigate = useNavigate();
  const location = useLocation(); // Track navigation events
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchUserRole = () => {
    const patientId = localStorage.getItem("patientId");
    const doctorId = localStorage.getItem("doctorId");
    const adminId = localStorage.getItem("adminId");

    if (patientId) setUserRole("patient");
    else if (doctorId) setUserRole("doctor");
    else if (adminId) setUserRole("admin");
    else setUserRole(null);
  };

  useEffect(() => {
    fetchUserRole(); // Fetch user role on component mount or navigation
  }, [location]);

  const handleLogout = () => {
    localStorage.clear(); // Clear all local storage
    setUserRole(null); // Reset user role
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link
          to={userRole ? `/${userRole}` : "/"}
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
          {userRole ? (
            <>
              <Link to={`/${userRole}`} className={styles.navLink}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>
                Login
              </Link>
              <Link to="/register" className={styles.navLink}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
