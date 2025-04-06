import { useState, useEffect } from "react";
import { gql, useLazyQuery } from "@apollo/client"; // Import Apollo Client
import styles from "../components/Dashboard.module.css";
import {
  Users,
  UserCheck,
  Calendar,
  Building,
  Activity,
  Settings,
} from "lucide-react";

const GET_DOCTORS_DETAILS = gql`
  query {
    getAllDoctorsDetails {
      doctors {
        id
        name
        specialization
        contact
      }
      totalCount
    }
  }
`;

const GET_PATIENTS_DETAILS = gql`
  query {
    getAllPatientsDetails {
      patients {
        id
        name
        address
        dob
      }
      totalCount
    }
  }
`;

const GET_APPOINTMENTS_DETAILS = gql`
  query {
    getAllAppointmentsDetails {
      appointments {
        id
        doc_name
        patient_name
        available_day
        status
      }
      totalCount
    }
  }
`;

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [fetchDoctors, { data, loading: doctorsLoading }] =
    useLazyQuery(GET_DOCTORS_DETAILS);
  const [fetchPatients, { data: patientData, loading: patientsLoading }] =
    useLazyQuery(GET_PATIENTS_DETAILS);
  const [
    fetchAppointments,
    { data: appointmentData, loading: appointmentsLoading },
  ] = useLazyQuery(GET_APPOINTMENTS_DETAILS);

  useEffect(() => {
    fetchDoctors();
    fetchPatients(); // Fetch patient details on component mount
    fetchAppointments(); // Fetch appointment details on component mount
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

  const handleCardClick = (card) => {
    setSelectedCard(card);
    if (card === "doctors") {
      fetchDoctors();
    } else if (card === "patients") {
      fetchPatients();
    } else if (card === "appointments") {
      fetchAppointments();
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
          <div className={styles.statCardValue}>
            {data?.getAllDoctorsDetails?.totalCount || 0}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Users
              className={styles.statCardIcon}
              style={{ backgroundColor: "#E8F5E9", color: "#2E7D32" }}
            />
            <span className={styles.statCardTitle}>Patients</span>
          </div>
          <div className={styles.statCardValue}>
            {patientData?.getAllPatientsDetails?.totalCount || 0}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Calendar
              className={styles.statCardIcon}
              style={{ backgroundColor: "#FFF3E0", color: "#E65100" }}
            />
            <span className={styles.statCardTitle}>Appointments </span>
          </div>
          <div className={styles.statCardValue}>
            {appointmentData?.getAllAppointmentsDetails?.totalCount || 0}
          </div>
        </div>
      </div>

      <div className={styles.actionsContainer}>
        <div
          className={styles.actionCard}
          onClick={() => handleCardClick("doctors")}
          style={{ cursor: "pointer" }}
        >
          <UserCheck className={styles.actionIcon} />
          <h3 className={styles.actionTitle}>Doctors List</h3>
        </div>

        <div
          className={styles.actionCard}
          onClick={() => handleCardClick("patients")}
          style={{ cursor: "pointer" }}
        >
          <Users className={styles.actionIcon} />
          <h3 className={styles.actionTitle}>Patients List</h3>
        </div>

        <div
          className={styles.actionCard}
          onClick={() => handleCardClick("appointments")}
          style={{ cursor: "pointer" }}
        >
          <Activity className={styles.actionIcon} />
          <h3 className={styles.actionTitle}>Appointments Stats</h3>
        </div>
      </div>

      {selectedCard === "doctors" && (
        <div>
          <h2 className={styles.sectionTitle}>Doctors Details</h2>
          {doctorsLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingIcon}></div>
              <p>Loading doctors...</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.getAllDoctorsDetails?.doctors.map((doctor) => (
                    <tr key={doctor.id}>
                      <td>{doctor.id}</td>
                      <td>{doctor.name}</td>
                      <td>{doctor.specialization}</td>
                      <td>{doctor.contact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {selectedCard === "patients" && (
        <div>
          <h2 className={styles.sectionTitle}>Patients Details</h2>
          {patientsLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingIcon}></div>
              <p>Loading patients...</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Date of Birth</th>
                  </tr>
                </thead>
                <tbody>
                  {patientData?.getAllPatientsDetails?.patients.map(
                    (patient) => (
                      <tr key={patient.id}>
                        <td>{patient.id}</td>
                        <td>{patient.name}</td>
                        <td>{patient.address}</td>
                        <td>{patient.dob}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {selectedCard === "appointments" && (
        <div>
          <h2 className={styles.sectionTitle}>Appointments Details</h2>
          {appointmentsLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingIcon}></div>
              <p>Loading appointments...</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Doctor Name</th>
                    <th>Patient Name</th>
                    <th>Available Day</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentData?.getAllAppointmentsDetails?.appointments.map(
                    (appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.id}</td>
                        <td>{appointment.doc_name}</td>
                        <td>{appointment.patient_name}</td>
                        <td>{appointment.available_day}</td>
                        <td>{appointment.status}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
