import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import styles from "./Profile.module.css";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileDetails from "../components/profile/ProfileDetails";
import { calculateAge } from "../components/profile/ProfileHelpers";

const Profile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    age: "",
    medicalHistory: "",
    emergencyContact: "",
  });

  useEffect(() => {
    // If not logged in, redirect to login
    if (!currentUser) {
      navigate("/");
      return;
    }

    // Update profile data with current user info
    setProfileData({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      address: currentUser?.address || "",
      dateOfBirth: currentUser?.dateOfBirth || "",
      age: calculateAge(currentUser?.dateOfBirth) || "",
      medicalHistory: currentUser?.medicalHistory || "",
      emergencyContact: currentUser?.emergencyContact || "",
    });
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update age when date of birth changes
    if (name === "dateOfBirth") {
      const calculatedAge = calculateAge(value);
      setProfileData((prev) => ({
        ...prev,
        age: calculatedAge,
      }));
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // If we were editing and now we're cancelling, reset the data
      setProfileData({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        phone: currentUser?.phone || "",
        address: currentUser?.address || "",
        dateOfBirth: currentUser?.dateOfBirth || "",
        age: calculateAge(currentUser?.dateOfBirth) || "",
        medicalHistory: currentUser?.medicalHistory || "",
        emergencyContact: currentUser?.emergencyContact || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    updateUserProfile(profileData);
    toast.success("Profile updated successfully");
    setIsEditing(false);
  };

  // Show loading or redirect to login if no user
  if (!currentUser) {
    return null; // We're redirecting in useEffect
  }

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.profileHeading}>My Profile</h1>
      <p className={styles.profileSubheading}>
        Update your personal information and settings
      </p>

      <div className={styles.profileGrid}>
        {/* Left column - Profile Sidebar */}
        <ProfileSidebar
          currentUser={currentUser}
          profileData={profileData}
          isEditing={isEditing}
          handleChange={handleChange}
        />

        {/* Right column - Profile Details */}
        <ProfileDetails
          isEditing={isEditing}
          handleEditToggle={handleEditToggle}
          profileData={profileData}
          handleChange={handleChange}
          handleSave={handleSave}
        />
      </div>
    </div>
  );
};

export default Profile;
