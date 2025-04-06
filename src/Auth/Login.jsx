import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import { Hospital, Mail, Lock, Loader } from "lucide-react";
import { useMutation, gql } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    Login(email: $email, password: $password) {
      message
      patientId
    }
  }
`;

const LOGIN_DOCTOR_MUTATION = gql`
  mutation LoginDoctor($email: String!, $password: String!) {
    LoginDoctor(email: $email, password: $password) {
      message
      doctorId
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient"); // Add role state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [login, { error: gqlError }] = useMutation(LOGIN_MUTATION);
  const [loginDoctor, { error: gqlDoctorError }] = useMutation(
    LOGIN_DOCTOR_MUTATION
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (role === "doctor") {
        const response = await loginDoctor({ variables: { email, password } });
        setLoading(false);

        if (response.data.LoginDoctor.doctorId) {
          localStorage.setItem("doctorId", response.data.LoginDoctor.doctorId); // Save doctorId to local storage
          navigate("/doctor");
        } else {
          setError(response.data.LoginDoctor.message);
        }
      } else {
        const response = await login({ variables: { email, password } });
        setLoading(false);

        if (response.data.Login.patientId) {
          localStorage.setItem("patientId", response.data.Login.patientId); // Save patientId to local storage
          if (role === "admin") {
            navigate("/admin");
          } else {
            navigate("/patient");
          }
        } else {
          setError(response.data.Login.message);
        }
      }
    } catch (err) {
      setError("Failed to login. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <Hospital className={styles.authLogo} />
          <h1>Login to MedConnect</h1>
          <p>Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          {gqlError && (
            <div className={styles.errorMessage}>{gqlError.message}</div>
          )}
          {gqlDoctorError && (
            <div className={styles.errorMessage}>{gqlDoctorError.message}</div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <div className={styles.inputWithIcon}>
              <Mail className={styles.inputIcon} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputWithIcon}>
              <Lock className={styles.inputIcon} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="role">Login as</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={styles.selectInput}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className={styles.spinnerIcon} />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
