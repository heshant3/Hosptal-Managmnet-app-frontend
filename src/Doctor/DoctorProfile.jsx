import React, { useState, useEffect } from "react";
import styles from "./DoctorProfile.module.css";
import { gql, useQuery, useMutation } from "@apollo/client"; // Updated import

const GET_DOCTOR_DATA = gql`
  query GetDoctorData($doctorId: Int!) {
    getDoctorDataById(doctor_id: $doctorId) {
      id
      name
      contact
      address
      specialization
      qualifications
      email
    }
  }
`;

const UPDATE_DOCTOR_DATA = gql`
  mutation UpdateDoctorData(
    $doctorId: Int!
    $name: String
    $specialization: String
    $contact: String
    $address: String
    $dateOfBirth: String
    $qualifications: String
  ) {
    updateDoctorData(
      doctor_id: $doctorId
      name: $name
      specialization: $specialization
      contact: $contact
      address: $address
      date_of_birth: $dateOfBirth
      qualifications: $qualifications
    ) {
      doctorData {
        id
        name
        specialization
        contact
        address
        date_of_birth
        qualifications
      }
      message
    }
  }
`;

const UPDATE_DOCTOR_CREDENTIALS = gql`
  mutation UpdateDoctorCredentials(
    $doctorId: Int!
    $email: String
    $password: String
  ) {
    updateDoctorCredentials(
      doctor_id: $doctorId
      email: $email
      password: $password
    ) {
      id
      email
      password
    }
  }
`;

const DoctorProfile = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);
  const [securityFormData, setSecurityFormData] = useState({
    email: "janedoe@example.com",
    password: "",
  });
  const [doctorData, setDoctorData] = useState(null);

  const doctorId = parseInt(localStorage.getItem("doctorId")); // Get doctor ID from local storage

  const { data, loading, error, refetch } = useQuery(GET_DOCTOR_DATA, {
    variables: { doctorId },
    skip: !doctorId, // Skip query if doctorId is not available
  });

  const [updateDoctorData] = useMutation(UPDATE_DOCTOR_DATA);
  const [updateDoctorCredentials] = useMutation(UPDATE_DOCTOR_CREDENTIALS);

  useEffect(() => {
    if (data && data.getDoctorDataById) {
      setDoctorData(data.getDoctorDataById);
      setSecurityFormData((prev) => ({
        ...prev,
        email: data.getDoctorDataById.email || prev.email,
      }));
    }
  }, [data]);

  const handleEditProfile = async () => {
    if (isEditingProfile) {
      try {
        await updateDoctorData({
          variables: {
            doctorId,
            name: doctorData?.name,
            specialization: doctorData?.specialization,
            contact: doctorData?.contact,
            address: doctorData?.address,
            dateOfBirth: doctorData?.date_of_birth,
            qualifications: doctorData?.qualifications,
          },
        });
        refetch(); // Refetch doctor data after saving
        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile.");
      }
    }
    setIsEditingProfile(!isEditingProfile);
  };

  const handleCancelProfileEdit = () => setIsEditingProfile(false);

  const handleInputChange = (field, value) => {
    setDoctorData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSecurityInputChange = (e) => {
    const { name, value } = e.target;
    setSecurityFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSecurity = async () => {
    try {
      await updateDoctorCredentials({
        variables: {
          doctorId,
          email: securityFormData.email,
          password: securityFormData.password,
        },
      });
      alert("Security details updated successfully!");
      setIsEditingSecurity(false);
      refetch(); // Refetch doctor data after saving security details
    } catch (error) {
      console.error("Error updating security details:", error);
      alert("Failed to update security details.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading doctor data.</p>;

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>Doctor Profile</h1>
      <p className={styles.subtitle}>
        Manage your professional information and settings
      </p>

      <div className={styles.profileGrid}>
        {/* Left Column */}
        <div className={styles.card}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>
              {doctorData?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <h2 className={styles.userName}>{doctorData?.name}</h2>
            <p className={styles.userEmail}>{doctorData?.contact}</p>
            <span className={styles.roleBadge}>Doctor</span>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Professional Information</h3>
            <button
              className={`${styles.editButton} ${
                isEditingProfile ? styles.saveState : ""
              }`}
              onClick={handleEditProfile}
            >
              {isEditingProfile ? "Save" : "Edit Profile"}
            </button>
          </div>
          <div className={styles.cardContent}>
            {isEditingProfile ? (
              <>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Full Name:</span>
                  <input
                    type="text"
                    value={doctorData?.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Phone Number:</span>
                  <input
                    type="text"
                    value={doctorData?.contact || ""}
                    onChange={(e) =>
                      handleInputChange("contact", e.target.value)
                    }
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Address:</span>
                  <input
                    type="text"
                    value={doctorData?.address || ""}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Specialty:</span>
                  <select
                    className={styles.inputField}
                    value={doctorData?.specialization || ""}
                    onChange={(e) =>
                      handleInputChange("specialization", e.target.value)
                    }
                  >
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Orthopedic Surgeon">
                      Orthopedic Surgeon
                    </option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Psychiatrist">Psychiatrist</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="General Practitioner">
                      General Practitioner
                    </option>
                    <option value="Radiologist">Radiologist</option>
                    <option value="Oncologist">Oncologist</option>
                  </select>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Qualifications:</span>
                  <input
                    type="text"
                    value={doctorData?.qualifications || ""}
                    onChange={(e) =>
                      handleInputChange("qualifications", e.target.value)
                    }
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.buttonRow}>
                  <button
                    className={styles.saveButton}
                    onClick={handleEditProfile}
                  >
                    Save
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={handleCancelProfileEdit}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Full Name:</span>
                  <span className={styles.infoValue}>
                    {doctorData?.name || "N/A"}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Phone Number:</span>
                  <span className={styles.infoValue}>
                    {doctorData?.contact || "N/A"}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Address:</span>
                  <span className={styles.infoValue}>
                    {doctorData?.address || "N/A"}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Specialty:</span>
                  <span className={styles.infoValue}>
                    {doctorData?.specialization || "N/A"}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Qualifications:</span>
                  <span className={styles.infoValue}>
                    {doctorData?.qualifications || "N/A"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.card2}></div>

        {/* Security Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Security</h3>
            <button
              className={`${styles.editButton} ${
                isEditingSecurity ? styles.saveState : ""
              }`}
              onClick={() => setIsEditingSecurity(!isEditingSecurity)}
            >
              {isEditingSecurity ? "Save" : "Edit Security"}
            </button>
          </div>
          <div className={styles.cardContent}>
            {isEditingSecurity ? (
              <>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Email:</span>
                  <input
                    type="email"
                    name="email"
                    value={securityFormData.email}
                    onChange={handleSecurityInputChange}
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>New Password:</span>
                  <input
                    type="password"
                    name="password"
                    value={securityFormData.password}
                    onChange={handleSecurityInputChange}
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.buttonRow}>
                  <button
                    className={styles.saveButton}
                    onClick={handleSaveSecurity}
                  >
                    Save
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setIsEditingSecurity(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Email:</span>
                  <span className={styles.infoValue}>
                    {securityFormData.email}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Current Password:</span>
                  <span className={styles.infoValue}>••••••••</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
