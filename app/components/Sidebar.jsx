import React from 'react';
import '@/styles/sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartSimple,
  faClock,
  faFaceFrown,
  faGear,
  faArrowUp,
  faArrowDown,
  faStopwatch,
} from '@fortawesome/free-solid-svg-icons';
import Subjects from './Subjects';

const Sidebar = ({
  totalStudyTimeObj,
  avgTime,
  highestTime,
  highestTimeDate,
  lowestTime,
  lowestTimeDate,
}) => {
  return (
    <>
      {/* Sidebar Menu */}
      <div className="menu">
        <div className="focus-container">
          <button className="timerBtn">Focus</button>
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

      {/* Pomodoro Stats Section */}
      <div className="pie">
        <h2 className="stats-title">Pomodoro Stats</h2>
        <div className="stats-container">
          <div className="stat-item">
            <FontAwesomeIcon icon={faStopwatch} className="stat-icon avg" />
            <p className="stat-label">Avg time so far</p>
            <p className="stat-value">{avgTime} mins</p>
          </div>
          <div className="stat-item">
            <FontAwesomeIcon icon={faArrowUp} className="stat-icon high" />
            <p className="stat-label">Highest</p>
            <p className="stat-value">
              {highestTime} mins{' '}
              <span className="stat-date">@ {highestTimeDate}</span>
            </p>
          </div>
          <div className="stat-item">
            <FontAwesomeIcon icon={faArrowDown} className="stat-icon low" />
            <p className="stat-label">Lowest</p>
            <p className="stat-value">
              {lowestTime} min{' '}
              <span className="stat-date">@ {lowestTimeDate}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="pie">
        <h2 className="stats-title">Your Subjects</h2>
        <div className="stats-container">
          {totalStudyTimeObj
            ? Object.entries(totalStudyTimeObj).map(([subjectName, time]) => (
                <div key={subjectName} className="stat-item">
                  <p className="stat-label">{subjectName}</p>
                  <p className="stat-value">{time} mins</p>
                </div>
              ))
            : 'None...yet'}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
