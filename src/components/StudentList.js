import React from 'react';
import styles from '@/styles/StudentList.module.css';
import StudentCard from "@/components/StudentCard";

const StudentList = ({students}) => {


  return (
      <div className={styles.StudentList}>
          <strong><p>Present</p></strong>
          <div>
          {students?.map((item) => (<StudentCard imgPath={item.path} name={item.name} info={item.info}/>))}
          </div>
      </div>
    );
};

export default StudentList;