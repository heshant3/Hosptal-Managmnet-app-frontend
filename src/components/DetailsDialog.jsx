import React, { useState } from "react";
import styles from "./DetailsDialog.module.css";
import { FaTimes } from "react-icons/fa"; // Import close icon

const DetailsDialog = ({
  open,
  onOpenChange,
  title,
  description,
  details,
  onCancel,
}) => {
  const [showImage, setShowImage] = useState(false); // Keep useState for potential future use
  const appointmentId = details.find(
    (detail) => detail.label === "Appointment ID"
  )?.value;

  if (!open) return null;

  const imageDetail = details.find(
    (detail) => detail.label === "Image" && detail.value
  );

  return (
    <div className={styles.dialogOverlay} onClick={() => onOpenChange(false)}>
      <div
        className={styles.dialogContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.dialogHeader}>
          <button
            className={styles.closeButton}
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <FaTimes />
          </button>
          <h2 className={styles.dialogTitle}>{title}</h2>
          <p className={styles.dialogDescription}>{description}</p>
        </div>
        <div className={styles.dialogBody}>
          <ul className={styles.detailsList}>
            {details
              .filter((detail) => detail.label !== "Image")
              .map((detail, index) => (
                <li key={index} className={styles.detailItem}>
                  <strong>{detail.label}:</strong> {detail.value}
                </li>
              ))}
          </ul>
          {imageDetail && (
            <button
              className={`${styles.button} ${styles.imageButton}`}
              onClick={() => window.open(imageDetail.value, "_blank")}
            >
              View Medical Record
            </button>
          )}
        </div>
        <div className={styles.dialogFooter}>
          <button
            className={styles.closeButton}
            onClick={() => onOpenChange(false)}
          >
            Close
          </button>
          {onCancel && (
            <button
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={() => {
                if (onCancel) {
                  const intAppointmentId = parseInt(appointmentId, 10); // Convert appointmentId to an integer
                  onCancel(intAppointmentId); // Pass intAppointmentId to the onCancel function
                }
                onOpenChange(false); // Close the dialog
              }}
            >
              Cancel Appointment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsDialog;
