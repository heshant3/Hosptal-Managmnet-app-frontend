import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../components/Dashboard.module.css";
import {
  Calendar,
  Users,
  Clock,
  Stethoscope,
  User,
  AlertCircle,
} from "lucide-react";
import DetailsDialog from "../components/DetailsDialog";
import { useQuery, gql, useMutation } from "@apollo/client";
import Chat from "../AIChat/Chat"; // Import AIChat component
import { Toaster, toast } from "sonner";

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
      image_url
      price
      status
    }
  }
`;

const CANCEL_APPOINTMENT = gql`
  mutation CancelAppointment($appointmentId: Int!) {
    cancelAppointmentById(appointment_id: $appointmentId) {
      appointment {
        id
        status
      }
      message
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

  const [cancelAppointment] = useMutation(CANCEL_APPOINTMENT); // Add this line

  const handleCancelAppointment = async (appoint_id) => {
    const apoiID = parseInt(appoint_id, 10); // Convert appoint_id to an integer
    console.log("C:", apoiID); // Log the ID
    try {
      const { data } = await cancelAppointment({
        variables: { appointmentId: apoiID }, // Use apoiID
      });

      const appointment = data?.cancelAppointmentById?.appointment;
      if (appointment && appointment.status === "Cancelled") {
        toast.success("Appointment cancelled successfully.");
        refetch(); // Refresh the appointments list
      } else {
        console.error("Unexpected response:", data);
        toast.error("Failed to cancel the appointment. Please try again.");
      }
    } catch (error) {
      console.error(
        `Error cancelling appointment with ID ${appoint_id}:`,
        error
      ); // Log the ID with the error
      toast.error(`Failed to cancel the appointment. Error: ${error.message}`);
    }
  };

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
          status: appointment.status, // Use appointment_number for status
          notes: appointment.reason,
          appointment_number: appointment.appointment_number,
          image: appointment.image_url,
          price: appointment.price, // Include price in the state
        })
      );

      setAppointments(fetchedAppointments);
    }
  }, [data]);

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const getAppointmentDetails = (appointment) => {
    return [
      { label: "Appointment ID", value: appointment.id },
      { label: "Doctor", value: appointment.doctorName },
      { label: "Specialty", value: appointment.specialty },
      { label: "Date", value: new Date(appointment.date).toLocaleDateString() },
      { label: "Time", value: appointment.time },
      { label: "Duration", value: appointment.duration },
      { label: "Location", value: appointment.location },
      { label: "Notes", value: appointment.notes },
      { label: "Appointment Number", value: appointment.appointment_number },
      { label: "Status", value: appointment.status },
      { label: "Price", value: `Rs.${appointment.price}` }, // Format price
      { label: "Image", value: appointment.image }, // Add image URL
    ];
  };

  const handleError = (message) => {
    toast.error(message);
  };

  const handleSuccess = (message) => {
    toast.success(message);
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle className={styles.errorIcon} />
        <p>Error fetching appointments: {error.message}</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <Toaster position="top-right" />
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
            <Stethoscope className={styles.statCardIcon} />
            <span className={styles.statCardTitle}>Total Appointments</span>
          </div>
          <div className={styles.statCardValue}>
            {appointments.filter((app) => app.status !== "cancelled").length}
          </div>
        </div>
      </div>

      <div className={styles.actionsContainer}>
        <Link to="/" className={styles.actionCard}>
          <Users className={styles.actionIcon} />
          <h3 className={styles.actionTitle}>Find a Doctor</h3>
          <p className={styles.actionDesc}>Search for doctors by specialty</p>
        </Link>

        <Link to="/patient/profile" className={styles.actionCard}>
          <User className={styles.actionIcon} />
          <h3 className={styles.actionTitle}>My Profile</h3>
          <p className={styles.actionDesc}>Update your information</p>
        </Link>
      </div>

      <div className={styles.appointmentsSection}>
        <h2 className={styles.sectionTitle}>Your Appointments</h2>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
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
                    <td>
                      <div className={styles.doctorCell}>
                        {appointment.image && (
                          <img
                            src={appointment.image}
                            alt={appointment.doctorName}
                            className={styles.doctorImage}
                          />
                        )}
                        <span>Dr. {appointment.doctorName}</span>
                      </div>
                    </td>
                    <td>{appointment.specialty}</td>
                    <td>{new Date(appointment.date).toLocaleDateString()}</td>
                    <td>{appointment.time}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[appointment.status.toLowerCase()]
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          onClick={() => handleViewAppointment(appointment)}
                          className={`${styles.button} ${styles.viewButton}`}
                        >
                          View Details
                        </button>
                        {appointment.status === "pending" && (
                          <button
                            className={`${styles.button} ${styles.cancelButton}`}
                            onClick={() =>
                              handleCancelAppointment(appointment.id)
                            }
                          >
                            Cancel
                          </button>
                        )}
                      </div>
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
      </div>

      {selectedAppointment && (
        <DetailsDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title="Appointment Details"
          description="Complete information about your appointment"
          details={getAppointmentDetails(selectedAppointment)}
          onCancel={handleCancelAppointment}
        />
      )}
    </div>
  );
};

export default PatientDashboard;
