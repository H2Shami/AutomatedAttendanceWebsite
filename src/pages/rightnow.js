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
      const result = fetch(link)
        .then((resp) => resp.json())
        .then((record) => {
          setAttendance(record);
        });
    };

    // call expression
    getAttendance();

    /* -=-=-=-=- Below is for dynamic updates (don't remove)-=-=-=--=*/
    const eventSource = new EventSource("http://localhost:8000/check_db");

    eventSource.onmessage = (event) => {
      // Start a refresh
      console.log("event received");
      // Query: All attendance records for this class_id WHERE the timestamp is for the current class_time and date
      getAttendance();
    };

    eventSource.onerror = () => {
      console.log("Event source error");
      eventSource.close();
    };

    return () => eventSource.close();
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

  /* -=-=-=-=-=- Refresh components -- Bottom-up  -=-=-=-=-=-=*/
  /* UseEffect subscribes to changes in "AttendanceRecords" */
  /* AttendanceRecords is the STATE of the students who are present for this current class meeting and is fetched from the DB with a query */
  /* The DB fetch is handled by a server-state management tool like react-query, which can be used to initialize refetches*/
  /* React-query initializes a refetch when we receive a signal from the server, tellling us to update the DB*/
  /* The signal from the server is sent whenever Nano pings attendance insertion endpoint*/

  // console.log(JSON.stringify(studentTable, null, 2));
  // todo: split student table into students who are here and aren't

  const presentStudents = present.map(student => ({
    first_name: student.first_name,
    last_name: student.last_name,
    photo_url: student.photo_url,
  }));

  const absentStudents = absent.map(student => ({
    first_name: student.first_name,
    last_name: student.last_name,
    photo_url: student.photo_url,
  }));
  
  return (
    <>
      <div className={styles["right-now-container"]}>
        <Navbar />
        <div className={styles["right-now-container__content"]}>
          <ClassHeader className={styles["class-header"]} />
          <div
            className={styles["right-now-container__content__student-lists"]}
          >
            <StudentList students={presentStudents} label="Present" />
            <StudentList students={absentStudents} label="Absent" />
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
