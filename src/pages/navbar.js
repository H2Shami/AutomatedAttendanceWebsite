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
              <p>Right Now</p>
            </Link>
          </li>
          <li>
            <Link href="/courses">
              <p>Courses</p>
            </Link>
          </li>
          <li>
            <Link href="/students">
              <p>Students</p>
            </Link>
          </li>
          <li>
            <Link href="/logout">
              <p>Logout</p>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;