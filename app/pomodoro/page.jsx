'use client';

import React, { useState, useEffect, useRef } from 'react';

const Pomodoro = () => {
  const timerRef = useRef(null);
  const [timer, setTimer] = useState('5:00');
  const [workTime, setWorkTime] = useState(0.1);
  const [shortBreakTime, setShortBreakTime] = useState(0.2);
  const [longBreakTime, setLongBreakTime] = useState(0.5); // Define long break time
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [remainingTime, setRemainingTime] = useState(workTime * 60);
  const [totalTime, setTotalTime] = useState(0);
  const [workSessionCount, setWorkSessionCount] = useState(0);
  const [tempWorkTime, setTempWorkTime] = useState(0);
  const [tempShortBreakTime, setTempShortBreakTime] = useState(0);
  const [tempLongBreakTime, setTempLongBreakTime] = useState(0);

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
    setWorkSessionCount(0);
    setRemainingTime(workTime * 60);
    updateTimerDisplay();
  };

  const handleSessionSwitch = async () => {
    if (isWorkSession) {
      setWorkSessionCount((prevCount) => prevCount + 1);
      setTotalTime((prevTotal) => {
        const newTotal = prevTotal + workTime * 60;
        updateTotalWorkTime(newTotal);
        return newTotal;
      });
    }

    setIsWorkSession((prevSession) => {
      const newSession = !prevSession;
      setRemainingTime(
        newSession
          ? workTime * 60
          : (workSessionCount + 1) % 3 === 0
          ? longBreakTime * 60
          : shortBreakTime * 60
      );
      return newSession;
    });
  };

  const updateTotalWorkTime = async (newTotalWorkTime) => {
    try {
      const response = await fetch('/api/updateWorkTime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalWorkTime: Math.floor(newTotalWorkTime / 60), // Ensure it's an integer
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update work time');
      }

      const data = await response.json();
      console.log('Total work time updated:', data.totalWorkTime);
    } catch (error) {
      console.error('Error updating work time:', error);
    }
  };

  useEffect(() => {
    updateTimerDisplay();
  }, [remainingTime]);

  const handleSetNewTime = () => {
    setWorkTime(tempWorkTime);
    setShortBreakTime(tempShortBreakTime);
    setLongBreakTime(tempLongBreakTime);
    setRemainingTime(
      isWorkSession
        ? tempWorkTime * 60
        : (workSessionCount + 1) % 3 === 0
        ? tempLongBreakTime * 60
        : tempShortBreakTime * 60
    );
  };

  const handleNextClick = () => {
    setIsWorkSession((prev) => {
      const newSession = !prev;

      setWorkSessionCount((prevCount) => {
        const newCount = newSession ? prevCount + 1 : prevCount; // Increment only when switching to work
        if (!newSession) {
          // If switching to a break
          if (newCount % 3 === 0) {
            setRemainingTime(longBreakTime * 60);
          } else {
            setRemainingTime(shortBreakTime * 60);
          }
        } else {
          setRemainingTime(workTime * 60);
        }
        return newCount;
      });

      return newSession;
    });
  };

  return (
    <div>
      <h1>
        {isWorkSession
          ? 'Work Session'
          : workSessionCount % 3 === 0
          ? 'Long Break'
          : 'Short Break'}
      </h1>
      <h2>Session: {workSessionCount}</h2>
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
        <input
          type="number"
          onChange={(e) => setTempWorkTime(parseFloat(e.target.value) || 0)}
        />
      </div>
      <div>
        <label>Short Break Time (min): </label>
        <input
          type="number"
          onChange={(e) =>
            setTempShortBreakTime(parseFloat(e.target.value) || 0)
          }
        />
      </div>
      <div>
        <label>Long Break Time (min): </label>
        <input
          type="number"
          onChange={(e) =>
            setTempLongBreakTime(parseFloat(e.target.value) || 0)
          }
        />
      </div>
      <button onClick={handleSetNewTime}>Set new time</button>
      <h1>Total Work Time: {Math.floor(totalTime / 60)} minutes</h1>
      <button onClick={handleNextClick}>Next</button>
    </div>
  );
};

export default Pomodoro;
