import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import StudentCard from "@/components/StudentCard";
import StudentList from "@/components/StudentList";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    let student = [
        {
            "path": "/favicon.ico",
            "name": "Alice Johnson",
            "info": "Computer Science major"
        },
        {
            "path": "/favicon.ico",
            "name": "Bob Smith",
            "info": "Mathematics major"
        },
        {
            "path": "/favicon.ico",
            "name": "Eva Lee",
            "info": "Physics major"
        },
        {
            "path": "/favicon.ico",
            "name": "Alice Johnson",
            "info": "Computer Science major"
        },
        {
            "path": "/favicon.ico",
            "name": "Bob Smith",
            "info": "Mathematics major"
        },
        {
            "path": "/favicon.ico",
            "name": "Eva Lee",
            "info": "Physics major"
        }
    ]

    return (
    <>
      <Head>
        <title>Automated Attendance</title>
        <meta name="description" content="Manage your automatic attendance device remotely!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
          <StudentCard imgPath={"/favicon.ico"} name={"Hammad"} info={"Arrived at:"}/>
          <StudentList students={student}/>
      </main>
    </>
  )
}
