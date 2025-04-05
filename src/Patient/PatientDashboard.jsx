import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../components/Dashboard.module.css";
import { Calendar, Users, Clock, Stethoscope, User } from "lucide-react";
import DetailsDialog from "../components/DetailsDialog";

const PatientDashboard = () => {
  const currentUser = { name: "John Doe" }; // Mock user object
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Mock fetching appointments
    setTimeout(() => {
      setAppointments([]); // Empty appointments for testing
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

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const getAppointmentDetails = (appointment) => {
    return [
      { label: "Doctor", value: appointment.doctorName },
      { label: "Specialty", value: appointment.specialty },
      { label: "Date", value: new Date(appointment.date).toLocaleDateString() },
      { label: "Time", value: appointment.time },
      { label: "Duration", value: appointment.duration },
      { label: "Location", value: appointment.location },
      { label: "Status", value: getStatusBadge(appointment.status) },
      { label: "Notes", value: appointment.notes },
    ];
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Welcome, {currentUser.name}</h1>
        <p className={styles.dashboardSubtitle}>
          Manage your appointments and health information
        </p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Calendar
              className={styles.statCardIcon}
              style={{ backgroundColor: "#E3F2FD", color: "#1976D2" }}
            />
            <span className={styles.statCardTitle}>Upcoming Appointments</span>
          </div>
          <div className={styles.statCardValue}>
            {appointments.filter((app) => app.status !== "cancelled").length}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Clock
              className={styles.statCardIcon}
              style={{ backgroundColor: "#FFF3E0", color: "#E65100" }}
            />
            <span className={styles.statCardTitle}>Pending Approvals</span>
          </div>
          <div className={styles.statCardValue}>
            {appointments.filter((app) => app.status === "pending").length}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Stethoscope
              className={styles.statCardIcon}
              style={{ backgroundColor: "#E8F5E9", color: "#2E7D32" }}
            />
            <span className={styles.statCardTitle}>Completed Visits</span>
          </div>
          <div className={styles.statCardValue}>3</div>
        </div>
      </div>

      <div className={styles.actionsContainer}>
        <Link to="/doctor-search" className={styles.actionCard}>
          <Users className={styles.actionIcon} />
          <h3 className={styles.actionTitle}>Find a Doctor</h3>
          <p className={styles.actionDesc}>Search for doctors by specialty</p>
        </Link>

        <div className={styles.actionCard}>
          <Calendar className={styles.actionIcon} />
          <h3 className={styles.actionTitle}>Book Appointment</h3>
          <p className={styles.actionDesc}>Schedule your next visit</p>
        </div>

        <Link to="/patient/profile" className={styles.actionCard}>
          <User className={styles.actionIcon} />
          <h3 className={styles.actionTitle}>My Profile</h3>
          <p className={styles.actionDesc}>Update your information</p>
        </Link>
      </div>

      <h2 className={styles.sectionTitle}>Your Appointments</h2>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingIcon}></div>
          <p>Loading appointments...</p>
        </div>
      ) : appointments.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Specialty</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.doctorName}</td>
                  <td>{appointment.specialty}</td>
                  <td>{new Date(appointment.date).toLocaleDateString()}</td>
                  <td>{appointment.time}</td>
                  <td>{getStatusBadge(appointment.status)}</td>
                  <td>
                    <button
                      variant="default"
                      onClick={() => handleViewAppointment(appointment)}
                      className="mr-2"
                    >
                      View Details
                    </button>
                    {appointment.status === "pending" && (
                      <b variant="destructive">Cancel</b>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Calendar className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>No appointments yet</h3>
          <p className={styles.emptyDesc}>
            You don't have any upcoming appointments. Schedule your first
            appointment now.
          </p>
          <Link
            to="/doctor-search"
            className={`${styles.button} ${styles.primaryButton}`}
          >
            Find a Doctor
          </Link>
        </div>
      )}

      {selectedAppointment && (
        <DetailsDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title="Appointment Details"
          description="Complete information about your appointment"
          details={getAppointmentDetails(selectedAppointment)}
        />
      )}
    </div>
  );
};

export default PatientDashboard;
