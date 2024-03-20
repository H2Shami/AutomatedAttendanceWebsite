import Navbar from "@/components/Navbar";
import ClassHeader from "@/components/ClassHeader";
import StudentList from "@/components/StudentList";
import styles from "@/styles/RightNow.module.css";

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


  console.log(JSON.stringify(studentTable, null, 2));
  return (
    <>
      <div className={styles["right-now-container"]}>
        <Navbar />
        <div className={styles["right-now-container__content"]}>
          <ClassHeader className={styles["class-header"]} />
          <div
            className={styles["right-now-container__content__student-lists"]}
          >
            <StudentList students={studentTable} label="Present" />
            <StudentList students={studentTable} label="Absent" />
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const prisma = new PrismaClient();

  //Grab all students
  // const studentResponse = await prisma.students.findMany();

  return {
    props: {
      // studentTable: studentResponse,
    },
  };
}
