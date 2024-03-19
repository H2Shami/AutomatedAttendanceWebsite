import React from "react";
import styles from "@/styles/StudentList.module.css";
import StudentCard from "@/components/StudentCard";

const StudentList = ({ label, students }) => {
  return (
    <div className={styles.StudentList}>
      <strong>
        <p
          className={
            label == "Present"
              ? styles.StudentList_present
              : styles.StudentList_absent
          }
        >
          {label}
        </p>
      </strong>
      <div>
        {students?.map((item) => (
          <StudentCard key={item.name} imgPath={item.photo_url} name={item.first_name + " " + item.last_name} 
          email={item.email} studentId={item.studentid} />
        ))}
      </div>
    </div>
  );
};

export default StudentList;
