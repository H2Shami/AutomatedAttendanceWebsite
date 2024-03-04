import Navbar from "@/components/Navbar"
import StudentList from "@/components/StudentList"

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
        <>
            <Navbar />
            <StudentList students={students} label="Students" />
        </>
    )
}