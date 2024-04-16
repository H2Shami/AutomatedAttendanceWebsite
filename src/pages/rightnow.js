import Navbar from "@/components/Navbar";
import ClassHeader from "@/components/ClassHeader";
import StudentList from "@/components/StudentList";
import styles from "@/styles/RightNow.module.css";
import { PrismaClient } from "@prisma/client";
import { useEffect, useState } from "react";

const prisma = new PrismaClient();

//-=-=-=-=-=-=  Demo date mock data -=-=-=-=-=-=-=

var rightNow = new Date(); // Date is NOT based on any pulled class data
var hours = rightNow.getHours(); // Pull hours metric only to avoid refresh errors

let currentClass = {
  classid: 2222,
  classTitle: "CMPE155 - 02 Java Programming",
  meetingDate: rightNow.toLocaleDateString(),
  meetingStart: convertToAMPM(hours), // The class time produced is the current_hour -> current_hour + 2 (eg: 5:00pm - 7:00pm)
  meetingEnd: convertToAMPM(hours + 2),
  day: convertToWeekday(rightNow.getDay()),
};

function convertToWeekday(num) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekday[num];
}
function convertToAMPM(hours) {
  var timeValue = hours;
  if (hours > 0 && hours <= 12) {
    timeValue = "" + hours;
  } else if (hours > 12) {
    timeValue = "" + (hours - 12);
  } else if (hours == 0) {
    timeValue = "12";
  }
  timeValue += ":00";
  timeValue += hours >= 12 ? " PM" : " AM"; // get AM/PM
  return timeValue;
}

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

  const presentStudents = present.map((student) => ({
    first_name: student.first_name,
    last_name: student.last_name,
    photo_url: student.photo_url,
  }));

  const absentStudents = absent.map((student) => ({
    first_name: student.first_name,
    last_name: student.last_name,
    photo_url: student.photo_url,
  }));

  return (
    <>
      <div className={styles["right-now-container"]}>
        <Navbar />
        <div className={styles["right-now-container__content"]}>
          <ClassHeader
            className={styles["class-header"]}
            day={currentClass.day}
            title={currentClass.classTitle}
            start_time={currentClass.meetingStart}
            end_time={currentClass.meetingEnd}
            date={currentClass.meetingDate}
          />
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
