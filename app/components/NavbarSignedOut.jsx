import React, { useState } from 'react';
import '@/styles/navbar.css';
import 'mdb-ui-kit/css/mdb.min.css';
import Link from 'next/link';

const NavbarSignedOut = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mdb-navbar-wrapper">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <a className="navbar-brand me-2" href="https://mdbgo.com/">
            <strong>Study.</strong>
          </a>

          {/* Remove data-mdb-toggle, use React state */}
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navbarSupportedContent"
            aria-expanded={isExpanded}
            aria-label="Toggle navigation"
            onClick={handleToggle}
          >
            <i className="fas fa-bars"></i>
          </button>
          <div className="d-flex align-items-center">
            {/* Dynamically add 'show' class */}
            <div
              className={`collapse navbar-collapse ${isExpanded ? 'show' : ''}`}
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Landing
                  </a>
                </li>{' '}
                <li className="nav-item">
                  <a className="nav-link nav-linka" href="#">
                    About
                  </a>
                </li>{' '}
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Features
                  </a>
                </li>
              </ul>
              <Link href="/auth/signup">
                <button type="button" className="sign-in">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavbarSignedOut;
