import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./DoctorSearch.module.css";
import { Search, Filter, MapPin, Star, User } from "lucide-react";

const DoctorSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [doctors] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      location: "New York, NY",
      rating: 4.8,
      reviews: 124,
      image: null,
      availableDates: ["2025-04-10", "2025-04-12", "2025-04-15"],
    },
    {
      id: 2,
      name: "Dr. Michael Patel",
      specialty: "Dermatologist",
      location: "Boston, MA",
      rating: 4.6,
      reviews: 98,
      image: null,
      availableDates: ["2025-04-09", "2025-04-11", "2025-04-14"],
    },
    {
      id: 3,
      name: "Dr. Emma Wilson",
      specialty: "Neurologist",
      location: "Chicago, IL",
      rating: 4.9,
      reviews: 156,
      image: null,
      availableDates: ["2025-04-08", "2025-04-10", "2025-04-13"],
    },
    {
      id: 4,
      name: "Dr. James Rodriguez",
      specialty: "Orthopedic Surgeon",
      location: "Miami, FL",
      rating: 4.7,
      reviews: 112,
      image: null,
      availableDates: ["2025-04-09", "2025-04-12", "2025-04-16"],
    },
  ]);

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
    // In a real app, you would fetch filtered results from the server
    console.log("Searching for:", searchTerm, specialty);
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

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchHeader}>
        <h1 className={styles.searchTitle}>Find the Right Doctor</h1>
        <p className={styles.searchSubtitle}>
          Search by name, specialty, or location
        </p>
      </div>

      <div className={styles.searchForm}>
        <form onSubmit={handleSearch}>
          <div className={styles.searchInputGroup}>
            <div className={styles.searchInput}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search doctors..."
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
              Search
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
                {doctor.image ? (
                  <img src={doctor.image} alt={doctor.name} />
                ) : (
                  <User className={styles.avatarPlaceholder} />
                )}
              </div>

              <div className={styles.doctorInfo}>
                <h3 className={styles.doctorName}>{doctor.name}</h3>
                <p className={styles.doctorSpecialty}>{doctor.specialty}</p>

                <div className={styles.doctorMeta}>
                  <div className={styles.doctorLocation}>
                    <MapPin className={styles.metaIcon} />
                    <span>{doctor.location}</span>
                  </div>

                  <div className={styles.doctorRating}>
                    <Star className={styles.metaIcon} />
                    <span>
                      {doctor.rating} ({doctor.reviews} reviews)
                    </span>
                  </div>
                </div>

                <div className={styles.availabilityText}>
                  Next available:{" "}
                  {new Date(doctor.availableDates[0]).toLocaleDateString()}
                </div>

                <Link
                  to={`/appointment-booking/${doctor.id}`}
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
