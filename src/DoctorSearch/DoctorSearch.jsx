import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./DoctorSearch.module.css";
import { Search, Filter, User } from "lucide-react";
import { gql, useQuery } from "@apollo/client";
import { Toaster, toast } from "sonner";

const GET_ALL_DOCTORS = gql`
  query GetAllDoctors {
    getAllDoctors {
      doctor_id
      name
      specialization
      qualifications
    }
  }
`;

const DoctorSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [doctors, setDoctors] = useState([]);
  const { data, loading, error } = useQuery(GET_ALL_DOCTORS);

  useEffect(() => {
    if (data && data.getAllDoctors) {
      setDoctors(
        data.getAllDoctors.map((doctor) => ({
          id: doctor.doctor_id,
          name: doctor.name,
          specialty: doctor.specialization,
          qualifications: doctor.qualifications,
        }))
      );
    }
  }, [data]);

  if (loading)
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading doctors...</p>
      </div>
    );

  if (error)
    return (
      <div className={styles.errorContainer}>
        <p>Error loading doctors. Please try again later.</p>
      </div>
    );

  const specialties = [
    "All Specialties",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Orthopedic Surgeon",
    "Pediatrician",
    "Psychiatrist",
    "Gynecologist",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      specialty === "" ||
      specialty === "All Specialties" ||
      doctor.specialty === specialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleError = (message) => {
    toast.error(message);
  };

  const handleSuccess = (message) => {
    toast.success(message);
  };

  return (
    <div className={styles.searchContainer}>
      <Toaster position="top-right" />
      <div className={styles.searchHeader}>
        <h1 className={styles.searchTitle}>Find Your Perfect Doctor</h1>
        <p className={styles.searchSubtitle}>
          Search by name or specialty to find the right healthcare provider
        </p>
      </div>

      <div className={styles.searchForm}>
        <form onSubmit={handleSearch}>
          <div className={styles.searchInputGroup}>
            <div className={styles.searchInput}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by doctor name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className={styles.filterInput}>
              <Filter className={styles.filterIcon} />
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              >
                {specialties.map((spec, index) => (
                  <option
                    key={index}
                    value={spec === "All Specialties" ? "" : spec}
                  >
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className={styles.searchButton}>
              Search Doctors
            </button>
          </div>
        </form>
      </div>

      <div className={styles.resultsContainer}>
        <h2 className={styles.resultsTitle}>
          {filteredDoctors.length}{" "}
          {filteredDoctors.length === 1 ? "Doctor" : "Doctors"} Available
        </h2>

        <div className={styles.doctorsList}>
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className={styles.doctorCard}>
              <div className={styles.doctorAvatar}>
                <User className={styles.avatarPlaceholder} />
              </div>

              <div className={styles.doctorInfo}>
                <h3 className={styles.doctorName}>{doctor.name}</h3>
                <p className={styles.doctorSpecialty}>{doctor.specialty}</p>

                <Link
                  to={`/appointment-booking/${doctor.id}`}
                  state={{ doctor }}
                  className={styles.bookButton}
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorSearch;
