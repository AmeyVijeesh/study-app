'use client';

import { useState, useEffect } from 'react';
import '@/styles/pomodoro.css';

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [loading, setLoading] = useState(false);

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

  // Add subject
  const addSubject = async () => {
    if (!subjectName.trim()) return alert('Enter a subject name');
    setLoading(true);

    try {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: subjectName }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubjects([...subjects, data]); // Update UI
        setSubjectName(''); // Clear input
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error adding subject:', error);
      alert('Something went wrong');
    }
    setLoading(false);
  };

  const deleteSubject = async (id) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;

    try {
      const res = await fetch(`/api/subjects/${id}`, { method: 'DELETE' });

      if (res.ok) {
        setSubjects(subjects.filter((subject) => subject._id !== id)); // Update UI
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
      alert('Something went wrong');
    }
  };

  return (
    <div className="subjects-container">
      <h2 className="subjects-title">Subjects</h2>

      <div className="subject-form">
        <input
          type="text"
          className="subject-input"
          placeholder="Enter subject name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
        />
        <button className="add-button" onClick={addSubject} disabled={loading}>
          {loading ? 'Adding...' : 'Add Subject'}
        </button>
      </div>

      {/* Display Subjects */}
      {subjects.length > 0 ? (
        <ul className="subjects-list">
          {subjects.map((subject) => (
            <li key={subject._id} className="subject-item">
              <span className="subject-name">{subject.name}</span>
              <button
                className="delete-button"
                onClick={() => deleteSubject(subject._id)}
                title="Delete subject"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-subjects">No subjects added yet.</p>
      )}
    </div>
  );
}
