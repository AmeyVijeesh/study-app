import React, { useState } from 'react';
import '@/styles/navbar.css';
import 'mdb-ui-kit/css/mdb.min.css';
import Link from 'next/link';
import AuthButton from './AuthButton';

const NavbarSignedOut = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mdb-navbar-wrapper">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <a
            className="navbar-brand me-2"
            href="https://mdbgo.com/"
            style={{ color: '#fff' }}
          >
            <strong>Study.</strong>
          </a>

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
          >
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 text-start text-lg-end">
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Landing
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link nav-linka" href="#">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Features
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

export default NavbarSignedOut;
