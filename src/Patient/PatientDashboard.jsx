import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../components/Dashboard.module.css";
import { Calendar, Users, Clock, Stethoscope, User } from "lucide-react";
import DetailsDialog from "../components/DetailsDialog";
import { useQuery, gql } from "@apollo/client";
import Chat from "../AIChat/Chat"; // Import AIChat component

const GET_APPOINTMENTS_BY_PATIENT_ID = gql`
  query GetAppointmentsByPatientId($patientId: Int!) {
    getAppointmentsByPatientId(patient_id: $patientId) {
      id
      doc_name
      hospital_name
      available_day
      session_time
      reason
      yourTime
      doc_specialist
      appointment_number
    }
  }
`;

const PatientDashboard = () => {
  const currentUser = { name: "" }; // Mock user object
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const patientId = parseInt(localStorage.getItem("patientId"), 10);

  const { data, loading, error, refetch } = useQuery(
    GET_APPOINTMENTS_BY_PATIENT_ID,
    {
      variables: { patientId },
      skip: !patientId, // Skip query if patientId is not available
    }
  );

  useEffect(() => {
    if (patientId) {
      refetch(); // Refetch data when the page loads
    }
  }, [patientId, refetch]);

  useEffect(() => {
    if (data && data.getAppointmentsByPatientId) {
      const fetchedAppointments = data.getAppointmentsByPatientId.map(
        (appointment) => ({
          id: appointment.id,
          doctorName: appointment.doc_name,
          specialty: appointment.doc_specialist,
          date: new Date(parseInt(appointment.available_day, 10)), // Convert timestamp to Date
          time: appointment.yourTime,
          duration: "30 mins", // Placeholder duration
          location: appointment.hospital_name, // Placeholder location
          status: appointment.appointment_number, // Use appointment_number for status
          notes: appointment.reason,
          appointment_number: appointment.appointment_number,
        })
      );
      setAppointments(fetchedAppointments);
    }
  }, [data]);

  const handleViewAppointment = (appointment) => {
    console.log("Appointment ID:", appointment.id); // Log the appointment ID
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const getAppointmentDetails = (appointment) => {
    return [
      { label: "Appointment ID", value: appointment.id }, // New field for Appointment ID
      { label: "Doctor", value: appointment.doctorName },
      { label: "Specialty", value: appointment.specialty },
      { label: "Date", value: new Date(appointment.date).toLocaleDateString() },
      { label: "Time", value: appointment.time },
      { label: "Duration", value: appointment.duration },
      { label: "Location", value: appointment.location },
      { label: "Notes", value: appointment.notes },
      { label: "Appointment Number", value: appointment.appointment_number },
    ];
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Error fetching appointments: {error.message}</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <Chat />
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Welcome {currentUser.name}</h1>
        <p className={styles.dashboardSubtitle}>
          Manage your appointments and health information
        </p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Stethoscope
              className={styles.statCardIcon}
              style={{ backgroundColor: "#E3F2FD", color: "#1976D2" }}
            />
            <span className={styles.statCardTitle}>Total Appointments</span>
          </div>
          <div className={styles.statCardValue}>
            {appointments.filter((app) => app.status !== "cancelled").length}
          </div>
        </div>

        {/* <div className={styles.statCard}>
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
        </div> */}

        {/* <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Stethoscope
              className={styles.statCardIcon}
              style={{ backgroundColor: "#E8F5E9", color: "#2E7D32" }}
            />
            <span className={styles.statCardTitle}>Completed Visits</span>
          </div>
          <div className={styles.statCardValue}>3</div>
        </div> */}
      </div>

      <div className={styles.actionsContainer}>
        <Link to="/" className={styles.actionCard}>
          <Users className={styles.actionIcon} />
          <h3 className={styles.actionTitle}>Find a Doctor</h3>
          <p className={styles.actionDesc}>Search for doctors by specialty</p>
        </Link>

        {/* <div className={styles.actionCard}>
          <Calendar className={styles.actionIcon} />
          <h3 className={styles.actionTitle}>Book Appointment</h3>
          <p className={styles.actionDesc}>Schedule your next visit</p>
        </div> */}

        <Link to="/patient/profile" className={styles.actionCard}>
          <User className={styles.actionIcon} />
          <h3 className={styles.actionTitle}>My Profile</h3>
          <p className={styles.actionDesc}>Update your information</p>
        </Link>
      </div>

      <h2 className={styles.sectionTitle}>Total Appointments</h2>

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
                <th>Ap.No.</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>Dr.{appointment.doctorName}</td>
                  <td>{appointment.specialty}</td>
                  <td>{new Date(appointment.date).toLocaleDateString()}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.status}</td>
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
          <Link to="/" className={`${styles.button} ${styles.primaryButton}`}>
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
