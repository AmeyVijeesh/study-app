'use client';

import React, { useState, useEffect } from 'react';
import { faF, faFire } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Streak = ({ userId }) => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchStreak = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/streak?userId=${userId}`);
        const data = await response.json();
        setStreak(data.streak || 0);
      } catch (error) {
        console.error('Error fetching streak:', error);
      }
    };

    fetchStreak();
  }, [userId]);

  return (
    <>
      <div>
        <div className="streakCont">
          <FontAwesomeIcon icon={faFire} className="streakIcon" />
          <p className="streakTitle">Streak</p>
          <h2 className="streakText">
            {streak} {streak === 1 ? 'DAY' : 'DAYS'}
          </h2>
        </div>
        <div className="streakCont highestStreakCont">
          <FontAwesomeIcon
            icon={faFire}
            className="streakIcon highestStreakIcon"
          />
          <p className="streakTitle">Highest Streak so Far</p>
          <h2 className="streakText">
            {streak} {streak === 1 ? 'DAY' : 'DAYS'}
          </h2>
        </div>
      </div>
    </>
  );
};

export default Streak;
