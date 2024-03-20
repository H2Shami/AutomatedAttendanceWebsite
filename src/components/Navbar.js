// components/Navbar.js
import ActiveLink from "./ActiveLink";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Navbar.module.css";

function Navbar() {
  return (
    <div className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul>
          <ActiveLink href="/rightnow">
            <i className="bi bi-calendar-event"></i> Right Now
          </ActiveLink>
          <ActiveLink href="/courses">
            <i className="bi bi-hdd-stack"></i> Courses
          </ActiveLink>
          <ActiveLink href="/students">
            <i className="bi bi-people"></i> Students
          </ActiveLink>
          <ActiveLink href="/">
            <i className="bi bi-box-arrow-right"></i> Logout
          </ActiveLink>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
