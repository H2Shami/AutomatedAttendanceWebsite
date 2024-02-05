// components/Navbar.js
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css'; // Make sure to create this CSS module

function Navbar() {
  return (
    <div className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul>
          <li className={styles.active}>
            <Link href="/">
              <a>Right Now</a>
            </Link>
          </li>
          <li>
            <Link href="/courses">
              <a>Courses</a>
            </Link>
          </li>
          <li>
            <Link href="/students">
              <a>Students</a>
            </Link>
          </li>
          <li>
            <Link href="/logout">
              <a>Logout</a>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;