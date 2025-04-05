import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../components/Dashboard.module.css";
import { Calendar, Users, Clock, CalendarCheck, Star } from "lucide-react";
import DetailsDialog from "../components/DetailsDialog";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock fetching appointments
    setTimeout(() => {
      setAppointments([
        {
          id: 1,
          patientName: "John Smith",
          date: "2025-04-10",
          time: "10:00 AM",
          reason: "Regular checkup",
          status: "confirmed",
          patientAge: 42,
          patientGender: "Male",
          patientContact: "(555) 123-4567",
          medicalHistory: "Hypertension, Type 2 Diabetes",
          location: "Main Hospital, Room 305",
          duration: "30 minutes",
        },
        {
          id: 2,
          patientName: "Emily Johnson",
          date: "2025-04-10",
          time: "11:30 AM",
          reason: "Consultation",
          status: "confirmed",
          patientAge: 35,
          patientGender: "Female",
          patientContact: "(555) 987-6543",
          medicalHistory: "Asthma",
          location: "Main Hospital, Room 305",
          duration: "45 minutes",
        },
        {
          id: 3,
          patientName: "Michael Brown",
          date: "2025-04-11",
          time: "9:15 AM",
          reason: "Follow-up",
          status: "pending",
          patientAge: 28,
          patientGender: "Male",
          patientContact: "(555) 456-7890",
          medicalHistory: "Recent knee surgery",
          location: "Orthopedic Clinic, Suite 110",
          duration: "30 minutes",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <span className={`${styles.badge} ${styles.badgeGreen}`}>
            Confirmed
          </span>
        );
      case "pending":
        return (
          <span className={`${styles.badge} ${styles.badgeOrange}`}>
            Pending
          </span>
        );
      case "cancelled":
        return (
          <span className={`${styles.badge} ${styles.badgeRed}`}>
            Cancelled
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

  const handleApprove = (id) => {
    setAppointments(
      appointments.map((app) =>
        app.id === id ? { ...app, status: "confirmed" } : app
      )
    );
  };

  const handleReject = (id) => {
    setAppointments(
      appointments.map((app) =>
        app.id === id ? { ...app, status: "cancelled" } : app
      )
    );
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleSetAvailability = () => {
    navigate("/doctor/availability");
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Welcome</h1>
        <p className={styles.dashboardSubtitle}>
          Manage your appointments and schedule
        </p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Calendar
              className={styles.statCardIcon}
              style={{ backgroundColor: "#E3F2FD", color: "#1976D2" }}
            />
            <span className={styles.statCardTitle}>Today's Appointments</span>
          </div>
          <div className={styles.statCardValue}>2</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Users
              className={styles.statCardIcon}
              style={{ backgroundColor: "#E8F5E9", color: "#2E7D32" }}
            />
            <span className={styles.statCardTitle}>Total Patients</span>
          </div>
          <div className={styles.statCardValue}>124</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Clock
              className={styles.statCardIcon}
              style={{ backgroundColor: "#FFF3E0", color: "#E65100" }}
            />
            <span className={styles.statCardTitle}>Pending Requests</span>
          </div>
          <div className={styles.statCardValue}>
            {appointments.filter((app) => app.status === "pending").length}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Star
              className={styles.statCardIcon}
              style={{ backgroundColor: "#FFF8E1", color: "#FFA000" }}
            />
            <span className={styles.statCardTitle}>Rating</span>
          </div>
          <div className={styles.statCardValue}>4.8</div>
        </div>
      </div>

      <div className={styles.actionsContainer}>
        <div className={styles.actionCard} onClick={handleSetAvailability}>
          <CalendarCheck className={styles.actionIcon} />
          <h3 className={styles.actionTitle}>Set Availability</h3>
          <p className={styles.actionDesc}>Update your working hours</p>
        </div>

        <Link to="/doctor/profile" className={styles.actionCard}>
          <Users className={styles.actionIcon} />
          <h3 className={styles.actionTitle}>My Profile</h3>
          <p className={styles.actionDesc}>View or update your profile</p>
        </Link>
      </div>

      <h2 className={styles.sectionTitle}>Upcoming Appointments</h2>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingIcon}></div>
          <p>Loading appointments...</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.patientName}</td>
                  <td>{new Date(appointment.date).toLocaleDateString()}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.reason}</td>
                  <td>{getStatusBadge(appointment.status)}</td>
                  <td>
                    {appointment.status === "pending" ? (
                      <>
                        <button
                          className={`${styles.button} ${styles.successButton}`}
                          onClick={() => handleApprove(appointment.id)}
                        >
                          Approve
                        </button>
                        <button
                          className={`${styles.button} ${styles.dangerButton}`}
                          style={{ marginLeft: "8px" }}
                          onClick={() => handleReject(appointment.id)}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        className={`${styles.button} ${styles.primaryButton}`}
                        onClick={() => handleViewAppointment(appointment)}
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedAppointment && (
        <DetailsDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title="Appointment Details"
          description="Complete information about the patient appointment"
          details={[
            { label: "Patient Name", value: selectedAppointment.patientName },
            { label: "Age", value: selectedAppointment.patientAge },
            { label: "Gender", value: selectedAppointment.patientGender },
            { label: "Contact", value: selectedAppointment.patientContact },
            {
              label: "Date",
              value: new Date(selectedAppointment.date).toLocaleDateString(),
            },
            { label: "Time", value: selectedAppointment.time },
            { label: "Duration", value: selectedAppointment.duration },
            { label: "Location", value: selectedAppointment.location },
            { label: "Purpose", value: selectedAppointment.reason },
            {
              label: "Status",
              value: getStatusBadge(selectedAppointment.status),
            },
            {
              label: "Medical History",
              value: selectedAppointment.medicalHistory,
            },
          ]}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
