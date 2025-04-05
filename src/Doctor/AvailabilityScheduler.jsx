import React, { useState } from "react";
import styles from "./AvailabilityScheduler.module.css";

const AvailabilityScheduler = () => {
  const [time, setTime] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [totalPatients, setTotalPatients] = useState("");
  const [day, setDay] = useState("");
  const [error, setError] = useState("");
  const [submittedDataList, setSubmittedDataList] = useState([]); // State to store multiple entries

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!time || !hospitalName || !totalPatients || !day) {
      setError("All fields are required.");
      return;
    }
    setError("");
    const newData = { time, hospitalName, totalPatients, day };
    setSubmittedDataList([...submittedDataList, newData]); // Add new entry to the list
    setTime("");
    setHospitalName("");
    setTotalPatients("");
    setDay("");
  };

  const handleDelete = (index) => {
    const updatedList = submittedDataList.filter((_, i) => i !== index); // Remove the selected card
    setSubmittedDataList(updatedList);
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
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>
            Submit
          </button>
        </form>
      </div>
      {submittedDataList.length > 0 && (
        <div className={styles.cardContainer}>
          <h2>Appointment Schedules</h2>
          <div className={styles.cardGrid}>
            {submittedDataList.map((data, index) => (
              <div key={index} className={styles.card}>
                <p>
                  <strong>Hospital Name:</strong> {data.hospitalName}
                </p>
                <p>
                  <strong>Total Patients:</strong> {data.totalPatients}
                </p>
                <p>
                  <strong>Day:</strong> {data.day}
                </p>
                <p>
                  <strong>Time:</strong> {data.time}
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
