'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlusCircle,
  faClock,
  faFaceFrown,
  faGear,
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const router = useRouter();
  const handleFocusClick = () => {
    router.push('/pomodoro');
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
          <li onClick={() => router.push('pomodoro')}>
            <FontAwesomeIcon icon={faClock} className="menu-icon" />
            <span>Pomodoro</span>
          </li>
          <li onClick={() => router.push('subject-add')}>
            <FontAwesomeIcon icon={faPlusCircle} className="menu-icon" />
            <span>Add Subjects</span>
          </li>
          <li onClick={() => router.push('motivation')}>
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
