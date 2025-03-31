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
              Average Study Time: <br />
              <strong>{(avgTime / 60).toFixed(2)}hrs</strong>
            </p>
          </div>
          <div className="dailyDataDiv">
            <p className="dailyDataP">
              Highest Time Ever: <br /> <strong>0.5hrs</strong> <br />{' '}
              <i>at 24-03-1991</i>
            </p>
          </div>{' '}
          <div className="dailyDataDiv">
            <p className="dailyDataP">
              Lowest Time Ever: <br /> <strong>34</strong> <br />{' '}
              <i>at 24-03-1991</i>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FulltimeData;
