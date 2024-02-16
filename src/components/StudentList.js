import React from "react";
import styles from "@/styles/StudentList.module.css";
import StudentCard from "@/components/StudentCard";

const StudentList = ({ label, students }) => {
  console.log(label);
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
          <StudentCard imgPath={item.path} name={item.name} info={item.info} />
        ))}
      </div>
    </div>
  );
};

export default StudentList;