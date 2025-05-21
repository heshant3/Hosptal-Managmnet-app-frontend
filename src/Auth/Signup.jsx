import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import styles from "./Auth.module.css";
import { Hospital, Mail, Lock, Loader } from "lucide-react";

const ADD_PATIENT_MUTATION = gql`
  mutation AddPatient($email: String!, $password: String!) {
    addPatient(email: $email, password: $password) {
      id
      email
      created_at
    }
  }
`;

const ADD_DOCTOR_MUTATION = gql`
  mutation AddDoctor($email: String!, $password: String!) {
    addDoctor(email: $email, password: $password) {
      id
      email
      created_at
    }
  }
`;

const ADD_ADMIN_MUTATION = gql`
  mutation AddAdmin($email: String!, $password: String!) {
    addAdmin(email: $email, password: $password) {
      id
      email
    }
  }
`;

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [addPatient] = useMutation(ADD_PATIENT_MUTATION);
  const [addDoctor] = useMutation(ADD_DOCTOR_MUTATION);
  const [addAdmin] = useMutation(ADD_ADMIN_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (role === "patient") {
        await addPatient({ variables: { email, password } });
        navigate("/login");
      } else if (role === "doctor") {
        await addDoctor({ variables: { email, password } });
        navigate("/login");
      } else if (role === "admin") {
        await addAdmin({ variables: { email, password } });
        navigate("/login");
      }
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <Hospital className={styles.authLogo} />
          <h1>Create an Account</h1>
          <p>Join MedConnect to manage your healthcare</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {error && <div className={styles.errorMessage}>{error}</div>}

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
            <label htmlFor="role">Register as</label>
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
                  Creating account...
                </>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>

        <div className={styles.authFooter}>
          <p>
            Already have an account?{" "}
            <Link to="/" className={styles.authLink}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
