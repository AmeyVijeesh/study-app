import React from 'react';
import DailyGraph from './DailyGraph';

const DailyData = ({ totalTime, timeToday, sessionsToday }) => {
  return (
    <>
      <div className="dataCont">
        <div className="dailyDataCont">
          <div className="dailyDataDiv">
            <p className="dailyDataP">
              Total time Focused: <br />{' '}
              <strong>{(totalTime / 60).toFixed(2)} hrs</strong>
            </p>
          </div>
          <div className="dailyDataDiv">
            <p className="dailyDataP">
              Time Focused Today: <br />{' '}
              <strong>{(timeToday / 60).toFixed(2)}hrs</strong>
            </p>
          </div>{' '}
          <div className="dailyDataDiv">
            <p className="dailyDataP">
              Number of Sessions Today: <br /> <strong>{sessionsToday}</strong>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DailyData;
