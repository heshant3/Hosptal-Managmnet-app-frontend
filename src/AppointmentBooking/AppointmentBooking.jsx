import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./AppointmentBooking.module.css";
import {
  Calendar,
  Clock,
  FileText,
  ArrowLeft,
  User,
  Star,
  MapPin,
} from "lucide-react";

const AppointmentBooking = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    // Mock fetching doctor data
    setTimeout(() => {
      // This would be a real API call in a production app
      const mockDoctor = {
        id: parseInt(doctorId),
        name: "Dr. Sarah Johnson",
        specialty: "Cardiologist",
        location: "New York, NY",
        rating: 4.8,
        reviews: 124,
        image: null,
        bio: "Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating heart conditions. She specializes in preventive cardiology and heart disease management.",
        education: "Harvard Medical School",
        languages: ["English", "Spanish"],
        availableDates: [
          "2025-04-10",
          "2025-04-12",
          "2025-04-15",
          "2025-04-18",
        ],
      };

      setDoctor(mockDoctor);
      setAvailableDates(mockDoctor.availableDates);
      setLoading(false);
    }, 1000);
  }, [doctorId]);

  useEffect(() => {
    if (selectedDate) {
      // Mock available time slots for the selected date
      const mockTimes = [
        "9:00 AM",
        "9:30 AM",
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "2:00 PM",
        "2:30 PM",
        "3:00 PM",
        "3:30 PM",
      ];
      setAvailableTimes(mockTimes);
    } else {
      setAvailableTimes([]);
    }
  }, [selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(""); // Reset time when date changes
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time");
      return;
    }

    // In a real app, this would send the appointment data to the server
    console.log("Booking appointment with:", {
      doctorId,
      date: selectedDate,
      time: selectedTime,
      reason,
    });

    // Navigate back to patient dashboard after booking
    alert("Appointment requested. Waiting for doctor approval.");
    navigate("/patient");
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading doctor information...</p>
      </div>
    );
  }

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
              <p className={styles.doctorSpecialty}>{doctor.specialty}</p>

              <div className={styles.doctorMeta}>
                <div className={styles.metaItem}>
                  <MapPin className={styles.metaIcon} />
                  <span>{doctor.location}</span>
                </div>

                <div className={styles.metaItem}>
                  <Star className={styles.metaIcon} />
                  <span>
                    {doctor.rating} ({doctor.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.doctorBio}>
            <h3>About Doctor</h3>
            <p>{doctor.bio}</p>

            <div className={styles.doctorCredentials}>
              <div className={styles.credentialItem}>
                <strong>Education:</strong> {doctor.education}
              </div>
              <div className={styles.credentialItem}>
                <strong>Languages:</strong> {doctor.languages.join(", ")}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bookingForm}>
          <h2 className={styles.bookingTitle}>Book an Appointment</h2>

          <form onSubmit={handleSubmit}>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <Calendar className={styles.sectionIcon} />
                Select Date
              </h3>

              <div className={styles.dateSelection}>
                {availableDates.map((date) => (
                  <button
                    key={date}
                    type="button"
                    className={`${styles.dateButton} ${
                      selectedDate === date ? styles.dateSelected : ""
                    }`}
                    onClick={() => handleDateSelect(date)}
                  >
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </button>
                ))}
              </div>
            </div>

            {selectedDate && (
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <Clock className={styles.sectionIcon} />
                  Select Time
                </h3>

                <div className={styles.timeSelection}>
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={`${styles.timeButton} ${
                        selectedTime === time ? styles.timeSelected : ""
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.formSection}>
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

            <button
              type="submit"
              className={styles.submitButton}
              disabled={!selectedDate || !selectedTime}
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
