import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import styles from "../components/Dashboard.module.css";
import { Calendar, Users, Clock, CalendarCheck, Star } from "lucide-react";
import DetailsDialog from "../components/DetailsDialog";

const GET_APPOINTMENTS_BY_DOCTOR_ID = gql`
  query GetAppointmentsByDoctorId($docId: Int!) {
    getAppointmentsByDoctorId(doc_id: $docId) {
      id
      appointment_number
      patient_name
      hospital_name
      available_day
      session_time
      image_url
      reason
      yourTime
      price
      status
    }
  }
`;

const DoctorDashboard = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const doctorId = parseInt(localStorage.getItem("doctorId"), 10);

  const { data, loading, error, refetch } = useQuery(
    GET_APPOINTMENTS_BY_DOCTOR_ID,
    {
      variables: { docId: doctorId },
      skip: !doctorId,
    }
  );

  useEffect(() => {
    if (doctorId) {
      refetch();
    }
  }, [doctorId, refetch]);

  if (error) {
    console.error("Error fetching appointments:", error);
  }

  const appointments = data?.getAppointmentsByDoctorId || [];

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
    console.log("Approve functionality not implemented");
  };

  const handleReject = (id) => {
    console.log("Reject functionality not implemented");
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
          <div className={styles.statCardValue}>
            {
              appointments.filter((app) => {
                const appointmentDate = new Date(Number(app.available_day));
                const today = new Date();
                return (
                  appointmentDate.getDate() === today.getDate() &&
                  appointmentDate.getMonth() === today.getMonth() &&
                  appointmentDate.getFullYear() === today.getFullYear()
                );
              }).length
            }
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Users
              className={styles.statCardIcon}
              style={{ backgroundColor: "#E8F5E9", color: "#2E7D32" }}
            />
            <span className={styles.statCardTitle}>Total Appointments</span>
          </div>
          <div className={styles.statCardValue}>{appointments.length}</div>
        </div>

        {/* <div className={styles.statCard}>
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
        </div> */}

        {/* <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Star
              className={styles.statCardIcon}
              style={{ backgroundColor: "#FFF8E1", color: "#FFA000" }}
            />
            <span className={styles.statCardTitle}>Rating</span>
          </div>
          <div className={styles.statCardValue}>4.8</div>
        </div> */}
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
                <th>Hospital</th>
                <th>Date</th>
                <th>Time</th>
                <th>patient Time</th>

                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.patient_name}</td>
                  <td>{appointment.hospital_name}</td>
                  <td>
                    {isNaN(Number(appointment.available_day))
                      ? "Invalid Date"
                      : new Date(
                          Number(appointment.available_day)
                        ).toLocaleDateString()}
                  </td>
                  <td>{appointment.session_time}</td>
                  <td>{appointment.yourTime}</td>

                  <td>
                    <button
                      className={`${styles.button} ${styles.primaryButton}`}
                      onClick={() => handleViewAppointment(appointment)}
                    >
                      View
                    </button>
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
            { label: "Patient Name", value: selectedAppointment.patient_name },
            {
              label: "Hospital Name",
              value: selectedAppointment.hospital_name,
            },
            {
              label: "Date",
              value: isNaN(Number(selectedAppointment.available_day))
                ? "Invalid Date"
                : new Date(
                    Number(selectedAppointment.available_day)
                  ).toLocaleDateString(),
            },
            { label: "Time", value: selectedAppointment.session_time },
            { label: "Patient Time", value: selectedAppointment.yourTime },
            { label: "Reason", value: selectedAppointment.reason },

            { label: "Price", value: selectedAppointment.price },
            { label: "Status", value: selectedAppointment.status },
            {
              label: "Appointment No.",
              value: selectedAppointment.appointment_number,
            },
            { label: "Image", value: selectedAppointment.image_url },
          ]}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
