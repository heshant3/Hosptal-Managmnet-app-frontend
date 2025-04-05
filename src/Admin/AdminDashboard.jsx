import { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
import styles from "../components/Dashboard.module.css";
import {
  Users,
  UserCheck,
  Calendar,
  Building,
  Activity,
  Settings,
} from "lucide-react";

const AdminDashboard = () => {
  //   const { currentUser } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetching data
    setTimeout(() => {
      setDoctors([
        {
          id: 1,
          name: "Dr. Sarah Johnson",
          specialty: "Cardiologist",
          patients: 78,
          appointments: 12,
          status: "active",
        },
        {
          id: 2,
          name: "Dr. Michael Patel",
          specialty: "Dermatologist",
          patients: 65,
          appointments: 8,
          status: "active",
        },
        {
          id: 3,
          name: "Dr. Emma Wilson",
          specialty: "Neurologist",
          patients: 42,
          appointments: 5,
          status: "inactive",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className={`${styles.badge} ${styles.badgeGreen}`}>Active</span>
        );
      case "inactive":
        return (
          <span className={`${styles.badge} ${styles.badgeOrange}`}>
            Inactive
          </span>
        );
      default:
        return (
          <span className={`${styles.badge} ${styles.badgeBlue}`}>
            {status}
          </span>
        );
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
        <p className={styles.dashboardSubtitle}>
          Hospital management and overview
        </p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <UserCheck
              className={styles.statCardIcon}
              style={{ backgroundColor: "#E3F2FD", color: "#1976D2" }}
            />
            <span className={styles.statCardTitle}>Doctors</span>
          </div>
          <div className={styles.statCardValue}>{doctors.length}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Users
              className={styles.statCardIcon}
              style={{ backgroundColor: "#E8F5E9", color: "#2E7D32" }}
            />
            <span className={styles.statCardTitle}>Patients</span>
          </div>
          <div className={styles.statCardValue}>256</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Calendar
              className={styles.statCardIcon}
              style={{ backgroundColor: "#FFF3E0", color: "#E65100" }}
            />
            <span className={styles.statCardTitle}>Appointments Today</span>
          </div>
          <div className={styles.statCardValue}>18</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Building
              className={styles.statCardIcon}
              style={{ backgroundColor: "#E1F5FE", color: "#0288D1" }}
            />
            <span className={styles.statCardTitle}>Departments</span>
          </div>
          <div className={styles.statCardValue}>8</div>
        </div>
      </div>

      <div className={styles.actionsContainer}>
        <div className={styles.actionCard}>
          <UserCheck className={styles.actionIcon} />
          <h3 className={styles.actionTitle}>Manage Doctors</h3>
          <p className={styles.actionDesc}>Add or update doctor profiles</p>
        </div>

        <div className={styles.actionCard}>
          <Users className={styles.actionIcon} />
          <h3 className={styles.actionTitle}>Manage Patients</h3>
          <p className={styles.actionDesc}>Handle patient accounts</p>
        </div>

        <div className={styles.actionCard}>
          <Activity className={styles.actionIcon} />
          <h3 className={styles.actionTitle}>Hospital Stats</h3>
          <p className={styles.actionDesc}>View detailed analytics</p>
        </div>

        <div className={styles.actionCard}>
          <Settings className={styles.actionIcon} />
          <h3 className={styles.actionTitle}>System Settings</h3>
          <p className={styles.actionDesc}>Configure hospital settings</p>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Doctor Directory</h2>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingIcon}></div>
          <p>Loading doctors...</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialty</th>
                <th>Patients</th>
                <th>Appointments</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.name}</td>
                  <td>{doctor.specialty}</td>
                  <td>{doctor.patients}</td>
                  <td>{doctor.appointments}</td>
                  <td>{getStatusBadge(doctor.status)}</td>
                  <td>
                    <button
                      className={`${styles.button} ${styles.primaryButton}`}
                    >
                      Edit
                    </button>
                    <button
                      className={`${styles.button} ${
                        doctor.status === "active"
                          ? styles.dangerButton
                          : styles.successButton
                      }`}
                      style={{ marginLeft: "8px" }}
                    >
                      {doctor.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
