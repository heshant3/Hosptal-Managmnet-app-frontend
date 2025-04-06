import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import styles from "./AppointmentBooking.module.css";
import { Calendar, Clock, FileText, ArrowLeft, User } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const GET_DOCTOR_DETAILS_BY_ID = gql`
  query GetDoctorInfo($doctor_id: Int!) {
    getDoctorBasicInfoById(doctor_id: $doctor_id) {
      doctor_id
      name
      specialization
      qualifications
    }
  }
`;

const GET_DOCTOR_DETAILS_BY_ID_FULL = gql`
  query GetDocScheduleByDoctorId($doctor_id: Int!) {
    getDocScheduleByDoctorId(doctor_id: $doctor_id) {
      id
      doctor_id
      hospital_name
      total_patients
      day
      time
      onePatientDuration
      YourTime
    }
  }
`;

const GET_PATIENT_DATA = gql`
  query GetPatientData($patientId: Int!) {
    getPatientDataById(patient_id: $patientId) {
      id
      name
      address
      dob
      mobile_number
      email
    }
  }
`;

const ADD_APPOINTMENT = gql`
  mutation AddAppointment($input: AddAppointmentInput!) {
    addAppointment(input: $input) {
      appointment {
        id
        doc_name
        hospital_name
        doc_specialist
        patient_name
        patient_dob
        patient_phone
        available_day
        session_time
        schedule_id
        yourTime
      }
      message
    }
  }
`;

