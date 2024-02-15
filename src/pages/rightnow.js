import Navbar from "@/components/Navbar";
import ClassHeader from "./RightNow/ClassHeader/ClassHeader";
import StudentList from "@/components/StudentList";
import styles from "@/styles/RightNow.module.css";

let students = [
  {
    path: "/favicon.ico",
    name: "Alice Johnson",
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
    name: "Bob Smith",
    info: "Arrived 11:50pm",
  },
  {
    path: "/favicon.ico",
    name: "Eva Lee",
    info: "Arrived 11:50pm",
  },
];

export default function Rightnow() {
  return (
    <>
      <div className={styles["right-now-container"]}>
        <Navbar />
        <div className={styles["right-now-container__content"]}>
          <ClassHeader className={styles["class-header"]} />
          <div
            className={styles["right-now-container__content__student-lists"]}
          >
            <StudentList students={students} label="Present" />
            <StudentList students={students} label="Absent" />
          </div>
        </div>
      </div>
    </>
  );
}
