import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import AuthButton from './AuthButton';

const NavbarSignedIn = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
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
                  Dashboard
                </a>
              </li>{' '}
              <li className="nav-item">
                <a className="nav-link nav-linka" href="#">
                  Focus
                </a>
              </li>{' '}
              <li className="nav-item">
                <a className="nav-link" href="#">
                  About
                </a>
              </li>
            </ul>

            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarSignedIn;
