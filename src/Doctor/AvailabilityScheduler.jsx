import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client"; // Import Apollo Client
import styles from "./AvailabilityScheduler.module.css";

// GraphQL mutation
const ADD_DOC_SCHEDULE = gql`
  mutation AddDocSchedule(
    $doctor_id: Int!
    $hospital_name: String!
    $total_patients: Int!
    $day: String!
    $time: String!
    $onePatientDuration: Int!
  ) {
    addDocSchedule(
      doctor_id: $doctor_id
      hospital_name: $hospital_name
      total_patients: $total_patients
      day: $day
      time: $time
      onePatientDuration: $onePatientDuration
    ) {
      schedule {
        id
        doctor_id
        hospital_name
        total_patients
        day
        time
        onePatientDuration
      }
      message
    }
  }
`;

// GraphQL query
const GET_DOC_SCHEDULE_BY_DOCTOR_ID = gql`
  query GetDocScheduleByDoctorId($doctor_id: Int!) {
    getDocScheduleByDoctorId(doctor_id: $doctor_id) {
      id
      hospital_name
      total_patients
      day
      time
      onePatientDuration
    }
  }
`;

// GraphQL mutation for deleting a schedule
const DELETE_DOC_SCHEDULE = gql`
  mutation DeleteDocSchedule($schedule_id: Int!) {
    deleteDocSchedule(schedule_id: $schedule_id) {
      schedule {
        id
      }
    }
  }
`;

const AvailabilityScheduler = () => {
  const [time, setTime] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [totalPatients, setTotalPatients] = useState("");
  const [day, setDay] = useState("");
  const [onePatientDuration, setOnePatientDuration] = useState(""); // New state for one patient duration
  const [error, setError] = useState("");
  const [submittedDataList, setSubmittedDataList] = useState([]); // State to store multiple entries
  const [addDocSchedule] = useMutation(ADD_DOC_SCHEDULE); // Use mutation
  const [deleteDocSchedule] = useMutation(DELETE_DOC_SCHEDULE); // Use delete mutation

  const doctorId = parseInt(localStorage.getItem("doctorId"), 10); // Get doctor_id from localStorage

  const {
    data,
    loading,
    error: queryError,
  } = useQuery(GET_DOC_SCHEDULE_BY_DOCTOR_ID, {
    variables: { doctor_id: doctorId },
    skip: !doctorId, // Skip query if doctorId is not available
  });

  useEffect(() => {
    if (data && data.getDocScheduleByDoctorId) {
      setSubmittedDataList(data.getDocScheduleByDoctorId); // Populate the list with fetched data
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !time ||
      !hospitalName ||
      !totalPatients ||
      !day ||
      !onePatientDuration
    ) {
      setError("All fields are required.");
      return;
    }
    setError("");

    if (!doctorId) {
      setError("Doctor ID is missing in localStorage.");
      return;
    }

    try {
      const { data } = await addDocSchedule({
        variables: {
          doctor_id: doctorId,
          hospital_name: hospitalName,
          total_patients: parseInt(totalPatients, 10),
          day,
          time,
          onePatientDuration: parseInt(onePatientDuration, 10), // Include new field
        },
      });
      console.log("Mutation response:", data);
      const newSchedule = data.addDocSchedule.schedule; // Get the new schedule with ID
      setSubmittedDataList([...submittedDataList, newSchedule]); // Add new entry with ID to the list
      setTime("");
      setHospitalName("");
      setTotalPatients("");
      setDay("");
      setOnePatientDuration(""); // Reset the new field
    } catch (error) {
      console.error("Error adding schedule:", error);
      setError("Failed to add schedule. Please try again.");
    }
  };

  const handleDelete = async (index) => {
    const scheduleId = parseInt(submittedDataList[index]?.id, 10); // Ensure scheduleId is an integer
    if (!scheduleId) {
      console.error("Schedule ID not found for deletion.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this schedule?"
    );
    if (!confirmDelete) {
      return; // Cancel deletion if the user clicks "Cancel"
    }

    try {
      await deleteDocSchedule({ variables: { schedule_id: scheduleId } }); // Call the mutation
      const updatedList = submittedDataList.filter((_, i) => i !== index); // Remove the selected card
      setSubmittedDataList(updatedList);
    } catch (error) {
      console.error("Error deleting schedule:", error); // Log the error
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Manage Availability</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Hospital Name"
            className={styles.input}
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Total Patients"
            className={styles.input}
            value={totalPatients}
            onChange={(e) => setTotalPatients(e.target.value)}
          />
          <select
            className={styles.input}
            value={day}
            onChange={(e) => setDay(e.target.value)}
          >
            <option value="">Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
          <input
            type="time"
            className={styles.input}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <select
            className={styles.input}
            value={onePatientDuration}
            onChange={(e) => setOnePatientDuration(e.target.value)}
          >
            <option value="">Select One Patient Duration</option>
            <option value="1">1 minute</option>
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
            <option value="15">15 minutes</option>
            <option value="20">20 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="50">50 minutes</option>
            <option value="60">60 minutes</option>
          </select>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>
            Submit
          </button>
        </form>
      </div>
      {loading && <p>Loading schedules...</p>}
      {queryError && <p className={styles.error}>Failed to fetch schedules.</p>}
      {submittedDataList.length > 0 && (
        <div className={styles.cardContainer}>
          <h2>Appointment Schedules</h2>
          <div className={styles.cardGrid}>
            {submittedDataList.map((data, index) => (
              <div key={index} className={styles.card}>
                <p>
                  <strong>Hospital Name:</strong> {data.hospital_name}
                </p>
                <p>
                  <strong>Total Patients:</strong> {data.total_patients}
                </p>
                <p>
                  <strong>Day:</strong> {data.day}
                </p>
                <p>
                  <strong>Time:</strong> {data.time}
                </p>
                <p>
                  <strong>One Patient Duration:</strong>{" "}
                  {data.one_patient_duration} minutes
                </p>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityScheduler;
