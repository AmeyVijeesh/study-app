import React from 'react';

const DailyData = () => {
  return (
    <>
      <div className="dailyDataCont">
        <div className="dailyDataDiv">
          <p className="dailyDataP">
            Total time Focused: <br /> <strong>26.2hrs</strong>
          </p>
        </div>
        <div className="dailyDataDiv">
          <p className="dailyDataP">
            Time Focused Today: <br /> <strong>0.5hrs</strong>
          </p>
        </div>{' '}
        <div className="dailyDataDiv">
          <p className="dailyDataP">
            Number of Sessions Today: <br /> <strong>34</strong>
          </p>
        </div>
      </div>
    </>
  );
};

export default DailyData;
