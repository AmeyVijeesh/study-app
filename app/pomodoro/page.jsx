'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

const Pomodoro = () => {
  const timerRef = useRef(null);
  const [timer, setTimer] = useState(25);
  const [workTime, setWorkTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(10); // Define long break time
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [remainingTime, setRemainingTime] = useState(workTime * 60);
  const [totalTime, setTotalTime] = useState(0);
  const [workSessionCount, setWorkSessionCount] = useState(0);
  const [tempWorkTime, setTempWorkTime] = useState(0);
  const [tempShortBreakTime, setTempShortBreakTime] = useState(0);
  const [tempLongBreakTime, setTempLongBreakTime] = useState(0);
  const [lastTotalWorkTime, setLastTotalWorkTime] = useState(0); // Track last recorded total
  const [isLoading, setIsLoading] = useState(true);

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');

  const { data: session } = useSession();
  const userId = session?.user?.id; // Get user ID from session

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

  useEffect(() => {
    if (!isRunning) return;

    const timeout = setTimeout(() => {
      localStorage.setItem(
        'pomodoroState',
        JSON.stringify({
          remainingTime,
          isWorkSession,
          workSessionCount,
          timestamp: Date.now(),
        })
      );
    }, 1000); // Debounce delay

    return () => clearTimeout(timeout); // Cleanup on unmount or update
  }, [remainingTime, isRunning, isWorkSession, workSessionCount]);

  useEffect(() => {
    if (isLoading) return; // Ensure we wait until preferences are loaded

    const savedState = localStorage.getItem('pomodoroState');

    if (savedState) {
      const {
        remainingTime: savedTime,
        timestamp,
        isWorkSession: savedSession,
        workSessionCount: savedCount,
      } = JSON.parse(savedState);
      const elapsed = Math.floor((Date.now() - timestamp) / 1000);
      const newTime = savedTime - elapsed;

      if (newTime > 0) {
        setRemainingTime(newTime);
        setIsWorkSession(savedSession);
        setWorkSessionCount(savedCount);
      } else {
        setRemainingTime(workTime * 60); // Reset if too much time has passed
      }
    } else {
      setRemainingTime(workTime * 60); // If no saved state, use default
    }
  });

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch('/api/pomodoro/getPreferences');
        console.log(`fetchedd haha ${JSON.stringify(response)}`);
        if (!response.ok) throw new Error('Failed to fetch preferences');
        const data = await response.json();

        setWorkTime(data.workTime);
        console.log(data.workTime);
        setShortBreakTime(data.shortBreakTime);
        setLongBreakTime(data.longBreakTime);
        setRemainingTime(data.workTime * 60);
      } catch (error) {
        console.error('Error fetching preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!session) return;
      const userId = session?.user?.id;
      if (!userId) return;

      try {
        const date = new Date().toISOString().split('T')[0]; // Get today's date

        const response = await fetch(
          `/api/daily-log?userId=${userId}&date=${date}`
        );

        if (!response.ok) throw new Error('Error fetching sessions');
        const data = await response.json();

        setWorkSessionCount(data.sessionsToday || 0);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    fetchSessions();
  }, [session]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch('/api/subjects');
        const data = await res.json();
        setSubjects(data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    updateTimerDisplay();
  }, [remainingTime]);

  useEffect(() => {
    const sessionType = isWorkSession
      ? 'Work Time'
      : workSessionCount % 3 === 0
      ? 'Long Break'
      : 'Short Break';

    document.title = `(${formatTime(remainingTime)}) ${sessionType}`;
  }, [remainingTime, isWorkSession, workSessionCount]);

  if (isLoading) return <p>Loading...</p>;

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

        const newTime = prevTime - 1;

        // Update localStorage directly
        localStorage.setItem(
          'pomodoroState',
          JSON.stringify({
            remainingTime: newTime,
            isWorkSession,
            workSessionCount,
            timestamp: Date.now(),
          })
        );

        return newTime;
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
    localStorage.removeItem('pomodoroState'); // Clear stored state
  };

  const handleSessionSwitch = async () => {
    let updatedTotalTime = totalTime;

    if (isWorkSession) {
      setWorkSessionCount((prevCount) => prevCount + 1);
      updatedTotalTime += workTime * 60;
      setTotalTime(updatedTotalTime);

      await updateTotalWorkTime(updatedTotalTime);

      if (selectedSubject) {
        await recordStudyTime(selectedSubject, workTime);
      }
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

  const recordStudyTime = async (subjectId, timeSpent) => {
    if (!session?.user?.id) return;

    try {
      const date = new Date().toISOString().split('T')[0]; // Get today's date

      const response = await fetch('/api/daily-log/updateStudyTime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          date,
          subjectId,
          timeSpent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update study time');
      }

      console.log(`Study time updated for subject: ${subjectId}`);
    } catch (error) {
      console.error('Error updating study time:', error);
    }
  };

  const updateTotalWorkTime = async (newTotalWorkTime) => {
    console.log('called');
    try {
      const timeWorkedNow =
        Math.floor(newTotalWorkTime / 60) - lastTotalWorkTime;

      if (timeWorkedNow <= 0) return; // Prevent unnecessary updates

      console.log('Sending new work time:', timeWorkedNow);

      const response = await fetch('/api/updateWorkTime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalWorkTime: timeWorkedNow }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          `Failed to update work time: ${
            responseData.message || response.statusText
          }`
        );
      }

      console.log('Todays work time updated:', responseData.totalTimeWorked);
      setLastTotalWorkTime(Math.floor(newTotalWorkTime / 60)); // Update last known total
    } catch (error) {
      console.error('Error updating work time:', error);
    }
  };

  const handleSetNewTime = async () => {
    const newWorkTime = tempWorkTime || workTime;
    const newShortBreakTime = tempShortBreakTime || shortBreakTime;
    const newLongBreakTime = tempLongBreakTime || longBreakTime;

    setWorkTime(newWorkTime);
    setShortBreakTime(newShortBreakTime);
    setLongBreakTime(newLongBreakTime);

    setRemainingTime(
      isWorkSession
        ? newWorkTime * 60
        : (workSessionCount + 1) % 3 === 0
        ? newLongBreakTime * 60
        : newShortBreakTime * 60
    );

    try {
      const response = await fetch('/api/pomodoro/updatePreferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workTime: newWorkTime,
          shortBreakTime: newShortBreakTime,
          longBreakTime: newLongBreakTime,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update Pomodoro settings');
      }

      console.log('Pomodoro settings updated!');
    } catch (error) {
      console.error('Error updating Pomodoro settings:', error);
    }
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
      <select
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
        className="border p-2 rounded"
      >
        {subjects
          .slice() // Create a copy to avoid mutating the original array
          .sort((a, b) =>
            a.name === 'Other' ? -1 : b.name === 'Other' ? 1 : 0
          ) // Move "Other" to the top
          .map((subject) => (
            <option key={subject._id} value={subject._id}>
              {subject.name}
            </option>
          ))}
      </select>

      <div>
        <label>Work Time (min): {workTime}</label>
        <input
          type="number"
          onChange={(e) => setTempWorkTime(parseFloat(e.target.value) || 0)}
        />
      </div>
      <div>
        <label>Short Break Time (min): {shortBreakTime}</label>
        <input
          type="number"
          onChange={(e) =>
            setTempShortBreakTime(parseFloat(e.target.value) || 0)
          }
        />
      </div>
      <div>
        <label>Long Break Time (min): {longBreakTime}</label>
        <input
          type="number"
          onChange={(e) =>
            setTempLongBreakTime(parseFloat(e.target.value) || 0)
          }
        />
      </div>
      <button onClick={handleSetNewTime}>Set new time</button>
      <button onClick={handleNextClick}>Next</button>
    </div>
  );
};

export default Pomodoro;
