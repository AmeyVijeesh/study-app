import React from 'react';

const UserIntro = ({ username }) => {
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
    </div>
  );
};

export default UserIntro;
