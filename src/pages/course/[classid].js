import Navbar from "@/components/Navbar";
import ClassHeader from "@/components/ClassHeader";
import StudentList from "@/components/StudentList";
import styles from "@/styles/RightNow.module.css";
import { PrismaClient } from "@prisma/client";
import { useEffect, useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartArea,
} from "chart.js";
import { Line, Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const prisma = new PrismaClient();

const options = {
  scales: {
    y: {
      min: 0,
      max: 100,
      title: {
        display: true,
        text: "Attendance Rate (%)",
        font: {
          size: 18,
        },
      },
    },
    x: {
      title: {
        display: true,
        text: "Date (2024)",
        font: {
          size: 18,
        },
      },
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

var labels = [
  "April 14",
  "April 16",
  "April 19",
  "April 21",
  "April 26",
  "April 28",
  " ",
];

var attendanceRate = [100, 76, 50, 53, 62, 63, 0];

// chart
const data = {
  labels,
  datasets: [
    {
      label: "Attendance Rate (%)",
      data: attendanceRate,
      borderColor: "rgb(16, 198, 113)",
      backgroundColor: "#adf0a7ff",
      tension: 0.3,
      pointRadius: 10,
      pointHoverRadius: 15,
      fill: true,
    },
  ],
};

export default function Rightnow({ studentTable, classInfo }) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const [attendance, setAttendance] = useState([]);
  const [present, setPresent] = useState([]);
  const [absent, setAbsent] = useState(studentTable);

  /* 1. Find new attendees*/
  useEffect(() => {
    // Immediately invoked function expression
    const getAttendance = async () => {
      const link = new URL(
        `http://localhost:3000/api/getAttendanceForMeeting?classid=${classInfo.classid}&meetingDate=${classInfo.meetingDate}&meetingStart=${classInfo.meetingStart}&meetingEnd=${classInfo.meetingEnd}`
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
    console.log("found new attendees");
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

    // Update chart
    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    labels[labels.length - 1] = "Today";
    attendanceRate[attendanceRate.length - 1] = getTodaysAttendanceRate(
      present.length,
      studentTable.length
    );

    const chartData = {
      ...data,
      datasets: data.datasets.map((dataset) => ({
        ...dataset,
        backgroundColor: createGradient(chart.ctx, chart.chartArea),
      })),
    };

    setChartData(chartData);
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
            title={classInfo.title}
            start_time={classInfo.meetingStart}
            end_time={classInfo.meetingEnd}
            day={classInfo.meetingDay}
            date={classInfo.meetingDate}
          />
          <div
            className={styles["right-now-container__content__student-lists"]}
          >
            <StudentList students={presentStudents} label="Present" />
            <StudentList students={absentStudents} label="Absent" />
          </div>
          <div className={styles["right-now-container__metrics-container"]}>
            <Chart
              ref={chartRef}
              options={options}
              type="line"
              data={chartData}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function createGradient(ctx, area) {
  const colorStart = "#65e99ce4";
  const colorEnd = "#bad2c0c8";

  const gradient = ctx.createLinearGradient(0, area.top, 0, area.bottom);

  gradient.addColorStop(0.4, colorStart);
  gradient.addColorStop(1, colorEnd);

  return gradient;
}

function getTodaysAttendanceRate(numPresent, numStudents) {
  return 100 * (numPresent / numStudents);
}

function getMonthAndDay() {
  var today = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${months[today.getMonth()]} ${today.getDate()}`;
}

// Credit to: https://stackoverflow.com/users/525895/samuel-meddows
function getDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  return today;
}

export async function getServerSideProps(context) {
  const classid = context.query.classid;

  // Grab all students for this class
  const studentResponse = await prisma.enrollments.findMany({
    where: { classid: parseInt(classid) },
    include: { students: true },
  });

  // Parse data to just get student info
  studentResponse.forEach((studentInfo, index) => {
    studentResponse[index] = studentInfo.students;
  });

  const todaysDate = getDate();

  return {
    props: {
      studentTable: studentResponse,
      classInfo: {
        classid: classid,
        title: context.query.title,
        meetingStart: context.query.meetingStart,
        meetingEnd: context.query.meetingEnd,
        meetingDay: context.query.meetingDay,
        meetingDate: todaysDate,
      },
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
