'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useDailyLog from '../hooks/useDailyLog';
import '@/styles/log.css';
const UpdateLogPage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const date = searchParams.get('date');
  const router = useRouter();

  const { log, loading, error, updateLog } = useDailyLog(userId, date);

  // Form data states
  const [journal, setJournal] = useState('');
  const [victory, setVictory] = useState(null);
  const [dayRating, setDayRating] = useState(50);
  const [academicRating, setAcademicRating] = useState(50);
  const [totalTimeFocussed, setTotalTimeFocussed] = useState('');
  const [timeTable, setTimeTable] = useState('');
  const [hasExistingData, setHasExistingData] = useState(false);

  // Step tracking
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4; // Updated to include journal step

  useEffect(() => {
    if (log) {
      console.log('Fetched Log Data:', log);

      setVictory(log.victory);
      setJournal(log.journal || '');
      setDayRating(log.dayRating || 50);
      setAcademicRating(log.academicRating || 50);
      setTotalTimeFocussed(log.totalTimeFocussed || '');
      setTimeTable(JSON.stringify(log.timeTable || {}, null, 2));

      // Check if log has meaningful data already
      const hasData =
        log.victory !== undefined ||
        log.journal ||
        log.dayRating ||
        log.academicRating ||
        log.totalTimeFocussed;

      setHasExistingData(hasData);
    }
  }, [log]);

  const handleSubmit = async () => {
    await updateLog({
      victory,
      dayRating,
      academicRating,
      journal,
      totalTimeFocussed, // keeping this value unchanged
      timeTable: JSON.parse(timeTable),
    });

    router.push('/dashboard'); // Redirect back after update
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) return <h1>Loading...</h1>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div
        style={{
          display: 'flex',
          height: '100vh',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="update-log-container">
          <h2 className="page-title">Daily Log for {date}</h2>

          {hasExistingData && (
            <div className="existing-data-notice">
              <p>
                You already have a log for this day. Feel free to make changes.
              </p>
            </div>
          )}

          <div>
            <p className="progress-text">
              Step {currentStep + 1} of {totalSteps}
            </p>
          </div>

          {currentStep === 0 && (
            <div className="step-container">
              <h3 className="step-title">Was today a victory or a setback?</h3>
              <div className="victory-buttons">
                <button
                  onClick={() => {
                    setVictory(true);
                    nextStep();
                  }}
                  className={`victory-button ${
                    victory === true ? 'selected' : ''
                  }`}
                >
                  Victory
                </button>
                <button
                  onClick={() => {
                    setVictory(false);
                    nextStep();
                  }}
                  className={`setback-button ${
                    victory === false ? 'selected' : ''
                  }`}
                >
                  Setback
                </button>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="step-container">
              <h3 className="step-title">
                How would you rate your day, overall?
              </h3>
              <div className="rating-container">
                <div className="rating-labels">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={dayRating}
                  onChange={(e) => setDayRating(parseInt(e.target.value))}
                  className="rating-slider"
                />
                <p className="rating-value">{dayRating}/100</p>
                <div className="rating-descriptions">
                  <span>Challenging</span>
                  <span>Great</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-container">
              <h3 className="step-title">
                How would you rate your day, academically?
              </h3>
              <div className="rating-container">
                <div className="rating-labels">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={academicRating}
                  onChange={(e) => setAcademicRating(parseInt(e.target.value))}
                  className="rating-slider"
                />
                <p className="rating-value">{academicRating}/100</p>
                <div className="rating-descriptions">
                  <span>Challenging</span>
                  <span>Great</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="step-container">
              <h3 className="step-title">Journal Entry</h3>
              <p className="journal-instructions">
                Reflect on your day. What went well? What could be improved?
              </p>
              <textarea
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                className="journal-textarea"
                placeholder="Write your journal entry here..."
                rows={10}
              />

              {log.totalTimeFocussed > 0 && (
                <div className="focus-time-display">
                  <h4 className="focus-time-title">Today's Focus Time</h4>
                  <p className="focus-time-value">
                    {log.totalTimeFocussed} minutes
                  </p>
                </div>
              )}

              {log.studySessions && log.studySessions.length > 0 && (
                <div className="study-sessions-container">
                  <h4 className="study-sessions-title">Study Sessions</h4>
                  <ul className="study-sessions-list">
                    {log.studySessions.map((session, index) => (
                      <li key={index} className="study-session-item">
                        <strong>{session.subjectId?.name || 'Other'}</strong>:{' '}
                        {session.timeSpent} minutes
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="navigation-buttons">
            {currentStep > 0 ? (
              <button onClick={prevStep} className="back-button">
                Back
              </button>
            ) : (
              <button
                onClick={() => router.push('/')}
                className="cancel-button"
              >
                Cancel
              </button>
            )}

            <button
              onClick={currentStep === totalSteps - 1 ? handleSubmit : nextStep}
              className="next-button"
            >
              {currentStep === totalSteps - 1 ? 'Save' : 'Next'}
            </button>
          </div>

          {hasExistingData && (
            <div className="quick-view-container">
              <h3 className="quick-view-title">Current Log Summary</h3>
              <div className="quick-view-content">
                <p>
                  <strong>Victory/Setback:</strong>{' '}
                  {victory === true
                    ? 'Victory '
                    : victory === false
                    ? 'Setback '
                    : 'Not set'}
                </p>
                <p>
                  <strong>Day Rating:</strong> {dayRating}/100
                </p>
                <p>
                  <strong>Academic Rating:</strong> {academicRating}/100
                </p>
                <p>
                  <strong>Focus Time:</strong> {log.totalTimeFocussed || 0}{' '}
                  minutes
                </p>
                <div className="quick-view-journal">
                  <strong>Journal:</strong>
                  <p className="journal-preview">
                    {journal
                      ? journal.length > 100
                        ? journal.substring(0, 100) + '...'
                        : journal
                      : 'No journal entry'}
                  </p>
                </div>
                {log.totalTimeFocussed > 0 && (
                  <div className="focus-time-display">
                    <h4 className="focus-time-title">Today's Focus Time</h4>
                    <p className="focus-time-value">
                      {log.totalTimeFocussed} minutes
                    </p>
                  </div>
                )}
                {log.sessionsToday && log.studySessions.length > 0 && (
                  <div className="study-sessions-container">
                    <h4 className="study-sessions-title">Study Sessions</h4>
                    <ul className="study-sessions-list">
                      {log.studySessions.map((session, index) => (
                        <li key={index} className="study-session-item">
                          <strong>{session.subjectId?.name || 'Other'}</strong>:{' '}
                          {session.timeSpent} minutes
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UpdateLogPage;
