import Navbar from "@/components/Navbar"
import StudentList from "@/components/StudentList"
import styles from "@/styles/Students.module.css"
import {PrismaClient} from "@prisma/client";

export default function Students({studentTable}) {
    console.log(JSON.stringify(studentTable, null, 2));
    return(
        <div className={styles.mainLayout}>
            <Navbar />
            <StudentList students={studentTable} label="Students" />
        </div>
    )
}

export async function getServerSideProps() {
  const prisma = new PrismaClient();

  //Grab all students
  const studentResponse = await prisma.students.findMany();

  return {
    props: {
      studentTable: studentResponse
    },
  };
}