import { useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import styles from "./AppointmentBooking.module.css";
import {
  Calendar,
  Clock,
  FileText,
  ArrowLeft,
  User,
  CreditCard,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabaseConfig";
import Modal from "react-modal"; // Import Modal component
import { Toaster, toast } from "sonner";

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

Modal.setAppElement("#root"); // Set the app element for accessibility

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
      price
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
        image_url
        price
        patient_email
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
  const [imageUrl, setImageUrl] = useState(""); // Add state for image URL
  const fileInputRef = useRef(null); // Add a ref for the file input
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayAndSubmit = async () => {
    // Validate card details
    if (
      !cardDetails.cardNumber ||
      !cardDetails.expiryDate ||
      !cardDetails.cvv
    ) {
      toast.error("Please fill in all card details.");
      return;
    }

    setIsLoading(true);
    // Close the modal
    setIsModalOpen(false);

    // Prepare appointment data
    const adjustedDate = selectedDate
      ? new Date(selectedDate.getTime() + 1 * 24 * 60 * 60 * 1000) // Add 1 day
      : null;

    const appointmentData = {
      doc_id: parseInt(doctorId),
      patient_id: patientId,
      schedule_id: parseInt(selectedHospital.id), // Ensure schedule_id is an integer
      doc_name: doctor.name,
      hospital_name: selectedHospital.hospital_name,
      doc_specialist: doctor.specialization || doctor.specialty,
      available_day: adjustedDate
        ? adjustedDate.toISOString().split("T")[0] // Format as "YYYY-MM-DD"
        : "",
      session_time: selectedHospital.time,
      appointment_number: selectedHospital.total_patients,
      reason: reason || "",
      patient_name: patientData?.getPatientDataById?.name || "",
      patient_dob: patientData?.getPatientDataById?.dob || "",
      patient_phone: patientData?.getPatientDataById?.mobile_number || "",
      yourTime: selectedHospital.YourTime || "",
      price: selectedHospital.price || 0,
      image_url: imageUrl || "", // Include the uploaded image URL
      patient_email: patientData?.getPatientDataById?.email || "",
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
      toast.success(
        data.addAppointment.message || "Appointment requested successfully."
      );

      // Reset all state variables
      setSelectedDate("");
      setSelectedTime("");
      setReason("");
      setSelectedHospital(null);
      setImageUrl("");

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error adding appointment:", error);
      if (error.networkError) {
        console.error("Network Error Details:", error.networkError.result);
      }
      if (error.graphQLErrors) {
        console.error("GraphQL Error Details:", error.graphQLErrors);
      }
      toast.error(
        "Failed to request appointment. Please check your input and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
    return (
      <div className={styles.errorContainer}>
        <p>Error loading doctor details. Please try again later.</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className={styles.errorContainer}>
        <p>No doctor data available.</p>
      </div>
    );
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

  const handleFileUpload = async (file) => {
    if (!file) return;

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("image") // Bucket name
        .upload(fileName, file);

      if (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file. Please try again.");
        return;
      }

      // Ensure the public URL is generated correctly
      const { data: publicUrlData } = supabase.storage
        .from("image")
        .getPublicUrl(data.path);

      if (publicUrlData) {
        console.log("Uploaded File URL:", publicUrlData.publicUrl);
        setImageUrl(publicUrlData.publicUrl); // Store the public URL in state
        alert(`File uploaded successfully. URL: ${publicUrlData.publicUrl}`);
      } else {
        console.error("Failed to generate public URL.");
        alert("File uploaded, but public URL could not be generated.");
      }
    } catch (err) {
      console.error("Unexpected error during file upload:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!patientId) {
      toast.error("Please log in to book an appointment.");
      return;
    }

    if (!selectedHospital) {
      toast.error("Please select a hospital first.");
      return;
    }

    // Open the card details modal
    setIsModalOpen(true);
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
      <Toaster position="top-right" />
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
                  <p className={styles.hospitalName}>
                    {hospital.hospital_name}
                  </p>
                  <p className={styles.hospitalDay}>{hospital.day}</p>
                  <p className={styles.hospitalPrice}>Rs: {hospital.price}</p>
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
                minDate={new Date()}
                filterDate={isDateSelectable}
                disabled={!selectedHospital}
                dateFormat="MMMM d, yyyy"
              />
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <Clock className={styles.sectionIcon} />
                Session Time
              </h3>
              {selectedHospital ? (
                <div className={styles.timeSlots}>
                  {selectedHospital.time.split(",").map((time) => (
                    <span
                      key={time}
                      className={`${styles.timeSlot} ${
                        selectedTime === time ? styles.selected : ""
                      }`}
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </span>
                  ))}
                </div>
              ) : (
                <p>Please select a hospital to view available times.</p>
              )}
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <Clock className={styles.sectionIcon} />
                Total Appointments
              </h3>
              {selectedHospital ? (
                <p className={styles.infoText}>
                  {selectedHospital.total_patients}
                </p>
              ) : (
                <p className={styles.infoText}>
                  Please select a hospital to view total appointments.
                </p>
              )}
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <CreditCard className={styles.sectionIcon} />
                Price
              </h3>
              {selectedHospital ? (
                <p className={styles.infoText}>Rs: {selectedHospital.price}</p>
              ) : (
                <p className={styles.infoText}>
                  Please select a hospital to view the price.
                </p>
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
              />
            </div>

            <div className={styles.formSection2}>
              <h3 className={styles.sectionTitle}>
                <FileText className={styles.sectionIcon} />
                Medical Records
              </h3>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  handleFileUpload(file);
                }}
                className={styles.uploadInput}
              />
            </div>

            <button
              type="submit"
              className={styles.bookedButton}
              disabled={
                !selectedDate || !selectedTime || !selectedHospital || isLoading
              }
            >
              {isLoading ? "Requesting..." : "Request Appointment"}
            </button>
          </form>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className={styles.modal}
        overlayClassName={styles.modalOverlay}
      >
        <h2 className={styles.modalTitle}>Enter Card Details</h2>
        <form>
          <div className={styles.formGroup}>
            <label>Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={cardDetails.cardNumber}
              onChange={handleCardInputChange}
              placeholder="1234 5678 9012 3456"
              className={styles.input}
              maxLength="19"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Expiry Date</label>
            <input
              type="text"
              name="expiryDate"
              value={cardDetails.expiryDate}
              onChange={handleCardInputChange}
              placeholder="MM/YY"
              className={styles.input}
              maxLength="5"
            />
          </div>
          <div className={styles.formGroup}>
            <label>CVV</label>
            <input
              type="password"
              name="cvv"
              value={cardDetails.cvv}
              onChange={handleCardInputChange}
              placeholder="123"
              className={styles.input}
              maxLength="3"
            />
          </div>
          <button
            type="button"
            className={styles.bookedButton}
            onClick={handlePayAndSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Pay and Submit"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AppointmentBooking;
