'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import '@/styles/pomodoro.css';

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

  const [userStreak, setUserStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');

  const [showSettings, setShowSettings] = useState(false);

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
  }, [isLoading, workTime]); // Add dependencies

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
    setRemainingTime(workTime * 60);
    updateTimerDisplay();
    localStorage.removeItem('pomodoroState'); // Clear stored state
  };

  // Enhanced handleSessionSwitch function with streak updates
  const handleSessionSwitch = async () => {
    let updatedTotalTime = totalTime;

    if (isWorkSession) {
      const newWorkSessionCount = workSessionCount + 1;
      setWorkSessionCount(newWorkSessionCount);
      updatedTotalTime += workTime * 60;
      setTotalTime(updatedTotalTime);

      await updateTotalWorkTime(updatedTotalTime);

      if (selectedSubject) {
        await recordStudyTime(selectedSubject, workTime);
      }

      // Update streak when a work session is completed
      await updateUserStreak();

      const breakTime =
        newWorkSessionCount % 3 === 0 ? longBreakTime : shortBreakTime;
      setRemainingTime(breakTime * 60);
      setIsWorkSession(false);
    } else {
      setRemainingTime(workTime * 60);
      setIsWorkSession(true);
    }
  };

  // New function to update user streak
  const updateUserStreak = async () => {
    console.log('called steak beef');
    try {
      const response = await fetch('/api/streak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update streak');
      }

      const data = await response.json();

      // Update UI with new streak information
      setUserStreak(data.streak);
      setHighestStreak(data.highestStreak);

      // If you want to show a notification when streak increases
      if (data.streak > 1) {
        showStreakNotification(data.streak);
      }
    } catch (error) {
      console.error('Error updating streak:', error);
      // Optionally handle error in UI
    }
  };

  // Optional: Show a notification when streak increases
  const showStreakNotification = (streakCount) => {
    // Create and show a toast or notification
    const notification = document.createElement('div');
    notification.className = 'streak-notification';
    notification.innerHTML = `
    <div class="streak-icon">🔥</div>
    <div class="streak-text">
      <strong>Streak: ${streakCount} days</strong>
      <span>Keep up the great work!</span>
    </div>
  `;

    document.body.appendChild(notification);

    // Remove after a few seconds
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 500);
    }, 3000);
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

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className="pomodoro-container">
      <div className="pomodoro-wrapper">
        <h1 className="session-title">
          {isWorkSession
            ? 'Time to Work :)'
            : workSessionCount % 3 === 0
            ? 'Long Break'
            : 'Short Break'}
        </h1>

        <div className="timer-card">
          <div className="session-info">
            <div className="session-count">Session: {workSessionCount}</div>
            <div className="subject-selector">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="subject-select"
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="timer-display">{formatTime(remainingTime)}</div>

          <div className="timer-controls">
            {!isRunning ? (
              <button onClick={startTimer} className="control-btn start-btn">
                Start
              </button>
            ) : (
              <button onClick={pauseTimer} className="control-btn pause-btn">
                Pause
              </button>
            )}
            <button onClick={resetTimer} className="control-btn reset-btn">
              Reset
            </button>
            <button onClick={handleNextClick} className="control-btn next-btn">
              Next
            </button>
          </div>

          <div className="settings-toggle-container">
            <button onClick={toggleSettings} className="settings-toggle-btn">
              <span className="settings-icon">⚙️</span> Settings
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="settings-card">
            <h2 className="settings-title">Timer Settings</h2>
            <div className="settings-grid">
              <div className="setting-item">
                <label className="setting-label">Work Time (min)</label>
                <input
                  type="number"
                  className="setting-input"
                  value={tempWorkTime || workTime}
                  onChange={(e) =>
                    setTempWorkTime(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div className="setting-item">
                <label className="setting-label">Short Break (min)</label>
                <input
                  type="number"
                  className="setting-input"
                  value={tempShortBreakTime || shortBreakTime}
                  onChange={(e) =>
                    setTempShortBreakTime(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div className="setting-item">
                <label className="setting-label">Long Break (min)</label>
                <input
                  type="number"
                  className="setting-input"
                  value={tempLongBreakTime || longBreakTime}
                  onChange={(e) =>
                    setTempLongBreakTime(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
            </div>
            <div className="settings-actions">
              <button onClick={handleSetNewTime} className="save-settings-btn">
                Save Settings
              </button>
            </div>
          </div>
        )}

        <div className="progress-card">
          <h2 className="progress-title">Session Progress</h2>
          <div className="progress-stats">
            <div className="stat-item">
              <div className="stat-label">Completed Sessions</div>
              <div className="stat-value">{workSessionCount}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Current Phase</div>
              <div className="stat-value">
                {isWorkSession
                  ? 'Work'
                  : workSessionCount % 3 === 0
                  ? 'Long Break'
                  : 'Short Break'}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Next Phase</div>
              <div className="stat-value">
                {isWorkSession
                  ? workSessionCount % 3 === 0
                    ? 'Long Break'
                    : 'Short Break'
                  : 'Work'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
