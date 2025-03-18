'use client';

import React, { useState, useEffect, useRef } from 'react';

const Pomodoro = () => {
  const timerRef = useRef(null);
  const [timer, setTimer] = useState('5:00');
  const [workTime, setWorkTime] = useState(1);
  const [breakTime, setBreakTime] = useState(2);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [remainingTime, setRemainingTime] = useState(workTime * 60);
  const [totalTime, setTotalTime] = useState(0);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const updateTimerDisplay = () => {
    setTimer(formatTime(remainingTime));
  };

  const startTimer = () => {
    if (isRunning) return;

    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          setIsRunning(false);
          handleSessionSwitch();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setIsWorkSession(true);
    setRemainingTime(workTime * 60);
    updateTimerDisplay();
  };

  const handleSessionSwitch = () => {
    setTotalTime(
      (prevTotal) => prevTotal + (isWorkSession ? remainingTime : 0)
    );
    setRemainingTime(isWorkSession ? breakTime * 60 : workTime * 60);
    setIsWorkSession(!isWorkSession);
  };

  const handleWorkTimeChange = (e) => {
    setWorkTime(parseInt(e.target.value, 10) || 0);
  };

  const handleBreakTimeChange = (e) => {
    setBreakTime(parseInt(e.target.value, 10) || 0);
  };

  const applyNewTimes = () => {
    if (isWorkSession) {
      setRemainingTime(workTime * 60);
    } else {
      setRemainingTime(breakTime * 60);
    }
  };

  const handleSessionChange = () => {
    setIsWorkSession(true);
  };

  useEffect(() => {
    updateTimerDisplay();
  }, [remainingTime]);

  return (
    <div>
      <h1>{isWorkSession ? 'Work Session' : 'Break Time'}</h1>
      <h2>{timer}</h2>
      <button onClick={startTimer} disabled={isRunning}>
        Start
      </button>
      <button onClick={pauseTimer} disabled={!isRunning}>
        Pause
      </button>
      <button onClick={resetTimer}>Reset</button>
      <div>
        <label>Work Time (min): </label>
        <input type="number" value={workTime} onChange={handleWorkTimeChange} />
      </div>
      <div>
        <label>Break Time (min): </label>
        <input
          type="number"
          value={breakTime}
          onChange={handleBreakTimeChange}
        />
      </div>
      <h1>Time focussed so far: {Math.floor(totalTime / 60)} min</h1>
      <button onClick={applyNewTimes}>Change</button>
      <button onClick={handleSessionChange}>Working</button>
    </div>
  );
};

export default Pomodoro;
