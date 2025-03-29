'use client';

import { useState, useEffect } from 'react';

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

  return (
    <>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Subjects</h2>

        <div className="p-4 border rounded-lg shadow-md">
          <input
            type="text"
            className="border p-2 w-full rounded"
            placeholder="Enter subject name"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
          />
          <button
            className="mt-2 w-full bg-blue-500 text-white py-2 rounded"
            onClick={addSubject}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Subject'}
          </button>
        </div>

        {/* Display Subjects */}
        <ul className="mt-4">
          {subjects.map((subject) => (
            <li key={subject._id} className="p-2 border-b">
              {subject.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
