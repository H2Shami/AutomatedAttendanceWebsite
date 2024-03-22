import Navbar from "@/components/Navbar";
import ClassHeader from "@/components/ClassHeader";
import StudentList from "@/components/StudentList";
import styles from "@/styles/RightNow.module.css";
import { PrismaClient } from "@prisma/client";
import { useEffect, useState } from "react";

const prisma = new PrismaClient();

export default function Rightnow({studentTable}) {
  
  const studentListData = studentTable.map(student => ({
    first_name: student.first_name,
    last_name: student.last_name,
    imgPath: student.imgPath,
  }));

  console.log(JSON.stringify(studentTable, null, 2));
  return (
    <>
      <div className={styles["right-now-container"]}>
        <Navbar />
        <div className={styles["right-now-container__content"]}>
          <ClassHeader className={styles["class-header"]} />
          <div
            className={styles["right-now-container__content__student-lists"]}
          >
            <StudentList students={studentListData} label="Present" />
            <StudentList students={studentListData} label="Absent" />
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  //Grab all students
  // ? Do we filter this so we retrieve only students for this class and the date?
  const studentResponse = await prisma.students.findMany();

  return {
    props: {
      studentTable: studentResponse,
    },
  };
}
