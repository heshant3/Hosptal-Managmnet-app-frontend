import React, { useState, useEffect } from "react";
import styles from "./PatientProfile.module.css";
import { gql, useQuery, useMutation } from "@apollo/client"; // Import Apollo Client

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

const UPDATE_PATIENT_DATA = gql`
  mutation UpdatePatientData(
    $patient_id: Int!
    $name: String!
    $address: String!
    $dob: String!
    $mobile_number: String!
  ) {
    updatePatientData(
      patient_id: $patient_id
      name: $name
      address: $address
      dob: $dob
      mobile_number: $mobile_number
    ) {
      patientData {
        id
        name
        address
        dob
        mobile_number
      }
      message
    }
  }
`;

const UPDATE_PATIENT_CREDENTIALS = gql`
  mutation UpdatePatientCredentials(
    $patientId: Int!
    $email: String!
    $password: String!
  ) {
    updatePatientCredentials(
      patient_id: $patientId
      email: $email
      password: $password
    ) {
      patient {
        id
        email
        password
      }
      message
    }
  }
`;

const PatientProfile = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [formData, setFormData] = useState({});
  const [securityFormData, setSecurityFormData] = useState({
    email: "",
    password: "",
  });

  const patientId = parseInt(localStorage.getItem("patientId"), 10); // Get patient ID from local storage

  const { data, loading, error, refetch } = useQuery(GET_PATIENT_DATA, {
    variables: { patientId },
    skip: !patientId, // Skip query if patientId is not available
  });

  const [updatePatientData] = useMutation(UPDATE_PATIENT_DATA, {
    onCompleted: (response) => {
      setPatientData(response.updatePatientData.patientData);
      setIsEditingProfile(false);
      alert(response.updatePatientData.message);
      refetch(); // Refetch patient data
    },
    onError: (err) => {
      console.error(err);
      alert("Failed to update patient data.");
    },
  });

  const [updatePatientCredentials] = useMutation(UPDATE_PATIENT_CREDENTIALS, {
    onCompleted: (response) => {
      alert(response.updatePatientCredentials.message);
      setIsEditingSecurity(false);
      refetch(); // Refetch patient data
    },
    onError: (err) => {
      console.error(err);
      alert("Failed to update credentials.");
    },
  });

  useEffect(() => {
    if (data && data.getPatientDataById) {
      setPatientData(data.getPatientDataById);
      setFormData(data.getPatientDataById);
    }
  }, [data]);

  const handleEditProfile = () => {
    if (isEditingProfile) {
      // Save changes
      updatePatientData({
        variables: {
          patient_id: patientId,
          name: formData.name,
          address: formData.address,
          dob: formData.dob,
          mobile_number: formData.mobile_number,
        },
      });
    } else {
      setIsEditingProfile(true);
    }
  };

  const handleCancelProfileEdit = () => {
    setIsEditingProfile(false);
    setFormData(patientData); // Reset form data to original values
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecurityInputChange = (e) => {
    const { name, value } = e.target;
    setSecurityFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSecurity = () => {
    updatePatientCredentials({
      variables: {
        patientId,
        email: securityFormData.email,
        password: securityFormData.password,
      },
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading patient data.</p>;

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>My Profile</h1>
      <p className={styles.subtitle}>
        Update your personal information and settings
      </p>

      <div className={styles.profileGrid}>
        {/* Left Column */}
        <div className={styles.card}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>
              {patientData?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <h2 className={styles.userName}>{patientData?.name}</h2>
            <p className={styles.userEmail}>{patientData?.email}</p>
            <span className={styles.roleBadge}>Patient</span>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Personal Information</h3>
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
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Phone Number:</span>
                  <input
                    type="text"
                    name="mobile_number"
                    value={formData.mobile_number || ""}
                    onChange={handleInputChange}
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Address:</span>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Date of Birth:</span>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob || ""}
                    onChange={handleInputChange}
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
                  <span className={styles.infoValue}>{patientData?.name}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Phone Number:</span>
                  <span className={styles.infoValue}>
                    {patientData?.mobile_number}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Address:</span>
                  <span className={styles.infoValue}>
                    {patientData?.address}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Date of Birth:</span>
                  <span className={styles.infoValue}>{patientData?.dob}</span>
                </div>
              </>
            )}
          </div>
        </div>

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
                  <span className={styles.infoValue}>{patientData?.email}</span>
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

export default PatientProfile;
