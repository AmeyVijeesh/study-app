import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import AuthButton from './AuthButton';
import '@/styles/navbar.css';
import 'mdb-ui-kit/css/mdb.min.css';
import Link from 'next/link';
const NavbarSignedIn = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mdb-navbar-wrapper">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <Link
            className="navbar-brand me-2"
            href="/dashboard"
            style={{ color: '#fff' }}
          >
            <strong>PLStudy.</strong>
          </Link>

          {/* Remove data-mdb-toggle, use React state */}
          <button
            className="navbar-toggler ms-auto"
            type="button"
            aria-controls="navbarSupportedContent"
            aria-expanded={isExpanded}
            aria-label="Toggle navigation"
            onClick={handleToggle}
          >
            <i className="fas fa-bars text-white"></i>
          </button>
          <div
            className={`collapse navbar-collapse w-100 ${
              isExpanded ? 'show' : ''
            }`}
            id="navbarSupportedContent"
            style={{ zIndex: 999, backgroundColor: 'black', width: '100%' }}
          >
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 text-start text-lg-end">
              <li className="nav-item">
                <Link href="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/pomodoro" className="nav-link">
                  Pomodoro
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Settings
                </a>
              </li>
            </ul>
            <AuthButton />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavbarSignedIn;
