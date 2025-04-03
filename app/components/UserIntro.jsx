import React, { useEffect, useState } from 'react';

const UserIntro = ({ username }) => {
  const [currentTime, setCurrentTime] = useState();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dayOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      };
      const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };

      const formattedDate = now.toLocaleDateString('en-US', dayOptions);
      const formattedTime = now.toLocaleTimeString('en-US', timeOptions);

      setCurrentTime(`${formattedDate} | ${formattedTime}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);
  const getTimeOfDay = () => {
    const hr = new Date().getHours();

    if (hr >= 5 && hr < 12) return 'morning';
    if (hr >= 12 && hr < 18) return 'afternoon';
    return 'evening';
  };
  return (
    <div className="dash-intro">
      <h1 className="dash-title">
        Good {getTimeOfDay()},{' '}
        {username.charAt(0).toUpperCase() + username.slice(1)}!
      </h1>
      <p>{currentTime}</p>
    </div>
  );
};

export default UserIntro;
