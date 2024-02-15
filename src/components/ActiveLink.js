import { useRouter } from 'next/router';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styles from '@/styles/Navbar.module.css'

const ActiveLink = ({ href, children }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <li className={isActive ? styles.active : ''}>
      <Link href={href}>{children}</Link>
    </li>
  );
};

ActiveLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default ActiveLink;
