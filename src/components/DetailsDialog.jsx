import React from "react";
import styles from "./DetailsDialog.module.css";

const DetailsDialog = ({ open, onOpenChange, title, description, details }) => {
  if (!open) return null;

  return (
    <div className={styles.dialogOverlay} onClick={() => onOpenChange(false)}>
      <div
        className={styles.dialogContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.dialogHeader}>
          <h2 className={styles.dialogTitle}>{title}</h2>
          <p className={styles.dialogDescription}>{description}</p>
        </div>
        <div className={styles.dialogBody}>
          <ul className={styles.detailsList}>
            {details.map((detail, index) => (
              <li key={index} className={styles.detailItem}>
                <strong>{detail.label}:</strong> {detail.value}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.dialogFooter}>
          <button
            className={styles.closeButton}
            onClick={() => onOpenChange(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsDialog;
