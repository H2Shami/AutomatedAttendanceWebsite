import Navbar from "@/components/Navbar";
import styles from "@/styles/Courses.module.css";
import DividerSvg from "../icons/Divider.jsx";
import { FaPlus } from "react-icons/fa";
import { PrismaClient } from "@prisma/client";
import { arrayOf } from "prop-types";
import Link from "next/link";

// var data = [
//   {
//     classid: 2222,
//     color: "#3492cd",
//     classCode: "CS146",
//     section: "02",
//     className: "Data Structures and Algorithms",
//     meetingDay: "Tuesday",
//     meetingStart: "3:00",
//     meetingEnd: "4:15",
//   },
//   {
//     classid: 3333,
//     color: "#efb14e",
//     classCode: "CMPE188",
//     section: "01",
//     className: "Machine Learning and Big Data",
//     meetingDay: "Tuesday",
//     meetingStart: "10:00",
//     meetingEnd: "11:15",
//   },2024-04-12 09:06:39
// ];

const prisma = new PrismaClient();

export default function Courses({ data }) {
  return (
    <>
      <div className={styles["courses-container"]}>
        <Navbar />
        <div>
          <div className={styles["top-container"]}>
            <span className={styles["top-container__title"]}>
              {" "}
              Your Courses
            </span>
            <DividerSvg />
            <button className={styles["add-class-button"]}>
              Add a class <FaPlus color={"#202020"} size={17} />{" "}
            </button>
          </div>
          <div className={styles["courses-container__content"]}>
            <CourseCards courseData={data} />
          </div>
        </div>
      </div>
    </>
  );
}

function CourseCards({ courseData }) {
  return courseData.map((data) => {
    const title = `${data.classCode}-${data.section} ${data.className}`;
    const meetingTime = `${data.meetingStart}-${data.meetingEnd}`;
    return (
      <Link
        href={{
          pathname: "/course/[id]",
          query: {
            id: parseInt(data.classid),
            title: title,
            meetingStart: data.meetingStart,
            meetingEnd: data.meetingEnd,
            meetingDay: data.meetingDay,
          },
        }}
      >
        <Course
          color={data.color}
          classCode={data.classCode}
          section={data.section}
          className={data.className}
          meetingDay={data.meetingDay}
          meetingTime={meetingTime}
        />
      </Link>
    );
  });
}

// concerned with purely displaying data
function Course({
  color,
  classCode,
  section,
  className,
  meetingDay,
  meetingTime,
}) {
  var image_url =
    "https://img.freepik.com/free-vector/hand-drawn-science-education-background_23-2148499325.jpg";
  return (
    <div
      className={styles["course-container"]}
      style={{
        backgroundColor: `${color}`,
        filter: `drop-shadow(0px 0px 6px ${color})`,
      }}
    >
      <img className={styles["course-container__photo"]} src={image_url} />
      {meetingDay} | {meetingTime}
      <br />
      <b className={styles["course-container__title"]}>{className}</b>
      <br />
      <span className={styles["course-container__meeting-info"]}>
        {classCode} - {section}
      </span>
    </div>
  );
}

function parseClassData(classes) {
  return classes.map((data) => ({
    classid: data.classid,
    section: "02",
    classCode: "CMPE188",
    className: data.class_name,
    meetingDay: convertToWeekday(data.days),
    meetingStart: "3:00",
    meetingEnd: "4:00",
    color: `#${data.color}`,
  }));
}

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

export async function getServerSideProps() {
  // Grab all students for this class
  const classesResponse = await prisma.classes.findMany({});

  // console.log(classesResponse);
  const parsedData = parseClassData(classesResponse);
  console.log(parsedData);
  return {
    props: {
      data: parsedData,
    },
  };
}
