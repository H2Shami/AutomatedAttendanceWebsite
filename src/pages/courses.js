import Navbar from "@/components/Navbar";
import styles from "@/styles/Courses.module.css";
import DividerSvg from "../icons/Divider.jsx";
import { FaPlus } from "react-icons/fa";
import { PrismaClient } from "@prisma/client";
import { arrayOf } from "prop-types";

let profID = 202

export default function Courses({ classesTable }) {
  return (
    <>
      <div className={styles["courses-container"]}>
        <Navbar />
        <div>
          {" "}
          <div className={styles["top-container"]}>
            <span className={styles["top-container__title"]}>Your Courses</span>
            <DividerSvg />
            <button className={styles["add-class-button"]}>
              Add a class <FaPlus color={"#202020"} size={17} />{" "}
            </button>
          </div>
          <div className={styles["courses-container__content"]}>
            <Course
              color="#3492cd"
              classCode="CS146"
              section="02"
              className="Data Structures and Algorithms"
              meetingDay="Tues"
              meetingTime="3:00-4:00"
            />
            {classesTable?.map((course) => (
              <Course 
                key={course.classid} 
                color={`#${course.color}`} 
                classCode={course.class_name}
                section={course.classid}
                className={course.class_name}
                meetingDay={course.days}
                meetingTime="3:00-4:00"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

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


export async function getServerSideProps() {
  const prisma = new PrismaClient();

  // Grab all classes for this professor
  const classResponse = await prisma.classes.findMany({
    where: { professorid: profID }
  });

  return {
    props: {
      classesTable: classResponse,
    },
  };
}