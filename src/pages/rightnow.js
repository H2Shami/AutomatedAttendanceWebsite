import Navbar from "@/components/Navbar";
import ClassHeader from "@/components/ClassHeader";
import StudentList from "@/components/StudentList";
import styles from "@/styles/RightNow.module.css";
import { PrismaClient } from "@prisma/client";
import { useEffect, useState } from "react";

const prisma = new PrismaClient();

// Mock data
let currentClass = {
  classid: 2222,
  meetingDate: "03/24/2024",
  meetingStart: "9:00",
  meetingEnd: "10:15",
};

let students = [
  {
    path: "/favicon.ico",
    name: "Alyssa Johnson",
    info: "Arrived 11:50pm",
  },
  {
    path: "/favicon.ico",
    name: "Bob Smith",
    info: "Arrived 11:50pm",
  },
  {
    path: "/favicon.ico",
    name: "Eva Lee",
    info: "Arrived 11:50pm",
  },
  {
    path: "/favicon.ico",
    name: "Alice Johnson",
    info: "Arrived 11:50pm",
  },
  {
    path: "/favicon.ico",
    name: "Bob Smithy",
    info: "Arrived 11:50pm",
  },
  {
    path: "/favicon.ico",
    name: "Eva Leenie",
    info: "Arrived 11:50pm",
  },
];

// const attendanceRecords = [{ studentid: 987987987 }, { studentid: 123123123 }];

// async function getAttendance() {
//   const link = new URL(
//     `http://localhost:3000/api/getAttendanceForMeeting?classid=${currentClass.classid}&meetingDate=${currentClass.meetingDate}&meetingStart=${currentClass.meetingStart}&meetingEnd=${currentClass.meetingEnd}`
//   );
//   const attendance = await fetch(link);
//   return attendance;
// }

export default function Rightnow({ studentTable }) {
  const [attendance, setAttendance] = useState([]);
  const [present, setPresent] = useState([]);
  const [absent, setAbsent] = useState(studentTable);

  /* 1. Find new attendees*/
  useEffect(() => {
    // Immediately invoked function expression
    const getAttendance = async () => {
      const link = new URL(
        `http://localhost:3000/api/getAttendanceForMeeting?classid=${currentClass.classid}&meetingDate=${currentClass.meetingDate}&meetingStart=${currentClass.meetingStart}&meetingEnd=${currentClass.meetingEnd}`
      );
      fetch(link)
        .then((resp) => resp.json())
        .then((record) => {
          setAttendance(record);
        });
      // result.then((result) => {
      //   setAttendance(result);
      // });
    };

    // call expression
    // const test = getAttendance();

    /* -=-=-=-=- Below is for dynamic updates (don't remove)-=-=-=--=*/
    // const eventSource = new EventSource(
    //   "http://localhost:8000/attendance_record"
    // );

    // eventSource.onmessage = (event) => {
    //   // Start a refresh
    //   console.log("event received");
    //   // Query: All attendance records for this class_id WHERE the timestamp is for the current class_time and date

    //   setPresent(
    //     studentTable.filter((student) => {
    //       return studentInList(student.student_id, attendanceRecords);
    //     })
    //   );
    //   setAbsent(
    //     studentTable.filter((student) => {
    //       return !studentInList(student.student_id, attendanceRecords);
    //     })
    //   );
    // };

    // return () => eventSource.close();
  }, []);

  /* 2. Update the page if we find new attendees (i.e: when the above use effect is called)*/
  useEffect(() => {
    setPresent(
      studentTable.filter((student) => {
        return studentInList(student.studentid, attendance);
      })
    );
    setAbsent(
      studentTable.filter((student) => {
        return !studentInList(student.studentid, attendance);
      })
    );
  }, [attendance]);

  return (
    <>
      <div className={styles["right-now-container"]}>
        <Navbar />
        <div className={styles["right-now-container__content"]}>
          <ClassHeader className={styles["class-header"]} />
          <div
            className={styles["right-now-container__content__student-lists"]}
          >
            <StudentList students={present} label="Present" />
            <StudentList students={absent} label="Absent" />
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  // Grab all students for this class
  const studentResponse = await prisma.enrollments.findMany({
    where: { classid: currentClass.classid },
    include: { students: true },
  });

  // Parse data to just get student info
  studentResponse.forEach((studentInfo, index) => {
    studentResponse[index] = studentInfo.students;
  });

  console.log(studentResponse);
  return {
    props: {
      studentTable: studentResponse,
    },
  };
}

function studentInList(target_id, studentList) {
  for (let i = 0; i < studentList.length; i++) {
    if (studentList[i].studentid == target_id) {
      return true;
    }
  }
  return false;
}
