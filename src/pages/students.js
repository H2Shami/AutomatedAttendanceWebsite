import Navbar from "@/components/Navbar"
import StudentList from "@/components/StudentList"
import styles from "@/styles/Students.module.css"

let students = [
    {
      path: "/favicon.ico",
      name: "Alyssa Johnson",
    },
    {
      path: "/favicon.ico",
      name: "Bob Smith",
    },
    {
      path: "/favicon.ico",
      name: "Eva Lee",
    },
    {
      path: "/favicon.ico",
      name: "Hammy Shammy",
    },
    {
      path: "/favicon.ico",
      name: "Bob Smithy",
    },
    {
      path: "/favicon.ico",
      name: "Eva Leenie",
    },
  ];

export default function Students() {
    return(
        <div className={styles.mainLayout}>
            <Navbar />
            <StudentList students={students} label="Students" />
        </div>
    )
}