const AppointmentBooking = () => {
  const { doctorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);

  const passedDoctorData = location.state?.doctor;

  const { data, loading, error } = useQuery(GET_DOCTOR_DETAILS_BY_ID, {
    variables: { doctor_id: parseInt(doctorId) },
    skip: !!passedDoctorData,
  });

  const {
    data: fullData,
    loading: fullLoading,
    error: fullError,
  } = useQuery(GET_DOCTOR_DETAILS_BY_ID_FULL, {
    variables: { doctor_id: parseInt(doctorId) },
    skip: false,
  });

  const patientId = parseInt(localStorage.getItem("patientId"));

  const {
    data: patientData,
    loading: patientLoading,
    error: patientError,
  } = useQuery(GET_PATIENT_DATA, {
    variables: { patientId },
    skip: !patientId,
  });

  const [addAppointment] = useMutation(ADD_APPOINTMENT);

  const doctorDetails =
    fullData?.getDocScheduleByDoctorId?.[0] || data?.getDoctorBasicInfoById;
  const doctor = passedDoctorData || doctorDetails;

  if ((loading || fullLoading) && !passedDoctorData) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading doctor information...</p>
      </div>
    );
  }

  if (error || fullError) {
    return <p>Error loading doctor details.</p>;
  }

  if (!doctor) {
    return <p>No doctor data available.</p>;
  }

  const handleDateSelect = (date) => {
    console.log("Selected Date:", date); // Log the selected date
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital);
    setSelectedDate(""); // Reset selected date when hospital changes
    setSelectedTime(""); // Reset selected time when hospital changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientId) {
      alert("Please log in to book an appointment.");
      return;
    }

    if (!selectedHospital) {
      alert("Please select a hospital first.");
      return;
    }

    const appointmentData = {
      doc_id: parseInt(doctorId),
      patient_id: patientId,
      schedule_id: parseInt(selectedHospital.id), // Ensure schedule_id is an integer
      doc_name: doctor.name,
      hospital_name: selectedHospital.hospital_name,
      doc_specialist: doctor.specialization || doctor.specialty,
      available_day: selectedDate
        ? selectedDate.toISOString().split("T")[0]
        : "",
      session_time: selectedHospital.time,
      appointment_number: selectedHospital.total_patients,
      reason: reason || "",
      patient_name: patientData?.getPatientDataById?.name || "",
      patient_dob: patientData?.getPatientDataById?.dob || "",
      patient_phone: patientData?.getPatientDataById?.mobile_number || "",
      yourTime: selectedHospital.YourTime || "",
    };

    console.log("Appointment Data Sent to Server:", appointmentData);

    try {
      const { data } = await addAppointment({
        variables: { input: appointmentData },
        refetchQueries: [
          {
            query: GET_DOCTOR_DETAILS_BY_ID_FULL,
            variables: { doctor_id: parseInt(doctorId) },
          },
          {
            query: GET_PATIENT_DATA,
            variables: { patientId },
          },
        ],
      });
      console.log("Appointment Response:", data);
      alert(
        data.addAppointment.message || "Appointment requested successfully."
      );
    } catch (error) {
      console.error("Error adding appointment:", error);
      if (error.networkError) {
        console.error("Network Error Details:", error.networkError.result);
      }
      if (error.graphQLErrors) {
        console.error("GraphQL Error Details:", error.graphQLErrors);
      }
      alert(
        "Failed to request appointment. Please check your input and try again."
      );
    }
  };

  const getDayIndex = (day) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days.indexOf(day);
  };

  const isDateSelectable = (date) => {
    if (!selectedHospital) return false;
    const hospitalDayIndex = getDayIndex(selectedHospital.day);
    return date.getDay() === hospitalDayIndex;
  };

  return (
    <div className={styles.bookingContainer}>
      <button className={styles.backButton} onClick={() => navigate("/")}>
        <ArrowLeft />
        <span>Back to Search</span>
      </button>

      <div className={styles.bookingContent}>
        <div className={styles.doctorProfile}>
          <div className={styles.doctorHeader}>
            <div className={styles.doctorAvatar}>
              {doctor.image ? (
                <img src={doctor.image} alt={doctor.name} />
              ) : (
                <User className={styles.avatarPlaceholder} />
              )}
            </div>

            <div className={styles.doctorDetails}>
              <h2 className={styles.doctorName}>{doctor.name}</h2>
              <p className={styles.doctorSpecialty}>
                {doctor.specialization || doctor.specialty}
              </p>
              <p className={styles.doctorQualifications}>
                {doctor.qualifications}
              </p>
            </div>
          </div>
          <div className={styles.doctorDetails}>
            <h2 className={styles.doctorName}>Select Hospital</h2>
            <div className={styles.hospitalCards}>
              {fullData?.getDocScheduleByDoctorId?.map((hospital) => (
                <div
                  key={hospital.id}
                  className={`${styles.hospitalCard} ${
                    selectedHospital?.id === hospital.id ? styles.selected : ""
                  }`}
                  onClick={() => handleHospitalSelect(hospital)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <p className={styles.hospitalName}>
                      {hospital.hospital_name}
                    </p>
                    <p className={styles.hospitalDay}>{hospital.day}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.bookingForm}>
          <h2 className={styles.bookingTitle}>Book an Appointment</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <Calendar className={styles.sectionIcon} />
                Available Day
              </h3>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateSelect}
                className={styles.input}
                placeholderText="Select a date"
                minDate={new Date()} // Restrict to today or future dates
                filterDate={isDateSelectable} // Allow only dates matching the hospital's available day
                disabled={!selectedHospital} // Disable if no hospital is selected
              />
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <Clock className={styles.sectionIcon} />
                Session Start Time
              </h3>
              {selectedHospital ? (
                <div className={styles.timeSlots}>
                  {selectedHospital.time.split(",").map((time) => (
                    <span
                      key={time}
                      className={`${styles.timeSlot} ${
                        selectedTime === time ? styles.selected : ""
                      }`}
                      onClick={() => handleTimeSelect(time)} // Add this onClick handler
                    >
                      {time}
                    </span>
                  ))}
                </div>
              ) : (
                <p>Please select a hospital to view available times.</p>
              )}
            </div>

            {/* <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <Clock className={styles.sectionIcon} />
                Your Start Time
              </h3>
              {selectedHospital ? (
                <p>
                  {selectedHospital.YourTime ||
                    "No specific start time provided."}
                </p>
              ) : (
                <p>Please select a hospital to view your start time.</p>
              )}
            </div> */}

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <Clock className={styles.sectionIcon} />
                Total Appointments
              </h3>
              {selectedHospital ? (
                <p>{selectedHospital.total_patients}</p>
              ) : (
                <p>Please select a hospital to view total appointments.</p>
              )}
            </div>

            <div className={styles.formSection2}>
              <h3 className={styles.sectionTitle}>
                <FileText className={styles.sectionIcon} />
                Reason for Visit
              </h3>

              <textarea
                className={styles.reasonInput}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly describe your reason for this appointment..."
                rows={4}
              ></textarea>
            </div>
            <div className={styles.formSection2}>
              <h3 className={styles.sectionTitle}>
                <FileText className={styles.sectionIcon} />
                Add Medical Records
              </h3>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    alert(`File "${file.name}" uploaded successfully.`);
                  }
                }}
                className={styles.uploadInput}
              />
            </div>

            <button
              type="submit"
              className={styles.bookedButton}
              disabled={!selectedDate}
            >
              Request Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
