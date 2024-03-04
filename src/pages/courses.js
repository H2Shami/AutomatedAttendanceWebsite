import Navbar from "@/components/Navbar";
import styles from "@/styles/Courses.module.css";
import { arrayOf } from "prop-types";

export default function Courses() {
  return (
    <>
      <div className={styles["courses-container"]}>
        <Navbar />
        <div className={styles["courses-container__content"]}>
          <Course
            color="#3492cd"
            classCode="CS146"
            section="02"
            className="Data Structures and Algorithms"
            meetingDay="Tues"
            meetingTime="3:00-4:00"
          />
          <Course
            color="#f4b030"
            classCode="CS146"
            section="02"
            className="Data Structures and Algorithms"
            meetingDay="Tues"
            meetingTime="3:00-4:00"
          />
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
