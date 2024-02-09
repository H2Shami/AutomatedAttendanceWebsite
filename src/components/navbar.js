// components/Navbar.js
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Navbar.module.css'

function Navbar() {
  return (
    <div className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul>
          <li className={styles.active}>
            <Link href="/">
              <p><i className="bi bi-calendar-event"></i>  Right Now</p>
            </Link>
          </li>
          <li>
            <Link href="/courses">
              <p><i className="bi bi-hdd-stack"></i>  Courses</p>
            </Link>
          </li>
          <li>
            <Link href="/students">
              <p><i className="bi bi-people"></i> Students</p>
            </Link>
          </li>
          <li>
            <Link href="/logout">
              <p><i className="bi bi-box-arrow-right"></i> Logout</p>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;