'use client'; // Ensure it's a Client Component

import React from 'react';
import { useRouter } from 'next/navigation'; // Correct import for App Router
import '@/styles/sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartSimple,
  faClock,
  faFaceFrown,
  faGear,
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const router = useRouter(); // Correct usage in a Client Component

  const handleFocusClick = () => {
    router.push('/pomodoro'); // Redirect to /pomodoro
  };

  return (
    <div className="sidebar-wrapper">
      <div className="menu">
        <div className="focus-container">
          <button className="timerBtn" onClick={handleFocusClick}>
            Focus
          </button>
          <label className="focusLabel">Start Focusing</label>
        </div>
        <ul>
          <li>
            <FontAwesomeIcon icon={faClock} className="menu-icon" />
            <span>Pomodoro</span>
          </li>
          <li>
            <FontAwesomeIcon icon={faChartSimple} className="menu-icon" />
            <span>Statistics</span>
          </li>
          <li>
            <FontAwesomeIcon icon={faFaceFrown} className="menu-icon" />
            <span>Feeling stuck?</span>
          </li>
          <li>
            <FontAwesomeIcon icon={faGear} className="menu-icon" />
            <span>Settings</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
