import React from 'react';

const FulltimeData = ({ avgTime, highestTime, lowestTime }) => {
  return (
    <>
      <div
        className="dataCont"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="dailyDataCont">
          <div className="dailyDataDiv">
            <p className="dailyDataP">
              Average Study Time (per day): <br />
              <strong>{(avgTime / 60).toFixed(2)}hrs</strong>
            </p>
          </div>
          <div className="dailyDataDiv">
            <p className="dailyDataP">
              Highest Time Ever: <br />{' '}
              <strong>
                {highestTime
                  ? (highestTime.totalTimeFocussed / 60).toFixed(2)
                  : 'N/A'}{' '}
                hrs
              </strong>{' '}
              <br /> <i>at {highestTime ? highestTime.date : 'N/A'}</i>
            </p>
          </div>{' '}
          <div className="dailyDataDiv">
            <p className="dailyDataP">
              Lowest Time Ever: <br />{' '}
              <strong>
                {lowestTime
                  ? (lowestTime.totalTimeFocussed / 60).toFixed(2)
                  : 'N/A'}{' '}
                hrs
              </strong>{' '}
              <br /> <i>at {lowestTime ? lowestTime.date : 'N/A'}</i>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FulltimeData;
