import React from "react";
import styles from "@/styles/StudentCard.module.css";

const StudentCard = ({ imgPath, name, email, studentId }) => {
  return (
    <div className={styles.StudentCard}>
      <img src={imgPath} alt={"Student Thumbnail"} />
      <div>
        <p>{name}</p>
        <p>{email}</p>
        <p>{studentId}</p>
      </div>
    </div>
  );
};

export default StudentCard;
